// Generate a regulatory report from form data using Lovable AI Gateway
// Produces a plain UTF-8 .txt file, uploads to the `reports` bucket, updates the reports row.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

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

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

function ngn(n: unknown) {
  const v = typeof n === "string" ? parseFloat(n) : (n as number);
  if (!Number.isFinite(v)) return "0";
  return new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 }).format(v);
}

function buildSystemPrompt(reportType: string): string {
  if (reportType === "SCUML Annual Compliance") {
    return `You are a Nigerian AML/CFT compliance expert. Generate a complete SCUML Annual Compliance Report for a Nigerian licensed financial institution in the exact format required by the Special Control Unit Against Money Laundering (SCUML). Use the structured data provided. Output PLAIN TEXT only, preserving the section headings, dividers, and spacing exactly as shown in the template. Do not add commentary, markdown, or backticks.`;
  }
  if (reportType === "NDIC Premium Return") {
    return `You are a Nigerian banking regulatory expert. Generate a complete NDIC Annual Premium Return for a Nigerian Microfinance Bank in the exact format required by the Nigeria Deposit Insurance Corporation. Use the structured data provided. Output PLAIN TEXT only, preserving section headings, alignment, and dividers exactly. No markdown, no commentary.`;
  }
  if (reportType === "VAT Return") {
    return `You are a Nigerian tax compliance expert. Generate a complete FIRS Monthly VAT Return for a Nigerian financial institution. Current Nigeria VAT rate is 7.5% per Finance Act 2019. Use the structured data provided. Output PLAIN TEXT only, preserving section headings, dividers, and spacing exactly as shown in the template. No markdown, no commentary, no backticks.`;
  }
  if (reportType === "PAYE Remittance") {
    return `You are a Nigerian tax compliance expert. Generate a complete FIRS Monthly PAYE Remittance Return for a Nigerian employer. Use the structured data provided. Output PLAIN TEXT only, preserving section headings, dividers, and spacing exactly as shown in the template. No markdown.`;
  }
  if (reportType === "Withholding Tax Return") {
    return `You are a Nigerian tax compliance expert. Generate a complete FIRS Monthly Withholding Tax Return tracking deductions at source on rent (10%), dividends (10%), interest (10%), contracts (5%), and professional fees (10%). Use the structured data provided. Output PLAIN TEXT only, preserving the schedule, dividers, and certification block exactly. No markdown.`;
  }
  if (reportType === "Company Income Tax Return") {
    return `You are a Nigerian tax compliance expert. Generate a complete FIRS Company Income Tax Return for a Nigerian financial institution. CIT rates: 0% (turnover < ₦25M), 20% (₦25M–₦100M), 30% (> ₦100M). Education tax: 2.5% of assessable profit. Use the structured data provided. Output PLAIN TEXT only, preserving section headings, dividers, and spacing exactly. No markdown.`;
  }
  return `You are a Nigerian banking regulatory expert. Generate a complete NDIC Single Obligor Report for a Nigerian Microfinance Bank tracking large credit exposures against the 5% single obligor limit. Use the structured data provided. Output PLAIN TEXT only, preserving the schedule, dividers, and certification block exactly. No markdown.`;
}

