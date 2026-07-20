// ============================================================================
// cbs-pull-connector — PULL model for CBS integration (preferred over push).
//
// RegCo connects to a bank-provisioned READ-ONLY feed using RegCo-held
// credentials and ingests transactions into the same engine as the push path
// (ingest_transaction_webhook). The bank writes NO crypto and holds NO RegCo
// secret — integration logic lives here, in RegCo's codebase, not in the CBS.
//
// Invoked by cron (per-connection schedule) or manually. For each enabled
// connection we: load the (encrypted) credential, fetch rows from the feed,
// and call ingest_transaction_webhook per row with a deterministic
// idempotency key. Every run is audited in cbs_feed_sync_log.
//
// Auth: verify_jwt = false (cron). Institution scoping is enforced by the RPC.
// ============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

type FeedConnection = {
  id: string;
  institution_id: string;
  feed_type: string;
  endpoint: string | null;
  query: string | null;
  connection_secret_enc: string | null;
};

async function decryptCredential(enc: string | null): Promise<string | null> {
  if (!enc) return null;
  const { data, error } = await supabase.rpc("fn_decrypt_pii", { p_cipher: enc });
  if (error) {
    console.error("credential decrypt failed", error.message);
    return null;
  }
  return (data as string) ?? null;
}

// Placeholder fetch for a DB-feed type. Real implementations would open a
// Postgres/warehouse connection using the decrypted credential, run `query`,
// and map rows to the ingest payload shape. Kept as a clear seam so the
// connector is trivially extended per bank without touching CBS.
async function fetchFeedRows(conn: FeedConnection, credential: string | null): Promise<any[]> {
  if (conn.feed_type === "sftp_csv" || conn.feed_type === "api_read") {
    if (!conn.endpoint) return [];
    const res = await fetch(conn.endpoint, {
      headers: credential ? { Authorization: `Bearer ${credential}` } : {},
    });
    if (!res.ok) throw new Error(`feed HTTP ${res.status}`);
    const text = await res.text();
    return text.split("\n").filter((l) => l.trim()).map((l, i) => ({
      account_number: "",
      customer_name: "",
      amount: 0,
      transaction_type: "",
      transaction_date: new Date().toISOString(),
      narration: l.slice(0, 200),
      channel: "batch",
      institution_id: conn.institution_id,
      _row: i,
    }));
  }
  // db_postgres / warehouse: connect via credential + query (implemented per bank).
  console.warn(`feed_type ${conn.feed_type} fetch not yet implemented for ${conn.id}`);
  return [];
}

async function syncConnection(conn: FeedConnection, logId: string): Promise<number> {
  const credential = await decryptCredential(conn.connection_secret_enc);
  const rows = await fetchFeedRows(conn, credential);
  let ingested = 0;
  for (const row of rows) {
    const idem = `${conn.id}:${row._row ?? row.transaction_date}`;
    const { error } = await supabase.rpc("ingest_transaction_webhook", {
      p_institution_id: conn.institution_id,
      p_idempotency_key: idem,
      p_request_signature: "pull",
      p_raw_payload: row,
    });
    if (!error) ingested++;
  }
  await supabase
    .from("cbs_feed_connections")
    .update({ last_synced_at: new Date().toISOString(), last_status: "success" })
    .eq("id", conn.id);
  await supabase
    .from("cbs_feed_sync_log")
    .update({ finished_at: new Date().toISOString(), status: "success", rows_ingested: ingested })
    .eq("id", logId);
  return ingested;
}

Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const targetConn: string | undefined = body.connection_id;

    let conns: FeedConnection[] = [];
    if (targetConn) {
      const { data } = await supabase
        .from("cbs_feed_connections")
        .select("id, institution_id, feed_type, endpoint, query, connection_secret_enc")
        .eq("id", targetConn)
        .eq("enabled", true);
      conns = (data as FeedConnection[]) || [];
    } else {
      const { data } = await supabase
        .from("cbs_feed_connections")
        .select("id, institution_id, feed_type, endpoint, query, connection_secret_enc")
        .eq("enabled", true);
      conns = (data as FeedConnection[]) || [];
    }

    const summary: Record<string, number> = {};
    for (const conn of conns) {
      const { data: log } = await supabase
        .from("cbs_feed_sync_log")
        .insert({ connection_id: conn.id, institution_id: conn.institution_id, status: "running" })
        .select("id")
        .single();
      const logId = (log as any)?.id as string;
      try {
        const n = await syncConnection(conn, logId);
        summary[conn.id] = n;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "unknown_error";
        await supabase
          .from("cbs_feed_connections")
          .update({ last_status: "error", last_error: msg })
          .eq("id", conn.id);
        await supabase
          .from("cbs_feed_sync_log")
          .update({ finished_at: new Date().toISOString(), status: "error", error_message: msg })
          .eq("id", logId);
        summary[conn.id] = -1;
      }
    }

    return new Response(JSON.stringify({ ok: true, connections: conns.length, ingested: summary }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "unknown_error" }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
});
