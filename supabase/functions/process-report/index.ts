import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const SUPABASE_URL = 'https://pdplkprcomjslilznbsl.supabase.co';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const RESEND_URL = 'https://api.resend.com/emails';
// Primary: Llama 3.3 70B (fast, accurate). Fallback: Llama 3.1 8B (higher rate limits).
// For production: remove the ':free' suffix after adding OpenRouter credits.
const AI_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';
const AI_MODEL_FALLBACK = 'meta-llama/llama-3.1-8b-instruct:free';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a Nigerian banking regulatory compliance engine. Your job is to validate CBS financial data and generate a CBN-compliant MFB Regulatory Return as JSON. You must run these validation checks:
Check 1 - Total Assets must equal Total Liabilities plus Shareholders Funds.
Check 2 - Gross Loans must equal Performing Loans plus Non-Performing Loans.
Check 3 - Total Deposits must equal Savings plus Demand plus Time plus Other Deposits.

If any check fails, return ONLY this JSON (no markdown, no code blocks):
{"status":"ERROR","error_type":"VALIDATION_FAILED","description":"Clear explanation of which check failed, the values found, and what the user should correct in their CBS file"}

If all checks pass, calculate:
- CAR (Capital Adequacy Ratio) = (Tier 1 Capital + Tier 2 Capital) / Risk Weighted Assets * 100
- Liquidity Ratio = Liquid Assets / Total Deposits * 100
- NPL Ratio = Non-Performing Loans / Gross Loans * 100

Then return ONLY this JSON (no markdown, no code blocks):
{"status":"SUCCESS","validation_summary":{"car_percentage":12.5,"liquidity_percentage":35.2,"npl_ratio":4.1},"approved":true}