function buildUserPrompt(reportType: string, payload: any, ctx: any): string {
  if (reportType === "SCUML Annual Compliance") {
    const a = payload.section_a, b = payload.section_b, c = payload.section_c,
          d = payload.section_d, e = payload.section_e, f = payload.section_f, g = payload.section_g;
    const total = parseFloat(c.total_customers) || 0;
    const pct = (n: string) => total > 0 ? `${((parseFloat(n) || 0) / total * 100).toFixed(1)}` : "0.0";
    return `Generate using this exact template, filling in the values:

SPECIAL CONTROL UNIT AGAINST MONEY LAUNDERING (SCUML)
ANNUAL COMPLIANCE REPORT
REPORTING YEAR: ${a.reporting_year}
==========================================

PART 1: INSTITUTION IDENTIFICATION
Institution Name: ${a.institution_name}
SCUML Registration Number: ${a.scuml_reg_number}
CBN License Number: ${a.cbn_license_number}
Reporting Year: ${a.reporting_year}
Chief Compliance Officer: ${a.co_name}
CCO Contact: ${a.co_email} | ${a.co_phone}

PART 2: AML/CFT COMPLIANCE PROGRAMME
Written AML/CFT Policy: ${b.has_policy}
Policy Reviewed in Year: ${b.policy_reviewed}
Date of Board Approval: ${b.board_approval_date}
Risk Assessment Conducted: ${b.does_risk_assessment}
Risk Assessment Frequency: ${b.risk_freq}

PART 3: CUSTOMER DUE DILIGENCE
Total Customers (Year End): ${c.total_customers}
KYC Complete: ${c.kyc_complete} (${pct(c.kyc_complete)}%)
KYC Incomplete: ${c.kyc_incomplete} (${pct(c.kyc_incomplete)}%)
Enhanced Due Diligence Conducted: ${c.edd_conducted}
Customers Subjected to EDD: ${c.edd_count}
Accounts Closed (KYC Failure): ${c.closed_kyc}

PART 4: TRANSACTION MONITORING AND REPORTING
STRs Filed (Year): ${d.str_filed}
CTRs Filed (Year): ${d.ctr_filed}
Automated Monitoring System: ${d.automated_monitoring} — ${d.monitoring_system_name || "N/A"}

PART 5: STAFF TRAINING
Staff Trained: ${e.staff_trained}
Training Type: ${e.trainer_type}
Sessions Conducted: ${e.sessions}
Total Training Hours: ${e.training_hours}

PART 6: REGULATORY EXAMINATION
SCUML Examination: ${f.examined}
Examination Date: ${f.exam_date || "N/A"}
Outcome: ${f.outcome || "N/A"}
Sanctions: ${f.sanctions || "No"} — ${f.sanction_nature || "N/A"}

PART 7: DECLARATION
I hereby certify that this Annual Compliance Report is true, accurate and complete.
Chief Executive Officer: ${g.ceo_name}
Chief Compliance Officer: ${g.cco_name}
Date: ${g.submission_date}
==========================================
Generated by RegCo Technologies Limited`;
  }

  if (reportType === "NDIC Premium Return") {
    const a = payload.section_a, b = payload.section_b, c = payload.section_c,
          d = payload.section_d, e = payload.section_e, cp = payload.computed;
    return `Generate using this exact template, filling in the values:

NIGERIA DEPOSIT INSURANCE CORPORATION
ANNUAL PREMIUM RETURN
MICROFINANCE BANK CATEGORY
REPORTING YEAR: ${a.reporting_year}
==========================================

SECTION 1: INSTITUTION IDENTIFICATION
Institution: ${a.institution_name}
CBN License: ${a.cbn_license_number}
NDIC Certificate: ${a.ndic_cert_number}
Financial Year End: ${a.fy_end}

SECTION 2: DEPOSIT LIABILITY SCHEDULE
                                         ₦
Total Deposits (Year End):         ${ngn(b.total_deposits)}
Less: Uninsured Deposits           ${ngn(b.uninsured_portion)}
(Deposits above ₦500,000 limit)
─────────────────────────────────────────
TOTAL INSURED DEPOSITS:            ${ngn(cp.total_insured)}
Number of Deposit Accounts:        ${b.num_accounts}
Accounts Above ₦500,000:           ${b.num_above_500k}

SECTION 3: PREMIUM COMPUTATION
Total Insured Deposits:            ₦${ngn(cp.total_insured)}
Premium Rate (MFB Category):       0.40%
─────────────────────────────────────────
PREMIUM PAYABLE:                   ₦${ngn(cp.premium_payable)}

Payment Status: ${c.paid === "Yes" ? "Paid" : "Unpaid"}
Payment Date: ${c.payment_date || "N/A"}
NDIC Receipt No: ${c.receipt_number || "N/A"}

SECTION 4: DEPOSIT BREAKDOWN
Savings Deposits:                  ₦${ngn(d.savings)}
Current Account Deposits:          ₦${ngn(d.current)}
Fixed/Term Deposits:               ₦${ngn(d.fixed)}
Other Deposits:                    ₦${ngn(d.other)}
─────────────────────────────────────────
TOTAL:                             ₦${ngn(cp.deposit_total)}

CERTIFICATION
I certify this return is accurate and complete.
CEO: ${e.ceo_name} | CFO: ${e.cfo_name} | Date: ${e.date}
==========================================
Generated by RegCo Technologies Limited`;
  }

  if (reportType === "VAT Return") {
    const a = payload.section_a, b = payload.section_b, c = payload.section_c,
          d = payload.section_d, e = payload.section_e, cp = payload.computed;
    return `Generate using this exact template, filling in the values:

FEDERAL INLAND REVENUE SERVICE
VALUE ADDED TAX (VAT) RETURN
FORM 002
REPORTING PERIOD: ${a.period}
==========================================

TAXPAYER INFORMATION
Business Name: ${a.business_name}
TIN: ${a.tin}
VAT Registration No: ${a.vat_reg_number || "N/A"}
Period: ${a.period}

PART A: OUTPUT VAT
Total Taxable Supplies:         ₦${ngn(b.taxable_supplies)}
VAT Rate:                       7.5%
Output VAT:                     ₦${ngn(cp.output_vat)}

PART B: INPUT VAT
Total Taxable Purchases:        ₦${ngn(c.taxable_purchases)}
Input VAT Claimable:            ₦${ngn(cp.input_vat)}

PART C: NET VAT COMPUTATION
Output VAT:                     ₦${ngn(cp.output_vat)}
Less: Input VAT:               (₦${ngn(cp.input_vat)})
─────────────────────────────────────
NET VAT ${cp.net_vat < 0 ? "CREDIT CARRIED FORWARD" : "PAYABLE"}: ${cp.net_vat < 0 ? "−" : ""}₦${ngn(Math.abs(cp.net_vat))}

Payment Status: ${d.paid}
Payment Date: ${d.payment_date || "N/A"}
FIRS Receipt No: ${d.receipt_number || "N/A"}

DECLARATION
I declare this return is correct and complete.
Authorised Signatory: ${e.signatory_name}
Designation: ${e.designation}
Date: ${e.date}
==========================================
Generated by RegCo Technologies Limited`;
  }

  if (reportType === "PAYE Remittance") {
    const a = payload.section_a, b = payload.section_b, c = payload.section_c,
          d = payload.section_d, cp = payload.computed;
    const mode = payload.mode;
    const employees = (payload.employees as any[]) || [];
    const empBlock = mode === "detailed" && employees.length > 0
      ? `\nEMPLOYEE SCHEDULE\n` +
        `${"Name".padEnd(22)} ${"Grade".padEnd(8)} ${"Gross ₦".padStart(13)} ${"PAYE ₦".padStart(13)}\n` +
        `─────────────────────────────────────────────────────────────────\n` +
        employees.map(e => `${(e.name || "").padEnd(22).slice(0, 22)} ${(e.grade || "").padEnd(8).slice(0, 8)} ${ngn(e.gross).padStart(13)} ${ngn(e.paye).padStart(13)}`).join("\n") +
        `\n─────────────────────────────────────────────────────────────────\n`
      : "";
    const totalGross = mode === "summary" ? ngn(b.total_gross) : ngn(employees.reduce((s, e) => s + (parseFloat(e.gross) || 0), 0));
    const totalDeductions = mode === "summary" ? ngn(b.total_deductions) : ngn(employees.reduce((s, e) => s + (parseFloat(e.pension) || 0) + (parseFloat(e.nhf) || 0) + (parseFloat(e.nhis) || 0), 0));
    const numEmployees = mode === "summary" ? b.num_employees : String(employees.length);
    return `Generate using this exact template, filling in the values:

FEDERAL INLAND REVENUE SERVICE
PAY AS YOU EARN (PAYE) REMITTANCE
FORM H1
REPORTING PERIOD: ${a.period}
==========================================

EMPLOYER DETAILS
Employer: ${a.employer_name}
TIN: ${a.tin}
Tax Authority: ${a.state_irs}
Period: ${a.period}
Number of Employees: ${numEmployees}
${empBlock}
PAYROLL SUMMARY
Total Gross Salaries:           ₦${totalGross}
Less Statutory Deductions:
  Pension / NHF / NHIS:        (₦${totalDeductions})
─────────────────────────────────────────
Total Chargeable Income:        ₦${ngn(cp.chargeable_income)}
─────────────────────────────────────────
TOTAL PAYE DEDUCTED:            ₦${ngn(cp.total_paye)}

REMITTANCE
Total PAYE to Remit:            ₦${ngn(cp.total_paye)}
Payment Status: ${c.paid === "Yes" ? "Paid" : "Unpaid"}
Payment Date: ${c.payment_date || "N/A"}
FIRS Receipt No: ${c.receipt_number || "N/A"}

DECLARATION
I certify this PAYE return is accurate.
Authorised Signatory: ${d.signatory_name}
Designation: ${d.designation}
Date: ${d.date}
==========================================
Generated by RegCo Technologies Limited`;
  }

  if (reportType === "Withholding Tax Return") {
    const a = payload.section_a, s = payload.summary, c = payload.section_c, d = payload.section_d;
    const txns = (payload.transactions as any[]) || [];
    const rows = txns.map((r, i) =>
      `${String(i + 1).padEnd(3)} ${(r.payee_name || "").padEnd(20).slice(0, 20)} ${(r.payee_tin || "").padEnd(14).slice(0, 14)} ${(r.nature || "").padEnd(16).slice(0, 16)} ${ngn(r.gross).padStart(13)} ${(r.rate + "%").padStart(5)} ${ngn(r.wht).padStart(13)}`
    ).join("\n");
    return `Generate using this exact template, filling in the values:

FEDERAL INLAND REVENUE SERVICE
WITHHOLDING TAX (WHT) RETURN
REPORTING PERIOD: ${a.period}
==========================================

REMITTING COMPANY
Company Name: ${a.company_name}
TIN: ${a.tin}
Period: ${a.period}

WHT TRANSACTIONS SCHEDULE
─────────────────────────────────────────────────────────────────────────────────────────
NO  PAYEE                PAYEE TIN      NATURE              GROSS ₦       RATE   WHT ₦
─────────────────────────────────────────────────────────────────────────────────────────
${rows}
─────────────────────────────────────────────────────────────────────────────────────────

SUMMARY
Total Gross Payments:           ₦${ngn(s.total_gross)}
Total WHT Deducted:             ₦${ngn(s.total_wht)}

REMITTANCE
Payment Status: ${c.paid === "Yes" ? "Paid" : "Unpaid"}
Payment Date: ${c.payment_date || "N/A"}
FIRS Receipt No: ${c.receipt_number || "N/A"}

DECLARATION
I certify this WHT return is true and complete.
Authorised Signatory: ${d.signatory_name}
Designation: ${d.designation}
Date: ${d.date}
==========================================
Generated by RegCo Technologies Limited`;
  }

  if (reportType === "Company Income Tax Return") {
    const a = payload.section_a, b = payload.section_b, d = payload.section_d, e = payload.section_e, cp = payload.computed;
    return `Generate using this exact template, filling in the values:

FEDERAL INLAND REVENUE SERVICE
COMPANY INCOME TAX RETURN
FORM C02
YEAR OF ASSESSMENT: ${a.year}
==========================================

COMPANY DETAILS
Company: ${a.company_name} | TIN: ${a.tin} | RC: ${a.rc_number}

INCOME AND PROFIT COMPUTATION
Gross Income/Turnover:          ₦${ngn(b.turnover)}
Less: Cost of Operations:      (₦${ngn(b.cost_of_sales)})
─────────────────────────────────────
Gross Profit:                   ₦${ngn(cp.gross_profit)}
Add: Other Income:              ₦${ngn(b.other_income)}
─────────────────────────────────────
Total Assessable Profit:        ₦${ngn(cp.assessable_profit)}
Less: Capital Allowances:      (₦${ngn(b.capital_allowances)})
─────────────────────────────────────
Net Assessable Profit:          ₦${ngn(cp.net_assessable)}

TAX COMPUTATION
Company Category: ${cp.category}
CIT Rate: ${cp.cit_rate}%
CIT Payable:                    ₦${ngn(cp.cit_payable)}
Education Tax (2.5%):           ₦${ngn(cp.edu_tax)}
─────────────────────────────────────
TOTAL TAX PAYABLE:              ₦${ngn(cp.total_tax)}
Less: Advance Tax Paid:        (₦${ngn(b.advance_tax)})
─────────────────────────────────────
${cp.balance < 0 ? "REFUND DUE" : "BALANCE PAYABLE"}:                ${cp.balance < 0 ? "−" : ""}₦${ngn(Math.abs(cp.balance))}

Payment Status: ${d.paid}
Payment Date: ${d.payment_date || "N/A"}
FIRS Receipt No: ${d.receipt_number || "N/A"}

DECLARATION
I certify this Company Income Tax return is true and complete.
Authorised Signatory: ${e.signatory_name}
Designation: ${e.designation}
Date: ${e.date}
==========================================
Generated by RegCo Technologies Limited`;
  }

  // Single Obligor
  const a = payload.section_a, b = payload.section_b, s = payload.summary, e = payload.section_e;
  const cap = parseFloat(b.capital_base) || 0;
  const limit = cap * 0.05;
  const rows = (payload.exposures as any[]).map((r, i) => {
    const out = parseFloat(r.outstanding) || 0;
    const pct = cap > 0 ? (out / cap * 100).toFixed(2) : "0.00";
    return `${String(i + 1).padEnd(3)} ${(r.borrower_name || "").padEnd(18).slice(0, 18)} ${(r.borrower_type || "").padEnd(11).slice(0, 11)} ${ngn(r.total_facility).padStart(11)} ${ngn(r.outstanding).padStart(13)} ${pct.padStart(6)}%  ${r.classification}`;
  }).join("\n");
  return `Generate using this exact template, filling in the values:

NIGERIA DEPOSIT INSURANCE CORPORATION
SINGLE OBLIGOR REPORT
${a.period}
==========================================

INSTITUTION: ${a.institution_name} | LICENSE: ${a.cbn_license_number}
PERIOD: ${a.period}

CAPITAL BASE REFERENCE
Shareholders Funds:           ₦${ngn(cap)}
Single Obligor Limit (5%):    ₦${ngn(limit)}

LARGE EXPOSURES SCHEDULE
─────────────────────────────────────────────────────────────────
NO  BORROWER           TYPE        FACILITY    OUTSTANDING   % CAP   CLASS
─────────────────────────────────────────────────────────────────
${rows}
─────────────────────────────────────────────────────────────────

SUMMARY
Total Large Exposures:         ${s.count}
Total Outstanding:             ₦${ngn(s.total_outstanding)}
Largest Single Exposure:       ₦${ngn(s.largest)}
Largest as % of Capital:       ${(s.largest_pct as number).toFixed(2)}%

CERTIFICATION
I certify this return is accurate and complete.
CEO: ${e.ceo_name} | CCO: ${e.cco_name} | Date: ${e.date}
==========================================
Generated by RegCo Technologies Limited`;
}

