import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Fail-closed CORS: only reflect the configured production origin.
// Set CORS_ALLOWED_ORIGIN in Supabase function env to the Vercel domain.
function corsHeaders(req: Request): HeadersInit {
  const allowed = Deno.env.get("CORS_ALLOWED_ORIGIN");
  const origin = req.headers.get("origin");
  const allow = allowed && origin === allowed ? allowed : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

// Escape a string for safe inclusion inside an XML text node / attribute.
function xmlEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Format an ISO timestamp into the GoAML expected yyyy-MM-ddTHH:mm:ss shape.
function xmlDateTime(value: string | undefined | null): string {
  if (!value) return new Date().toISOString().replace(/\.\d+Z$/, "Z");
  const d = new Date(value);
  if (isNaN(d.getTime())) return new Date().toISOString().replace(/\.\d+Z$/, "Z");
  return d.toISOString().replace(/\.\d+Z$/, "Z");
}

function xmlDate(value: string | undefined | null): string {
  return xmlDateTime(value).slice(0, 10);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(req) });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const case_id = body.case_id as string | undefined;
    const report_type = body.report_type as string | undefined;
    if (!case_id) {
      return new Response(JSON.stringify({ error: "case_id is required" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Resolve the requesting user for tenant scoping.
    const token = authHeader.replace("Bearer ", "");
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );
    const { data: claims } = await admin.auth.getClaims(token);
    const userId = claims?.claims?.sub;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized: User ID not found" }), {
        status: 401,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Pull the case (and verify tenant ownership via user_id).
    const { data: cases, error: caseErr } = await admin
      .from("cases")
      .select("*")
      .eq("id", case_id)
      .eq("user_id", userId)
      .limit(1);
    if (caseErr) throw caseErr;
    const kase = cases && cases.length > 0 ? cases[0] : null;
    if (!kase) {
      return new Response(JSON.stringify({ error: "Case not found or access denied" }), {
        status: 404,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Pull related investigation context.
    const [{ data: events }, { data: artifacts }, { data: customer }, { data: transactions }, { data: institution }] =
      await Promise.all([
        admin.from("case_events").select("*").eq("case_id", case_id).order("created_at", { ascending: true }),
        admin.from("case_artifacts").select("*").eq("case_id", case_id),
        kase.customer_id
          ? admin.from("customers").select("*").eq("id", kase.customer_id).maybeSingle()
          : Promise.resolve({ data: null }),
        kase.customer_id
          ? admin.from("unified_transactions").select("*").eq("customer_id", kase.customer_id).order("transaction_date", { ascending: true }).limit(50)
          : Promise.resolve({ data: [] }),
        kase.institution_id
          ? admin.from("institutions").select("name, cbn_code").eq("id", kase.institution_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

    const reportType = (report_type || (kase.trigger_kind === "transaction" ? "STR" : "STR")).toUpperCase();
    const now = new Date();
    const filingNo = `NFIU-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${case_id.slice(0, 8).toUpperCase()}`;

    // The REPORTING INSTITUTION is the bank (institution), not the
    // software vendor. Pull its registered name / CBN code.
    const institutionName = institution?.name || "Unknown Institution";
    const institutionCode = institution?.cbn_code || kase.institution_id || "";

    // Subject real name lives on the transaction row (plaintext from the CBS
    // feed). customers.full_name_hash is NOT reversible, so we never
    // dump a hash as the subject name — use the transaction name,
    // falling back to the case title.
    const subjectName = (transactions && (transactions as any[])[0]?.customer_name)
      ? xmlEscape((transactions as any[])[0].customer_name)
      : xmlEscape(kase.title || "Unknown Subject");
    const customerSegment = customer?.customer_segment || "individual";

    const txnRows = (transactions || [])
      .map((t) => {
        const row = t as {
          id?: string;
          transaction_ref?: string;
          transaction_date?: string;
          amount?: number | string;
          currency?: string;
          transaction_type?: string;
          channel?: string;
          counterparty?: string;
          narration?: string;
          is_flagged?: boolean;
        };
        return `
      <Transaction>
        <TransactionNumber>${xmlEscape(row.transaction_ref || row.id)}</TransactionNumber>
        <TransactionDate>${xmlDateTime(row.transaction_date)}</TransactionDate>
        <Amount>${xmlEscape(row.amount)}</Amount>
        <CurrencyCode>${xmlEscape(row.currency || "NGN")}</CurrencyCode>
        <TransactionType>${xmlEscape(row.transaction_type || "OTHER")}</TransactionType>
        <Channel>${xmlEscape(row.channel || "UNKNOWN")}</Channel>
        <Counterparty>${xmlEscape(row.counterparty || "")}</Counterparty>
        <Narration>${xmlEscape(row.narration || "")}</Narration>
        <Flagged>${row.is_flagged ? "true" : "false"}</Flagged>
      </Transaction>`;
      })
      .join("");

    const activityRows = (events || [])
      .map((e) => {
        const row = e as {
          created_at?: string;
          event_type?: string;
          kind?: string;
          note?: string;
          description?: string;
        };
        return `
      <Activity>
        <ActivityDate>${xmlDateTime(row.created_at)}</ActivityDate>
        <ActivityType>${xmlEscape(row.event_type || row.kind || "NOTE")}</ActivityType>
        <Description>${xmlEscape(row.note || row.description || "")}</Description>
      </Activity>`;
      })
      .join("");

    const reportReason = xmlEscape(
      kase.summary || kase.title || "Suspicious activity identified during transaction monitoring."
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<GoAML_4_0 xmlns="http://goaml.org/schema/4.0"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://goaml.org/schema/4.0 goaml_4_0.xsd">
  <ReportingInstitution>
    <InstitutionCode>${xmlEscape(institutionCode)}</InstitutionCode>
    <InstitutionName>${xmlEscape(institutionName)}</InstitutionName>
    <CountryCode>NG</CountryCode>
    <SubmissionDate>${xmlDateTime(now.toISOString())}</SubmissionDate>
  </ReportingInstitution>
  <Report>
    <ReportType>${xmlEscape(reportType)}</ReportType>
    <FilingNumber>${xmlEscape(filingNo)}</FilingNumber>
    <ReportReason>${reportReason}</ReportReason>
    <ReportDate>${xmlDate(kase.opened_at)}</ReportDate>
  </Report>
  <Subject>
    <SubjectType>${xmlEscape(customerSegment === "corporate" ? "LEGAL_PERSON" : "NATURAL_PERSON")}</SubjectType>
    <FullName>${subjectName}</FullName>
    <CustomerSegment>${xmlEscape(customerSegment)}</CustomerSegment>
    <CaseId>${xmlEscape(kase.id)}</CaseId>
    <CaseSeverity>${xmlEscape(kase.severity || "medium")}</CaseSeverity>
    <CaseStatus>${xmlEscape(kase.status || "open")}</CaseStatus>
  </Subject>
  <Transactions>${txnRows}
  </Transactions>
  <InvestigationActivities>${activityRows}
  </InvestigationActivities>
  <Artifacts>
${(artifacts || [])
  .map((a) => {
    const row = a as { name?: string; title?: string; kind?: string; type?: string };
    return `    <Artifact><Name>${xmlEscape(row.name || row.title || "artifact")}</Name><Kind>${xmlEscape(row.kind || row.type || "EVIDENCE")}</Kind></Artifact>`;
  })
  .join("\n")}
  </Artifacts>
</GoAML_4_0>`;

    // Persist the generated report, updating any existing draft for this case+type.
    const { data: existing } = await admin
      .from("nfiu_reports")
      .select("id")
      .eq("case_id", case_id)
      .eq("report_type", reportType)
      .eq("user_id", userId)
      .limit(1);

    let reportId: string;
    if (existing && existing.length > 0) {
      reportId = existing[0].id;
      const { error: updErr } = await admin
        .from("nfiu_reports")
        .update({ xml_content: xml, status: "draft", updated_at: now.toISOString() })
        .eq("id", reportId);
      if (updErr) throw updErr;
    } else {
      const { data: inserted, error: insErr } = await admin
        .from("nfiu_reports")
        .insert({
          user_id: userId,
          report_type: reportType,
          case_id,
          xml_content: xml,
          status: "draft",
        })
        .select("id")
        .single();
      if (insErr) throw insErr;
      reportId = inserted.id;
    }

    return new Response(
      JSON.stringify({
        success: true,
        report_id: reportId,
        report_type: reportType,
        filing_number: filingNo,
        xml_content: xml,
      }),
      { status: 200, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("generate-nfiu-report unexpected error:", err);
    return new Response(JSON.stringify({ error: "An internal error occurred." }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
