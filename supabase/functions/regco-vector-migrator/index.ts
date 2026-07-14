import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const REGCO_SERVICE_ROLE_KEY = Deno.env.get("REGCO_SERVICE_ROLE_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const MODEL_NAME = "models/text-embedding-2-001";
const EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-2-001:embedContent?key=";
const BATCH_SIZE = 20;
const SLEEP_MS = 5000;

type PendingRow = {
  id: unknown;
  content: unknown;
};

type EmbeddingResponse = {
  embedding?: {
    values?: unknown;
  };
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function toSafeString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  try {
    return JSON.stringify(value);
  } catch (_err) {
    return String(value);
  }
}

function makeJsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: { "Content-Type": "application/json" }
  });
}

function isNumberArray(values: unknown): values is number[] {
  if (!Array.isArray(values)) return false;
  if (values.length === 0) return false;
  for (let i = 0; i < values.length; i++) {
    if (typeof values[i] !== "number") return false;
  }
  return true;
}

async function embedText(text: string): Promise<{ ok: boolean; values?: number[]; error?: string }> {
  if (!isNonEmptyString(GEMINI_API_KEY)) {
    return { ok: false, error: "Missing GEMINI_API_KEY" };
  }

  let response: Response;
  try {
    response = await fetch(EMBED_URL + GEMINI_API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        content: {
          parts: [
            {
              text: text
            }
          ]
        }
      })
    });
  } catch (err) {
    return { ok: false, error: "Gemini fetch failed: " + toSafeString(err) };
  }

  let raw = "";
  try {
    raw = await response.text();
  } catch (err) {
    return { ok: false, error: "Failed reading Gemini response: " + toSafeString(err) };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: "Gemini HTTP " + response.status + ": " + raw
    };
  }

  let parsed: EmbeddingResponse | null = null;
  try {
    parsed = JSON.parse(raw) as EmbeddingResponse;
  } catch (err) {
    return { ok: false, error: "Gemini returned invalid JSON: " + toSafeString(err) };
  }

  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "Gemini returned empty payload" };
  }

  if (!parsed.embedding || !isNumberArray(parsed.embedding.values)) {
    return { ok: false, error: "Gemini response missing valid embedding.values" };
  }

  return { ok: true, values: parsed.embedding.values };
}

Deno.serve(async function (_req) {
  if (!isNonEmptyString(SUPABASE_URL) || !isNonEmptyString(REGCO_SERVICE_ROLE_KEY)) {
    return makeJsonResponse(
      {
        ok: false,
        error: "Missing Supabase config"
      },
      500
    );
  }

  if (!isNonEmptyString(GEMINI_API_KEY)) {
    return makeJsonResponse(
      {
        ok: false,
        error: "Missing Gemini API key"
      },
      500
    );
  }

  const supabase = createClient(SUPABASE_URL, REGCO_SERVICE_ROLE_KEY);

  let pendingRows: PendingRow[] | null = null;
  let selectError: unknown = null;

  try {
    const result = await supabase
      .from("knowledge_base")
      .select("id, content")
      .is("embedding", null)
      .limit(BATCH_SIZE);

    pendingRows = result.data as PendingRow[] | null;
    selectError = result.error;
  } catch (err) {
    console.error("Supabase select threw:", toSafeString(err));
    return makeJsonResponse(
      {
        ok: false,
        error: "Database query threw"
      },
      500
    );
  }

  if (selectError) {
    console.error("Supabase select error:", toSafeString(selectError));
    return makeJsonResponse(
      {
        ok: false,
        error: "Database query failed"
      },
      500
    );
  }

  if (!pendingRows || !Array.isArray(pendingRows) || pendingRows.length === 0) {
    return makeJsonResponse(
      {
        ok: true,
        processed: 0,
        failed: 0,
        remaining: 0,
        message: "No rows pending"
      },
      200
    );
  }

  let processed = 0;
  let failed = 0;

  for (let i = 0; i < pendingRows.length; i++) {
    const row = pendingRows[i];

    if (!row || !isNonEmptyString(row.id) || !isNonEmptyString(row.content)) {
      failed += 1;
      console.error("Skipping malformed row at index " + i);
      if (i < pendingRows.length - 1) {
        await sleep(SLEEP_MS);
      }
      continue;
    }

    const rowId = row.id;
    const rowContent = row.content;

    const embeddingResult = await embedText(rowContent);

    if (!embeddingResult.ok || !embeddingResult.values) {
      failed += 1;
      console.error("Embedding failed for row " + rowId + ": " + embeddingResult.error);
      if (i < pendingRows.length - 1) {
        await sleep(SLEEP_MS);
      }
      continue;
    }

    try {
      const updateResult = await supabase
        .from("knowledge_base")
        .update({ embedding: embeddingResult.values })
        .eq("id", rowId);

      if (updateResult.error) {
        failed += 1;
        console.error("Supabase update error for row " + rowId + ": " + toSafeString(updateResult.error));
        if (i < pendingRows.length - 1) {
          await sleep(SLEEP_MS);
        }
        continue;
      }
    } catch (err) {
      failed += 1;
      console.error("Supabase update threw for row " + rowId + ": " + toSafeString(err));
      if (i < pendingRows.length - 1) {
        await sleep(SLEEP_MS);
      }
      continue;
    }

    processed += 1;
    console.log("Updated row " + rowId);

    if (i < pendingRows.length - 1) {
      await sleep(SLEEP_MS);
    }
  }

  return makeJsonResponse(
    {
      ok: true,
      processed: processed,
      failed: failed,
      batchSize: pendingRows.length,
      model: MODEL_NAME
    },
    200
  );
});