function cleanPlainText(input: unknown): string {
  const s = typeof input === "string" ? input : String(input ?? "");
  // Keep tabs, newlines, carriage returns, printable ASCII, and printable Unicode (including ₦ etc.)
  return s.replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(req) });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  // JWT validation — derive identity from sub claim
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  }
  const token = authHeader.replace("Bearer ", "");
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  }
  const userId = userData.user.id;

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  }

  const { report_id, report_type, form_payload, period_label } = body || {};
  if (!report_id || !report_type || !form_payload) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  }

  // Verify report ownership
  const { data: report } = await admin.from("reports").select("id, user_id").eq("id", report_id).maybeSingle();
  if (!report || report.user_id !== userId) {
    return new Response(JSON.stringify({ error: "Report not found" }), { status: 404, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  }

  try {
    const system = buildSystemPrompt(report_type);
    const user = buildUserPrompt(report_type, form_payload, { period: period_label });

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      if (aiRes.status === 429) throw new Error("Generation engine is rate limited. Please retry shortly.");
      if (aiRes.status === 402) throw new Error("Generation credits exhausted. Please contact support.");
      throw new Error(`Generation engine error: ${errText.slice(0, 200)}`);
    }

    const aiJson = await aiRes.json();
    const generated = aiJson?.choices?.[0]?.message?.content || user; // fallback to template
    const cleanText = cleanPlainText(generated);

    const safeType = report_type.replace(/[^A-Za-z0-9]+/g, "_");
    const filename = `RegCo_${safeType}_${new Date().toISOString().slice(0, 10)}.txt`;
    const path = `${userId}/${report_id}.txt`;
    const { error: upErr } = await admin.storage.from("reports").upload(
      path,
      new Blob([cleanText], { type: "text/plain;charset=utf-8" }),
      { contentType: "text/plain;charset=utf-8", upsert: true },
    );
    if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

    await admin.from("reports").update({
      status: "Ready",
      report_url: path,
      file_path: path,
      report_filename: filename,
      generated_at: new Date().toISOString(),
      validation_passed: true,
    }).eq("id", report_id);

    return new Response(JSON.stringify({ ok: true, path }), { headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    await admin.from("reports").update({ status: "failed", error_message: msg }).eq("id", report_id);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  }
});
