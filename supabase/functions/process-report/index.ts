import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const SUPABASE_URL = 'https://pdplkprcomjslilznbsl.supabase.co';
const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const RESEND_URL = 'https://api.resend.com/emails';

// Lovable AI Gateway models — reliable, pre-funded, no rate-limit chaos
const AI_MODELS = [
  'google/gemini-3-flash-preview',
  'google/gemini-2.5-flash',
  'google/gemini-2.5-flash-lite',
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ─── SYSTEM PROMPTS PER REPORT TYPE ───────────────────────────────────────────

const MFB_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in CBN MFB Regulatory Returns.
Validate the CBS financial data provided. Run these checks:
1. Total Assets must equal Total Liabilities plus Shareholders Funds
2. Gross Loans must equal Performing Loans plus Non-Performing Loans
3. Total Deposits must equal Savings plus Demand plus Time plus Other Deposits
4. CAR = (Tier 1 + Tier 2) / Risk Weighted Assets * 100 (flag if below 10%)
5. Liquidity Ratio = Liquid Assets / Total Deposits * 100 (flag if below 20%)
6. NPL Ratio = Non-Performing Loans / Gross Loans * 100

If any critical check fails return ONLY: {"status":"ERROR","error_type":"VALIDATION_FAILED","description":"plain english explanation","action_required":"exactly what to fix","figures_involved":"the specific figures","difference":"exact naira discrepancy"}

If all checks pass return ONLY: {"status":"SUCCESS","validation_summary":{"car_percentage":12.5,"liquidity_percentage":35.2,"npl_ratio":4.1,"loan_to_deposit_ratio":65.0},"approved":true}

Return ONLY valid JSON. No markdown. No backticks.`;

const FOREX_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in CBN Forex Returns.
Validate: Net Open Position = Total FX Inflows minus Total FX Outflows.
Validate: NOP must be within CBN limits.

If validation fails return ONLY: {"status":"ERROR","error_type":"FOREX_VALIDATION_FAILED","description":"explanation","action_required":"what to fix","figures_involved":"figures","difference":"discrepancy"}

If valid return ONLY: {"status":"SUCCESS","validation_summary":{"net_open_position":0.0,"usd_percentage":0.0,"total_fx_volume":0.0,"nop_compliance":"COMPLIANT"},"approved":true}

Return ONLY valid JSON. No markdown. No backticks.`;

const AML_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in AML/CFT Quarterly Compliance Reports for NFIU.
Validate: Total transactions must be consistent. STR count must be >= 0. CTR threshold is NGN 5,000,000.

If issues found return ONLY: {"status":"ERROR","error_type":"AML_DATA_ERROR","description":"explanation","action_required":"fix instructions","figures_involved":"figures","difference":"discrepancy"}

If valid return ONLY: {"status":"SUCCESS","validation_summary":{"str_count":0,"ctr_count":0,"compliance_score":95.0},"approved":true}

Return ONLY valid JSON. No markdown. No backticks.`;

const SCUML_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in SCUML Annual Compliance Reports.

If issues found return ONLY: {"status":"ERROR","error_type":"SCUML_DATA_ERROR","description":"explanation","action_required":"fix","figures_involved":"figures","difference":"discrepancy"}

If valid return ONLY: {"status":"SUCCESS","validation_summary":{"scuml_registration_status":"REGISTERED","compliance_percentage":95.0},"approved":true}

Return ONLY valid JSON. No markdown. No backticks.`;

const MONETARY_POLICY_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in CBN Monetary Policy Returns.
Validate interest rate data and monetary policy compliance figures.

If issues found return ONLY: {"status":"ERROR","error_type":"MONETARY_POLICY_ERROR","description":"explanation","action_required":"fix","figures_involved":"figures","difference":"discrepancy"}

If valid return ONLY: {"status":"SUCCESS","validation_summary":{"mprate_compliance":"COMPLIANT","lending_rate":0.0,"deposit_rate":0.0},"approved":true}

Return ONLY valid JSON. No markdown. No backticks.`;

const NFIU_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in NFIU Quarterly Regulatory Returns.
Validate the financial intelligence data, STR filings, and CTR compliance.

If issues found return ONLY: {"status":"ERROR","error_type":"NFIU_DATA_ERROR","description":"explanation","action_required":"fix","figures_involved":"figures","difference":"discrepancy"}

If valid return ONLY: {"status":"SUCCESS","validation_summary":{"total_str":0,"total_ctr":0,"reporting_compliance":"COMPLIANT"},"approved":true}

Return ONLY valid JSON. No markdown. No backticks.`;

const PRUDENTIAL_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in CBN Prudential Returns for MFBs.
Validate capital adequacy, asset quality, management quality, earnings and liquidity (CAMEL framework).

If issues found return ONLY: {"status":"ERROR","error_type":"PRUDENTIAL_ERROR","description":"explanation","action_required":"fix","figures_involved":"figures","difference":"discrepancy"}

If valid return ONLY: {"status":"SUCCESS","validation_summary":{"camel_rating":"SATISFACTORY","car_percentage":12.5,"npl_ratio":4.1,"liquidity_percentage":30.0},"approved":true}

Return ONLY valid JSON. No markdown. No backticks.`;

function getSystemPrompt(reportType: string): string {
  switch (reportType) {
    case 'CBN Forex Return': return FOREX_PROMPT;
    case 'AML/CFT Report':
    case 'AML/CFT Compliance Report': return AML_PROMPT;
    case 'SCUML Compliance Report': return SCUML_PROMPT;
    case 'CBN Monetary Policy Return': return MONETARY_POLICY_PROMPT;
    case 'NFIU Regulatory Return': return NFIU_PROMPT;
    case 'Prudential Return': return PRUDENTIAL_PROMPT;
    case 'MFB Regulatory Return':
    default: return MFB_PROMPT;
  }
}

const FINANCIAL_FIELDS = [
  'total_assets', 'total_liabilities', 'total_shareholders_funds', 'total_deposits',
  'savings_deposits', 'demand_deposits', 'time_deposits', 'other_deposits',
  'gross_loans', 'performing_loans', 'non_performing_loans', 'loan_loss_provisions',
  'cash_and_equivalents', 'balances_with_cbn', 'balances_with_other_banks',
  'investment_securities', 'fixed_assets', 'other_assets',
  'paid_up_capital', 'statutory_reserve', 'retained_earnings',
  'tier_1_capital', 'tier_2_capital', 'risk_weighted_assets', 'liquid_assets',
  // Forex
  'total_fx_inflows', 'total_fx_outflows', 'net_open_position',
  'usd_inflows', 'usd_outflows', 'gbp_inflows', 'gbp_outflows', 'eur_inflows', 'eur_outflows',
  // AML/NFIU
  'total_transactions', 'str_filed', 'ctr_filed', 'flagged_transactions',
  'total_customers', 'kyc_compliant', 'pep_customers', 'high_risk_customers',
  'staff_trained', 'total_staff',
  // Rates & earnings
  'prime_lending_rate', 'savings_rate', 'interest_income', 'non_interest_income',
  'total_income', 'profit_before_tax', 'profit_after_tax',
];

async function patchReport(reportId: string, data: Record<string, any>, serviceRoleKey: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}`, {
    method: 'PATCH',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(data),
  });
}