Return ONLY valid JSON. No markdown, no explanations, no code blocks.`;

const FINANCIAL_FIELDS = [
  'total_assets', 'total_liabilities', 'total_shareholders_funds', 'total_deposits',
  'savings_deposits', 'demand_deposits', 'time_deposits', 'gross_loans',
  'performing_loans', 'non_performing_loans', 'loan_loss_provisions',
  'cash_and_equivalents', 'balances_with_cbn', 'investment_securities',
  'fixed_assets', 'paid_up_capital', 'retained_earnings', 'tier_1_capital',
  'tier_2_capital', 'risk_weighted_assets', 'liquid_assets',
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
  return `\u20a6${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function buildReportText(
  financialData: Record<string, number>,
  validationSummary: { car_percentage: number; liquidity_percentage: number; npl_ratio: number },
  meta: {
    institution_name: string;
    cbn_license_number: string;
    cbn_license_category: string;
    compliance_lead_name: string;
    reporting_period_start: string;
    reporting_period_end: string;
  }
): string {
  const now = new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  const carStatus = validationSummary.car_percentage >= 10 ? 'COMPLIANT' : 'NON-COMPLIANT (min: 10%)';
  const liqStatus = validationSummary.liquidity_percentage >= 20 ? 'COMPLIANT' : 'NON-COMPLIANT (min: 20%)';
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
  NPL Ratio                          : ${validationSummary.npl_ratio.toFixed(2)}%

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
  Capital Adequacy Ratio (CAR)       : ${validationSummary.car_percentage.toFixed(2)}%
  CBN Minimum Requirement            : 10.00%
  Compliance Status                  : ${carStatus}

${sep}
SECTION E — LIQUIDITY
${sep}

  Liquid Assets                      : ${formatNaira(financialData.liquid_assets || 0)}
  Total Deposits                     : ${formatNaira(financialData.total_deposits || 0)}
  Liquidity Ratio                    : ${validationSummary.liquidity_percentage.toFixed(2)}%
  CBN Minimum Requirement            : 20.00%
  Compliance Status                  : ${liqStatus}

${sep}
SECTION F — KEY PERFORMANCE INDICATORS
${sep}

  Capital Adequacy Ratio             : ${validationSummary.car_percentage.toFixed(2)}% (${carStatus})
  Liquidity Ratio                    : ${validationSummary.liquidity_percentage.toFixed(2)}% (${liqStatus})
  Non-Performing Loan Ratio          : ${validationSummary.npl_ratio.toFixed(2)}%
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const openRouterKey = Deno.env.get('OPENROUTER_API_KEY') || '';
  const resendKey = Deno.env.get('RESEND_API_KEY') || '';

  let reportId: string | null = null;

  try {
    const body = await req.json();
    const {
      report_id, user_id, institution_name, cbn_license_number, cbn_license_category,
      compliance_lead_name, reporting_period_start, reporting_period_end, file_url, client_email,
    } = body;

    reportId = report_id;

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
      const value = parseFloat(String(row[1] || '0').replace(/[,\u20a6$]/g, '')) || 0;
      for (const field of FINANCIAL_FIELDS) {
        if (label.includes(field) && !(field in financialData)) {
          financialData[field] = value;
          break;
        }
      }
    }

    // Step 5: Call OpenRouter AI for validation
    const userMessage = `Generate MFB Regulatory Return.
Institution: ${institution_name}
CBN License: ${cbn_license_number}
Category: ${cbn_license_category}
Compliance Lead: ${compliance_lead_name}
Period: ${reporting_period_start} to ${reporting_period_end}
Financial Data: ${JSON.stringify(financialData)}`;

    // Call OpenRouter — try primary model first, fall back to smaller model on rate limits
    let aiRaw: any;

    const callOpenRouter = async (model: string): Promise<any | null> => {
      const body = JSON.stringify({
        model,
        max_tokens: 4000,
        temperature: 0.1,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      });

      for (let attempt = 1; attempt <= 3; attempt++) {
        const res = await fetch(OPENROUTER_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://regco-insight-suite.vercel.app',
            'X-Title': 'RegCo MFB Report Generator',
          },
          body,
        });

        if (res.status === 429) {
          if (attempt < 3) {
            const delay = attempt * 8_000;
            console.warn(`Rate limited on ${model}. Waiting ${delay / 1000}s (attempt ${attempt}/3)`);
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          return null; // signal caller to try fallback
        }

        if (!res.ok) {
          throw new Error(`OpenRouter API error: ${res.status} ${res.statusText}`);
        }

        return await res.json();
      }
      return null;
    };

    // Try primary (70B), then fall back to 8B if rate limited
    aiRaw = await callOpenRouter(AI_MODEL);
    if (!aiRaw) {
      console.warn('Primary model rate limited. Switching to fallback model.');
      aiRaw = await callOpenRouter(AI_MODEL_FALLBACK);
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
      throw new Error('AI returned invalid response: ' + cleanedText.substring(0, 300));
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
        `Action Required \u2014 CBS Data Error for ${institution_name}`,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#1a1a2e;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">RegCo</h1>
            <p style="color:#8a8a9a;margin:4px 0 0;">Compliance Intelligence Suite</p>
          </div>
          <h2 style="color:#ef4444;">CBS Data Validation Error</h2>
          <p>Dear ${compliance_lead_name},</p>
          <p>We were unable to generate your MFB Regulatory Return for <strong>${institution_name}</strong> because your CBS data failed validation checks.</p>
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="color:#991b1b;font-weight:bold;margin:0 0 8px;">Error Type: ${aiData.error_type}</p>
            <p style="color:#7f1d1d;margin:0;">${aiData.description}</p>
          </div>
          <p><strong>What to fix:</strong> Review your CBS export file and ensure all financial figures are correct and consistent before resubmitting.</p>
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
    const validationSummary = aiData.validation_summary || {
      car_percentage: 0,
      liquidity_percentage: 0,
      npl_ratio: 0,
    };

    const reportText = buildReportText(financialData, validationSummary, {
      institution_name, cbn_license_number, cbn_license_category,
      compliance_lead_name, reporting_period_start, reporting_period_end,
    });

    const filename = `${institution_name.replace(/\s+/g, '_')}_MFB_Return_${reporting_period_end}.txt`;
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
      car_percentage: validationSummary.car_percentage,
      liquidity_percentage: validationSummary.liquidity_percentage,
      npl_ratio: validationSummary.npl_ratio,
      validation_passed: true,
      error_message: null,
    }, serviceRoleKey);

    // Send success email
    const carStatus = validationSummary.car_percentage >= 10 ? '\u2705 Compliant' : '\u26a0\ufe0f Below Minimum (10%)';
    const liqStatus = validationSummary.liquidity_percentage >= 20 ? '\u2705 Compliant' : '\u26a0\ufe0f Below Minimum (20%)';

    await sendEmail(
      client_email,
      `Your MFB Regulatory Return is Ready \u2014 ${institution_name}`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#1a1a2e;padding:20px;border-radius:8px;margin-bottom:20px;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">RegCo</h1>
          <p style="color:#8a8a9a;margin:4px 0 0;">Compliance Intelligence Suite</p>
        </div>
        <h2 style="color:#16a34a;">Your Report is Ready</h2>
        <p>Dear ${compliance_lead_name},</p>
        <p>Your CBN-compliant MFB Regulatory Return for <strong>${institution_name}</strong> has been successfully generated.</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
          <h3 style="color:#15803d;margin:0 0 12px;">Validation Summary</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#374151;font-weight:bold;">Capital Adequacy Ratio (CAR)</td>
              <td style="padding:8px 0;text-align:right;color:#374151;">${validationSummary.car_percentage.toFixed(2)}% \u2014 ${carStatus}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#374151;font-weight:bold;">Liquidity Ratio</td>
              <td style="padding:8px 0;text-align:right;color:#374151;">${validationSummary.liquidity_percentage.toFixed(2)}% \u2014 ${liqStatus}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#374151;font-weight:bold;">NPL Ratio</td>
              <td style="padding:8px 0;text-align:right;color:#374151;">${validationSummary.npl_ratio.toFixed(2)}%</td>
            </tr>
          </table>
        </div>
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