async function sendEmail(to: string, subject: string, html: string, resendKey: string) {
  if (!resendKey) {
    console.warn('RESEND_API_KEY not set — skipping email');
    return;
  }
  await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'RegCo <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    }),
  });
}

function formatNaira(value: number): string {
  return `\u20a6${(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── REPORT BUILDERS ─────────────────────────────────────────────────────────

interface Meta {
  institution_name: string;
  cbn_license_number: string;
  cbn_license_category: string;
  compliance_lead_name: string;
  reporting_period_start: string;
  reporting_period_end: string;
}

function buildMFBReport(financialData: Record<string, number>, vs: any, meta: Meta): string {
  const car = Number(vs.car_percentage || 0);
  const liq = Number(vs.liquidity_percentage || 0);
  const npl = Number(vs.npl_ratio || 0);
  const now = new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  const carStatus = car >= 10 ? 'COMPLIANT' : 'NON-COMPLIANT (min: 10%)';
  const liqStatus = liq >= 20 ? 'COMPLIANT' : 'NON-COMPLIANT (min: 20%)';
  const sep = '='.repeat(80);
  const line = '-'.repeat(80);

  return `${sep}
                     CENTRAL BANK OF NIGERIA (CBN)
               MICROFINANCE BANK REGULATORY RETURN
${sep}

COVER PAGE
${line}
Institution Name    : ${meta.institution_name}
CBN License Number  : ${meta.cbn_license_number}
License Category    : ${meta.cbn_license_category}
Compliance Lead     : ${meta.compliance_lead_name}
Reporting Period    : ${meta.reporting_period_start} to ${meta.reporting_period_end}
Date Generated      : ${now}
Reference           : CBN MFB RETURN / ${meta.reporting_period_end}

${sep}
SECTION A — BALANCE SHEET
${sep}

ASSETS
  Cash and Cash Equivalents          : ${formatNaira(financialData.cash_and_equivalents || 0)}
  Balances with CBN                  : ${formatNaira(financialData.balances_with_cbn || 0)}
  Investment Securities              : ${formatNaira(financialData.investment_securities || 0)}
  Gross Loans and Advances           : ${formatNaira(financialData.gross_loans || 0)}
  Fixed Assets                       : ${formatNaira(financialData.fixed_assets || 0)}
                                       ${line.slice(0, 40)}
  TOTAL ASSETS                       : ${formatNaira(financialData.total_assets || 0)}

LIABILITIES
  Total Deposits                     : ${formatNaira(financialData.total_deposits || 0)}
  Other Liabilities                  : ${formatNaira(Math.max(0, (financialData.total_liabilities || 0) - (financialData.total_deposits || 0)))}
                                       ${line.slice(0, 40)}
  TOTAL LIABILITIES                  : ${formatNaira(financialData.total_liabilities || 0)}

SHAREHOLDERS' FUNDS
  Paid-up Capital                    : ${formatNaira(financialData.paid_up_capital || 0)}
  Retained Earnings                  : ${formatNaira(financialData.retained_earnings || 0)}
                                       ${line.slice(0, 40)}
  TOTAL SHAREHOLDERS' FUNDS          : ${formatNaira(financialData.total_shareholders_funds || 0)}

  TOTAL LIABILITIES & EQUITY         : ${formatNaira((financialData.total_liabilities || 0) + (financialData.total_shareholders_funds || 0))}

${sep}
SECTION B — LOANS AND ADVANCES
${sep}

  Gross Loans                        : ${formatNaira(financialData.gross_loans || 0)}
  Performing Loans                   : ${formatNaira(financialData.performing_loans || 0)}
  Non-Performing Loans (NPL)         : ${formatNaira(financialData.non_performing_loans || 0)}
  Loan Loss Provisions               : ${formatNaira(financialData.loan_loss_provisions || 0)}
                                       ${line.slice(0, 40)}
  Net Loans                          : ${formatNaira((financialData.gross_loans || 0) - (financialData.loan_loss_provisions || 0))}
  NPL Ratio                          : ${npl.toFixed(2)}%

${sep}
SECTION C — DEPOSITS
${sep}

  Savings Deposits                   : ${formatNaira(financialData.savings_deposits || 0)}
  Demand Deposits                    : ${formatNaira(financialData.demand_deposits || 0)}
  Time Deposits                      : ${formatNaira(financialData.time_deposits || 0)}
                                       ${line.slice(0, 40)}
  TOTAL DEPOSITS                     : ${formatNaira(financialData.total_deposits || 0)}

${sep}
SECTION D — CAPITAL ADEQUACY
${sep}

  Tier 1 Capital                     : ${formatNaira(financialData.tier_1_capital || 0)}
  Tier 2 Capital                     : ${formatNaira(financialData.tier_2_capital || 0)}
                                       ${line.slice(0, 40)}
  Total Regulatory Capital           : ${formatNaira((financialData.tier_1_capital || 0) + (financialData.tier_2_capital || 0))}
  Risk Weighted Assets               : ${formatNaira(financialData.risk_weighted_assets || 0)}
  Capital Adequacy Ratio (CAR)       : ${car.toFixed(2)}%
  CBN Minimum Requirement            : 10.00%
  Compliance Status                  : ${carStatus}

${sep}
SECTION E — LIQUIDITY
${sep}

  Liquid Assets                      : ${formatNaira(financialData.liquid_assets || 0)}
  Total Deposits                     : ${formatNaira(financialData.total_deposits || 0)}
  Liquidity Ratio                    : ${liq.toFixed(2)}%
  CBN Minimum Requirement            : 20.00%
  Compliance Status                  : ${liqStatus}

${sep}
SECTION F — KEY PERFORMANCE INDICATORS
${sep}

  Capital Adequacy Ratio             : ${car.toFixed(2)}% (${carStatus})
  Liquidity Ratio                    : ${liq.toFixed(2)}% (${liqStatus})
  Non-Performing Loan Ratio          : ${npl.toFixed(2)}%
  Total Assets                       : ${formatNaira(financialData.total_assets || 0)}
  Total Deposits                     : ${formatNaira(financialData.total_deposits || 0)}
  Gross Loan Portfolio               : ${formatNaira(financialData.gross_loans || 0)}

${sep}
SECTION G — CERTIFICATION
${sep}

I, ${meta.compliance_lead_name}, hereby certify that the information contained
in this Regulatory Return is true and accurate to the best of my knowledge and
belief, and has been prepared in accordance with the guidelines issued by the
Central Bank of Nigeria.

Signed: ____________________________    Date: ___________________
Name  : ${meta.compliance_lead_name}
Title : Chief Compliance Officer
Institution: ${meta.institution_name}

${sep}
                    END OF MFB REGULATORY RETURN
${sep}
Generated by RegCo Compliance Suite | Report Date: ${now}
`;
}

function buildForexReport(d: Record<string, number>, vs: any, meta: Meta): string {
  const now = new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  const sep = '='.repeat(80);
  return `${sep}
                     CENTRAL BANK OF NIGERIA (CBN)
                          CBN FOREX RETURN
${sep}

Institution Name    : ${meta.institution_name}
CBN License Number  : ${meta.cbn_license_number}
Reporting Period    : ${meta.reporting_period_start} to ${meta.reporting_period_end}
Compliance Lead     : ${meta.compliance_lead_name}
Date Generated      : ${now}

${sep}
SECTION A — FX TRANSACTIONS
${sep}
  Total FX Inflows (USD)             : $${(d.total_fx_inflows || 0).toLocaleString('en-US')}
  Total FX Outflows (USD)            : $${(d.total_fx_outflows || 0).toLocaleString('en-US')}
  Net Open Position (USD)            : $${(d.net_open_position || (d.total_fx_inflows || 0) - (d.total_fx_outflows || 0)).toLocaleString('en-US')}

${sep}
SECTION B — CURRENCY BREAKDOWN
${sep}
  USD Inflows                        : $${(d.usd_inflows || 0).toLocaleString('en-US')}
  USD Outflows                       : $${(d.usd_outflows || 0).toLocaleString('en-US')}
  GBP Inflows                        : £${(d.gbp_inflows || 0).toLocaleString('en-GB')}
  GBP Outflows                       : £${(d.gbp_outflows || 0).toLocaleString('en-GB')}
  EUR Inflows                        : €${(d.eur_inflows || 0).toLocaleString('en-GB')}
  EUR Outflows                       : €${(d.eur_outflows || 0).toLocaleString('en-GB')}

${sep}
SECTION C — COMPLIANCE
${sep}
  NOP Compliance Status              : ${vs.nop_compliance || 'COMPLIANT'}
  Net Open Position                  : ${Number(vs.net_open_position || 0).toFixed(2)}
  Total FX Volume                    : ${Number(vs.total_fx_volume || 0).toFixed(2)}

${sep}
CERTIFICATION
${sep}
Prepared by RegCo for: ${meta.institution_name}
Compliance Lead: ${meta.compliance_lead_name}
Date: ${now}
REVIEW ALL FIGURES BEFORE CBN PORTAL SUBMISSION
${sep}
`;
}

function buildAMLReport(d: Record<string, number>, vs: any, meta: Meta, reportType: string): string {
  const now = new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  const sep = '='.repeat(80);
  return `${sep}
              NIGERIAN FINANCIAL INTELLIGENCE UNIT (NFIU)
                ${reportType.toUpperCase()}
${sep}

Institution Name    : ${meta.institution_name}
RC Number           : ${meta.cbn_license_number}
Reporting Period    : ${meta.reporting_period_start} to ${meta.reporting_period_end}
Compliance Lead     : ${meta.compliance_lead_name}
Date Generated      : ${now}

${sep}
SECTION A — TRANSACTION MONITORING
${sep}
  Total Transactions Monitored       : ${(d.total_transactions || 0).toLocaleString()}
  Flagged Transactions               : ${(d.flagged_transactions || 0).toLocaleString()}
  STR Filed                          : ${(d.str_filed || vs.str_count || 0).toLocaleString()}
  CTR Filed                          : ${(d.ctr_filed || vs.ctr_count || 0).toLocaleString()}

${sep}
SECTION B — CUSTOMER DUE DILIGENCE
${sep}
  Total Customers                    : ${(d.total_customers || 0).toLocaleString()}
  KYC Compliant                      : ${(d.kyc_compliant || 0).toLocaleString()}
  PEP Customers                      : ${(d.pep_customers || 0).toLocaleString()}
  High Risk Customers                : ${(d.high_risk_customers || 0).toLocaleString()}

${sep}
SECTION C — STAFF TRAINING
${sep}
  Staff Trained in AML/CFT           : ${(d.staff_trained || 0).toLocaleString()}
  Total Staff                        : ${(d.total_staff || 0).toLocaleString()}
  Compliance Score                   : ${Number(vs.compliance_score || 0).toFixed(2)}%

${sep}
CERTIFICATION
${sep}
Compliance Officer: ${meta.compliance_lead_name}
Institution: ${meta.institution_name}
Date: ${now}
${sep}
`;
}

function buildGenericReport(d: Record<string, number>, vs: any, meta: Meta, reportType: string): string {
  const now = new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  const sep = '='.repeat(80);
  return `${sep}
                   CENTRAL BANK OF NIGERIA / NFIU / SCUML
                        ${reportType.toUpperCase()}
${sep}

Institution Name    : ${meta.institution_name}
License/RC Number   : ${meta.cbn_license_number}
Reporting Period    : ${meta.reporting_period_start} to ${meta.reporting_period_end}
Compliance Lead     : ${meta.compliance_lead_name}
Date Generated      : ${now}

${sep}
VALIDATION SUMMARY
${sep}
${JSON.stringify(vs, null, 2)}

${sep}
FINANCIAL DATA
${sep}
${JSON.stringify(d, null, 2)}

${sep}
CERTIFICATION
${sep}
Prepared by RegCo for: ${meta.institution_name}
Compliance Lead: ${meta.compliance_lead_name}
Date: ${now}
REVIEW ALL FIGURES BEFORE PORTAL SUBMISSION
${sep}
`;
}

function buildReportText(reportType: string, financialData: Record<string, number>, vs: any, meta: Meta): string {
  switch (reportType) {
    case 'MFB Regulatory Return':
    case 'Prudential Return':
      return buildMFBReport(financialData, vs, meta);
    case 'CBN Forex Return':
      return buildForexReport(financialData, vs, meta);
    case 'AML/CFT Report':
    case 'AML/CFT Compliance Report':
    case 'NFIU Regulatory Return':
    case 'SCUML Compliance Report':
      return buildAMLReport(financialData, vs, meta, reportType);
    default:
      return buildGenericReport(financialData, vs, meta, reportType);
  }
}

// ─── MAIN HANDLER ────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY') || '';
  const resendKey = Deno.env.get('RESEND_API_KEY') || '';

  let reportId: string | null = null;

  try {
    const body = await req.json();
    const {
      report_id, user_id, institution_name, cbn_license_number, cbn_license_category,
      compliance_lead_name, report_type, reporting_period_start, reporting_period_end,
      file_url, client_email,
    } = body;

    reportId = report_id;
    const reportType: string = report_type || 'MFB Regulatory Return';

    // Step 1: Mark report as processing
    await patchReport(report_id, { status: 'processing' }, serviceRoleKey);

    // Step 2: Download CBS Excel file
    const fileResponse = await fetch(file_url);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download CBS file: ${fileResponse.status} ${fileResponse.statusText}`);
    }
    const arrayBuffer = await fileResponse.arrayBuffer();

    // Step 3: Parse Excel with SheetJS
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

    // Step 4: Build financial data object by matching row labels
    const financialData: Record<string, number> = {};
    for (const row of rows) {
      if (!row[0]) continue;
      const label = String(row[0]).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      const value = parseFloat(String(row[1] || '0').replace(/[,\u20a6$£€]/g, '')) || 0;
      for (const field of FINANCIAL_FIELDS) {
        if (label.includes(field) && !(field in financialData)) {
          financialData[field] = value;
          break;
        }
      }
    }

    // Step 5: Pick the right system prompt for this report type
    const systemPrompt = getSystemPrompt(reportType);
    const userMessage = `Generate ${reportType}.
Institution: ${institution_name}
CBN License: ${cbn_license_number}
Category: ${cbn_license_category}
Compliance Lead: ${compliance_lead_name}
Period: ${reporting_period_start} to ${reporting_period_end}
Financial Data: ${JSON.stringify(financialData)}`;

    // Call Lovable AI Gateway with model fallback chain
    let aiRaw: any;
    const callAI = async (model: string): Promise<any | null> => {
      const reqBody = JSON.stringify({
        model,
        max_tokens: 4000,
        temperature: 0.1,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      });

      for (let attempt = 1; attempt <= 3; attempt++) {
        const res = await fetch(AI_GATEWAY_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: reqBody,
        });

        if (res.status === 429) {
          if (attempt < 3) {
            const delay = attempt * 5_000;
            console.warn(`Rate limited on ${model}. Waiting ${delay / 1000}s (attempt ${attempt}/3)`);
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          return null;
        }

        if (res.status === 402) {
          throw new Error('AI credits exhausted. Please add credits in Lovable workspace settings.');
        }

        if (res.status === 404 || res.status === 503) {
          return null;
        }

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Lovable AI error: ${res.status} ${errText.substring(0, 200)}`);
        }

        return await res.json();
      }
      return null;
    };

    for (const model of AI_MODELS) {
      console.log(`Trying model: ${model}`);
      aiRaw = await callAI(model);
      if (aiRaw) break;
      console.warn(`Model ${model} unavailable, trying next...`);
    }
    if (!aiRaw) {
      throw new Error('AI service is temporarily busy. Please try again in a few minutes.');
    }

    const aiText = (aiRaw.choices?.[0]?.message?.content || '').trim();

    // Step 6: Parse AI JSON response — strip markdown backticks if present
    const cleanedText = aiText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    let aiData: any;
    try {
      aiData = JSON.parse(cleanedText);
    } catch {
      const match = cleanedText.match(/\{[\s\S]*\}/);
      if (match) {
        try { aiData = JSON.parse(match[0]); } catch {
          throw new Error('AI returned invalid response: ' + cleanedText.substring(0, 300));
        }
      } else {
        throw new Error('AI returned invalid response: ' + cleanedText.substring(0, 300));
      }
    }

    // Step 7a: Handle AI validation ERROR
    if (aiData.status === 'ERROR') {
      await patchReport(report_id, {
        status: 'failed',
        error_message: aiData.description,
        error_type: aiData.error_type,
      }, serviceRoleKey);

      await sendEmail(
        client_email,
        `Action Required \u2014 ${reportType} Error for ${institution_name}`,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#1a1a2e;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">RegCo</h1>
            <p style="color:#8a8a9a;margin:4px 0 0;">Compliance Intelligence Suite</p>
          </div>
          <h2 style="color:#ef4444;">${reportType} — Validation Error</h2>
          <p>Dear ${compliance_lead_name},</p>
          <p>We were unable to generate your <strong>${reportType}</strong> for <strong>${institution_name}</strong> because your CBS data failed validation.</p>
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="color:#991b1b;font-weight:bold;margin:0 0 8px;">Error Type: ${aiData.error_type}</p>
            <p style="color:#7f1d1d;margin:0;">${aiData.description}</p>
          </div>
          ${aiData.action_required ? `<p><strong>What to fix:</strong> ${aiData.action_required}</p>` : ''}
          ${aiData.figures_involved ? `<p><strong>Figures involved:</strong> ${aiData.figures_involved}</p>` : ''}
          ${aiData.difference ? `<p><strong>Discrepancy:</strong> ${aiData.difference}</p>` : ''}
          <div style="text-align:center;margin:30px 0;">
            <a href="https://regco-insight-suite.vercel.app/dashboard" style="background:#3b6ef8;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Go to Dashboard</a>
          </div>
          <p style="color:#6b7280;font-size:14px;">Reporting Period: ${reporting_period_start} to ${reporting_period_end}</p>
        </div>`,
        resendKey,
      );

      return new Response(JSON.stringify({ success: true, status: 'ERROR' }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Step 7b: Handle SUCCESS — build report, upload, notify
    const validationSummary = aiData.validation_summary || {};

    const meta: Meta = {
      institution_name, cbn_license_number, cbn_license_category,
      compliance_lead_name, reporting_period_start, reporting_period_end,
    };

    const reportText = buildReportText(reportType, financialData, validationSummary, meta);

    const safeType = reportType.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${institution_name.replace(/\s+/g, '_')}_${safeType}_${reporting_period_end}.txt`;
    const storagePath = `${user_id}/${report_id}/${filename}`;

    // Upload report to Supabase Storage
    const uploadResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/reports/${storagePath}`,
      {
        method: 'POST',
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': 'text/plain',
          'x-upsert': 'true',
        },
        body: reportText,
      },
    );

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      throw new Error(`Storage upload failed: ${errText}`);
    }

    // Update report record to ready
    await patchReport(report_id, {
      status: 'ready',
      report_url: storagePath,
      report_filename: filename,
      car_percentage: Number(validationSummary.car_percentage || 0),
      liquidity_percentage: Number(validationSummary.liquidity_percentage || 0),
      npl_ratio: Number(validationSummary.npl_ratio || 0),
      validation_passed: true,
      error_message: null,
    }, serviceRoleKey);

    // Send success email — show CAR/Liquidity/NPL only when relevant
    const car = Number(validationSummary.car_percentage || 0);
    const liq = Number(validationSummary.liquidity_percentage || 0);
    const npl = Number(validationSummary.npl_ratio || 0);
    const showFinancialMetrics = car > 0 || liq > 0 || npl > 0;
    const carStatus = car >= 10 ? '\u2705 Compliant' : '\u26a0\ufe0f Below Minimum (10%)';
    const liqStatus = liq >= 20 ? '\u2705 Compliant' : '\u26a0\ufe0f Below Minimum (20%)';

    const metricsBlock = showFinancialMetrics ? `
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
          <h3 style="color:#15803d;margin:0 0 12px;">Validation Summary</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#374151;font-weight:bold;">Capital Adequacy Ratio (CAR)</td><td style="padding:8px 0;text-align:right;color:#374151;">${car.toFixed(2)}% \u2014 ${carStatus}</td></tr>
            <tr><td style="padding:8px 0;color:#374151;font-weight:bold;">Liquidity Ratio</td><td style="padding:8px 0;text-align:right;color:#374151;">${liq.toFixed(2)}% \u2014 ${liqStatus}</td></tr>
            <tr><td style="padding:8px 0;color:#374151;font-weight:bold;">NPL Ratio</td><td style="padding:8px 0;text-align:right;color:#374151;">${npl.toFixed(2)}%</td></tr>
          </table>
        </div>` : `
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="color:#15803d;font-weight:bold;margin:0;">\u2705 All validation checks passed</p>
        </div>`;

    await sendEmail(
      client_email,
      `Your ${reportType} is Ready \u2014 ${institution_name}`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#1a1a2e;padding:20px;border-radius:8px;margin-bottom:20px;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">RegCo</h1>
          <p style="color:#8a8a9a;margin:4px 0 0;">Compliance Intelligence Suite</p>
        </div>
        <h2 style="color:#16a34a;">Your Report is Ready</h2>
        <p>Dear ${compliance_lead_name},</p>
        <p>Your <strong>${reportType}</strong> for <strong>${institution_name}</strong> has been successfully generated.</p>
        ${metricsBlock}
        <p style="color:#6b7280;font-size:14px;">Reporting Period: ${reporting_period_start} to ${reporting_period_end}</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="https://regco-insight-suite.vercel.app/dashboard" style="background:#3b6ef8;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Download Report</a>
        </div>
      </div>`,
      resendKey,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('process-report error:', error);
    if (reportId) {
      await patchReport(reportId, {
        status: 'failed',
        error_message: error.message || 'Unknown error occurred',
      }, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '').catch(console.error);
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
