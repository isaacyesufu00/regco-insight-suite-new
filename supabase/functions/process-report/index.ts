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

const NDIC_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in NDIC Deposit Insurance Premium Returns. Validate total insured deposits classification. Check premium rate — 0.4% for commercial banks, 0.3% for MFBs. Check premium = total insured deposits * rate / 4 for quarterly.
If validation fails return ONLY: {"status":"ERROR","error_type":"NDIC_VALIDATION_ERROR","description":"explanation","action_required":"what to fix","figures_involved":"figures","difference":"discrepancy","report":null}
If valid return ONLY: {"status":"SUCCESS","validation_summary":{"total_insured_deposits":"0","premium_rate":"0.30","quarterly_premium_due":"0","compliance_status":"COMPLIANT"},"approved":true}
Return ONLY valid JSON. No markdown. No backticks.`;

const PAYE_PROMPT = `You are a Nigerian tax compliance engine specialising in PAYE remittance returns for FIRS. Monthly return showing employee income tax deducted and remitted. Validate: Total PAYE deducted must equal sum of individual deductions. Total remitted must match bank transfer.
If validation fails return ONLY: {"status":"ERROR","error_type":"PAYE_VALIDATION_ERROR","description":"explanation","action_required":"what to fix","figures_involved":"figures","difference":"discrepancy","report":null}
If valid return ONLY: {"status":"SUCCESS","validation_summary":{"total_employees":"0","total_gross_salary":"0","total_paye_deducted":"0","total_remitted":"0","compliance_status":"COMPLIANT"},"approved":true}
Return ONLY valid JSON. No markdown. No backticks.`;

const WHT_PROMPT = `You are a Nigerian tax compliance engine specialising in Withholding Tax returns for FIRS. WHT deducted at source — 5% individuals, 10% companies. Validate rates match FIRS WHT schedule. Total remitted must equal total deducted.
If validation fails return ONLY: {"status":"ERROR","error_type":"WHT_VALIDATION_ERROR","description":"explanation","action_required":"what to fix","figures_involved":"figures","difference":"discrepancy","report":null}
If valid return ONLY: {"status":"SUCCESS","validation_summary":{"total_transactions":"0","total_wht_deducted":"0","total_remitted":"0","compliance_status":"COMPLIANT"},"approved":true}
Return ONLY valid JSON. No markdown. No backticks.`;

const SOL_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in CBN Single Obligor Limit Reports. SOL limits: 5% for Unit MFBs, 10% for State MFBs, 20% for National MFBs and commercial banks. Check each large exposure against applicable limit.
If violation found return ONLY: {"status":"ERROR","error_type":"SOL_VIOLATION","description":"which borrower breaches","action_required":"remediation","figures_involved":"exposures and limit","difference":"breach amount","report":null}
If compliant return ONLY: {"status":"SUCCESS","validation_summary":{"total_shareholders_funds":"0","applicable_sol_limit_percentage":"0","sol_limit_ngn":"0","number_of_large_exposures":"0","compliance_status":"COMPLIANT"},"approved":true}
Return ONLY valid JSON. No markdown. No backticks.`;

const CONSUMER_PROTECTION_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in CBN Consumer Protection Returns. Quarterly return capturing complaints data. Validate: total complaints = resolved + pending + escalated. Flag resolution rate below 80%.
If validation fails return ONLY: {"status":"ERROR","error_type":"CONSUMER_PROTECTION_ERROR","description":"explanation","action_required":"what to fix","figures_involved":"figures","difference":"discrepancy","report":null}
If valid return ONLY: {"status":"SUCCESS","validation_summary":{"total_complaints":"0","resolution_rate":"0.00","escalation_rate":"0.00","compliance_status":"COMPLIANT"},"approved":true}
Return ONLY valid JSON. No markdown. No backticks.`;

const GOVERNANCE_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in CBN Board and Governance returns. Bi-annual. Validate: min 5 directors for State MFBs, majority non-executive, at least one independent. Must have Audit, Risk, Credit committees.
If non-compliant return ONLY: {"status":"ERROR","error_type":"GOVERNANCE_NON_COMPLIANCE","description":"deficiency","action_required":"corrective action","figures_involved":"actual vs required","difference":"gap","report":null}
If compliant return ONLY: {"status":"SUCCESS","validation_summary":{"total_directors":"0","executive_directors":"0","non_executive_directors":"0","independent_directors":"0","board_meetings_held":"0","compliance_status":"COMPLIANT"},"approved":true}
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
    case 'NDIC Premium Return': return NDIC_PROMPT;
    case 'PAYE Remittance': return PAYE_PROMPT;
    case 'Withholding Tax Return': return WHT_PROMPT;
    case 'Single Obligor Report': return SOL_PROMPT;
    case 'CBN Consumer Protection Return': return CONSUMER_PROTECTION_PROMPT;
    case 'Board Governance Return': return GOVERNANCE_PROMPT;
    case 'MFB Regulatory Return':
    default: return MFB_PROMPT;
  }
}

// ─── CBS ACCOUNT MAPPING ──────────────────────────────────────────────────────
// Each canonical field maps to an array of synonym keywords commonly found in
// Nigerian core banking system exports (Flexcube, Finacle, T24, Bankone, Rubies, etc.).
// Matching is done on normalized labels — lowercase, alphanumeric only.

const FIELD_SYNONYMS: Record<string, string[]> = {
  // ── Balance Sheet — Assets ──
  cash_and_equivalents: ['cash and cash equivalent', 'cash on hand', 'vault cash', 'cash equivalent', 'cash and bank'],
  balances_with_cbn: ['balance with cbn', 'balances with central bank', 'cbn balance', 'cash reserve cbn', 'crr', 'cash reserve requirement'],
  balances_with_other_banks: ['balances with other bank', 'due from other bank', 'placement with bank', 'interbank placement', 'nostro'],
  investment_securities: ['investment securit', 'treasury bill', 'government securit', 'fgn bond', 'investment in securit'],
  gross_loans: ['gross loan', 'total loan', 'loans and advance', 'gross loan and advance', 'loan portfolio gross'],
  performing_loans: ['performing loan', 'standard loan', 'current loan'],
  non_performing_loans: ['non performing loan', 'npl', 'non-performing', 'doubtful loan', 'loss loan', 'substandard loan'],
  loan_loss_provisions: ['loan loss provision', 'provision for loan loss', 'allowance for loan loss', 'impairment'],
  fixed_assets: ['fixed asset', 'property plant equipment', 'ppe', 'land and building', 'tangible asset'],
  other_assets: ['other asset', 'sundry asset', 'prepayment'],
  total_assets: ['total asset', 'sum of asset', 'grand total asset'],
  liquid_assets: ['liquid asset', 'liquidity asset', 'cash and near cash'],

  // ── Balance Sheet — Liabilities ──
  savings_deposits: ['saving deposit', 'savings account'],
  demand_deposits: ['demand deposit', 'current account deposit', 'current deposit'],
  time_deposits: ['time deposit', 'term deposit', 'fixed deposit'],
  other_deposits: ['other deposit', 'sundry deposit', 'domiciliary deposit'],
  total_deposits: ['total deposit', 'customer deposit', 'sum of deposit', 'aggregate deposit'],
  total_liabilities: ['total liabilit', 'sum of liabilit', 'grand total liabilit'],
  cbn_refinancing: ['cbn refinanc', 'cbn intervention', 'cbn facility'],
  other_borrowings: ['other borrowing', 'borrowed fund', 'long term borrowing'],
  other_liabilities: ['other liabilit', 'sundry liabilit', 'accrued expense'],

  // ── Equity ──
  paid_up_capital: ['paid up capital', 'paid-up capital', 'share capital', 'ordinary share'],
  statutory_reserve: ['statutory reserve'],
  retained_earnings: ['retained earning', 'retained profit', 'accumulated profit'],
  total_shareholders_funds: ['shareholders fund', "shareholder's fund", "shareholders' fund", 'total equity', 'net worth', 'owners equity'],

  // ── Capital Adequacy ──
  tier_1_capital: ['tier 1 capital', 'tier i capital', 'tier1 capital', 'core capital'],
  tier_2_capital: ['tier 2 capital', 'tier ii capital', 'tier2 capital', 'supplementary capital'],
  risk_weighted_assets: ['risk weighted asset', 'rwa'],

  // ── Forex ──
  total_fx_inflows: ['fx inflow', 'foreign currency inflow', 'forex inflow', 'fcy inflow'],
  total_fx_outflows: ['fx outflow', 'foreign currency outflow', 'forex outflow', 'fcy outflow'],
  net_open_position: ['net open position', 'nop'],
  usd_inflows: ['usd inflow', 'dollar inflow'],
  usd_outflows: ['usd outflow', 'dollar outflow'],
  gbp_inflows: ['gbp inflow', 'pound inflow'],
  gbp_outflows: ['gbp outflow', 'pound outflow'],
  eur_inflows: ['eur inflow', 'euro inflow'],
  eur_outflows: ['eur outflow', 'euro outflow'],

  // ── AML / NFIU / SCUML ──
  total_transactions: ['total transaction', 'number of transaction', 'transaction count'],
  str_filed: ['str', 'suspicious transaction report'],
  ctr_filed: ['ctr', 'currency transaction report', 'cash transaction report'],
  flagged_transactions: ['flagged transaction', 'suspicious flag'],
  total_customers: ['total customer', 'number of customer', 'customer count'],
  kyc_compliant: ['kyc compliant', 'kyc complete'],
  pep_customers: ['pep', 'politically exposed'],
  high_risk_customers: ['high risk customer', 'high-risk customer'],
  staff_trained: ['staff trained', 'training compliant'],
  total_staff: ['total staff', 'number of staff', 'headcount'],

  // ── Rates & Earnings ──
  prime_lending_rate: ['prime lending rate', 'prime rate'],
  savings_rate: ['savings rate', 'savings deposit rate'],
  interest_income: ['interest income'],
  non_interest_income: ['non interest income', 'non-interest income', 'fee and commission'],
  total_income: ['total income', 'gross income', 'gross revenue'],
  profit_before_tax: ['profit before tax', 'pbt'],
  profit_after_tax: ['profit after tax', 'pat', 'net profit'],
};

const FINANCIAL_FIELDS = Object.keys(FIELD_SYNONYMS);

/** Normalize a string for fuzzy matching: lowercase, collapse non-alphanumerics to single spaces. */
function normalizeLabel(s: string): string {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Try to coerce any cell value (number, string with currency/commas, etc.) to a number. */
function coerceNumber(v: any): number | null {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number' && isFinite(v)) return v;
  const cleaned = String(v).replace(/[,\u20a6$£€\s]/g, '').replace(/[()]/g, (m) => (m === '(' ? '-' : ''));
  const n = parseFloat(cleaned);
  return isFinite(n) ? n : null;
}

/**
 * Parse a raw CBS export (Excel or CSV) and extract financial figures.
 *
 * Walks every sheet, every row. For each row it:
 *  1. Concatenates all non-numeric cells to form a "label" (catches "Account Code | Description" formats).
 *  2. Picks the rightmost numeric cell on the row as the value (CBS exports usually have prior-period
 *     and period-end columns side by side; the last non-zero number is typically the closing balance).
 *  3. Matches the label against FIELD_SYNONYMS — first match wins per field, longer synonyms preferred.
 */
function parseCBSWorkbook(workbook: XLSX.WorkBook): Record<string, number> {
  const data: Record<string, number> = {};
  // Pre-sort synonyms by length desc so longer phrases match before shorter ones
  const fieldEntries: Array<[string, string[]]> = Object.entries(FIELD_SYNONYMS).map(([f, syns]) => [
    f,
    [...syns].sort((a, b) => b.length - a.length),
  ]);

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as any[][];

    for (const row of rows) {
      if (!Array.isArray(row) || row.length === 0) continue;

      // Build label from all non-numeric cells
      const textParts: string[] = [];
      const numericCells: number[] = [];
      for (const cell of row) {
        const asNum = coerceNumber(cell);
        if (asNum !== null && typeof cell !== 'string') {
          numericCells.push(asNum);
        } else if (typeof cell === 'string' && cell.trim() && coerceNumber(cell) === null) {
          textParts.push(cell);
        } else if (asNum !== null) {
          numericCells.push(asNum);
        }
      }
      if (textParts.length === 0 || numericCells.length === 0) continue;

      const label = normalizeLabel(textParts.join(' '));
      if (!label) continue;

      // Pick the last non-zero numeric value as the closing balance; fall back to last number
      let value = 0;
      for (let i = numericCells.length - 1; i >= 0; i--) {
        if (numericCells[i] !== 0) {
          value = numericCells[i];
          break;
        }
      }
      if (value === 0) value = numericCells[numericCells.length - 1];

      // Match against synonyms — first field whose synonym appears in label wins,
      // but don't overwrite a previously-found field
      for (const [field, synonyms] of fieldEntries) {
        if (field in data) continue;
        for (const syn of synonyms) {
          if (label.includes(syn)) {
            data[field] = value;
            break;
          }
        }
      }
    }
  }

  return data;
}

/** Compute derived fields and run deterministic balance-sheet validation. */
function deriveAndValidate(d: Record<string, number>): {
  derived: Record<string, number>;
  metrics: { car_percentage: number; liquidity_percentage: number; npl_ratio: number; loan_to_deposit_ratio: number };
  validationError: string | null;
} {
  const derived = { ...d };

  // Derive total_deposits if missing but components exist
  if (!derived.total_deposits) {
    const sum = (derived.savings_deposits || 0) + (derived.demand_deposits || 0) + (derived.time_deposits || 0) + (derived.other_deposits || 0);
    if (sum > 0) derived.total_deposits = sum;
  }

  // Derive gross_loans if missing
  if (!derived.gross_loans) {
    const sum = (derived.performing_loans || 0) + (derived.non_performing_loans || 0);
    if (sum > 0) derived.gross_loans = sum;
  }

  // Derive shareholders funds if missing
  if (!derived.total_shareholders_funds) {
    const sum = (derived.paid_up_capital || 0) + (derived.statutory_reserve || 0) + (derived.retained_earnings || 0);
    if (sum > 0) derived.total_shareholders_funds = sum;
  }

  // Derive liquid_assets if missing (cash + CBN balances + investment securities)
  if (!derived.liquid_assets) {
    const sum = (derived.cash_and_equivalents || 0) + (derived.balances_with_cbn || 0) + (derived.balances_with_other_banks || 0) + (derived.investment_securities || 0);
    if (sum > 0) derived.liquid_assets = sum;
  }

  // Compute ratios
  const totalCapital = (derived.tier_1_capital || 0) + (derived.tier_2_capital || 0);
  const car = derived.risk_weighted_assets > 0 ? (totalCapital / derived.risk_weighted_assets) * 100 : 0;
  const liq = derived.total_deposits > 0 ? ((derived.liquid_assets || 0) / derived.total_deposits) * 100 : 0;
  const npl = derived.gross_loans > 0 ? ((derived.non_performing_loans || 0) / derived.gross_loans) * 100 : 0;
  const ltd = derived.total_deposits > 0 ? ((derived.gross_loans || 0) / derived.total_deposits) * 100 : 0;

  // Deterministic validation — only run if we have enough data to validate
  let validationError: string | null = null;
  const hasBalanceSheet = derived.total_assets > 0 && derived.total_liabilities > 0;
  if (hasBalanceSheet && derived.total_shareholders_funds > 0) {
    const expected = derived.total_liabilities + derived.total_shareholders_funds;
    const diff = Math.abs(derived.total_assets - expected);
    const tolerance = Math.max(1000, derived.total_assets * 0.005); // 0.5% or NGN 1,000
    if (diff > tolerance) {
      validationError = `Balance sheet does not reconcile. Total Assets (${derived.total_assets.toLocaleString()}) ≠ Total Liabilities + Equity (${expected.toLocaleString()}). Difference: ₦${diff.toLocaleString()}.`;
    }
  }

  return {
    derived,
    metrics: { car_percentage: car, liquidity_percentage: liq, npl_ratio: npl, loan_to_deposit_ratio: ltd },
    validationError,
  };
}

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

    // Step 3: Parse the entire raw CBS workbook (all sheets, all rows) with synonym matching
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const rawData = parseCBSWorkbook(workbook);

    if (Object.keys(rawData).length === 0) {
      throw new Error(
        'We could not identify any recognized account labels in your CBS export. ' +
        'Please ensure the file contains the trial balance, general ledger, or summary balance sheet from your core banking system.'
      );
    }

    // Step 4: Derive missing fields and run deterministic balance-sheet validation
    const { derived: financialData, metrics, validationError } = deriveAndValidate(rawData);

    if (validationError) {
      await patchReport(report_id, {
        status: 'failed',
        error_message: validationError,
        error_type: 'BALANCE_SHEET_RECONCILIATION_FAILED',
      }, serviceRoleKey);
      return new Response(JSON.stringify({ success: true, status: 'ERROR', error: validationError }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Parsed ${Object.keys(financialData).length} fields. Computed CAR=${metrics.car_percentage.toFixed(2)}%, Liquidity=${metrics.liquidity_percentage.toFixed(2)}%, NPL=${metrics.npl_ratio.toFixed(2)}%`);

    // Step 5: Pick the right system prompt — AI is a sanity check, NOT the source of truth
    const systemPrompt = getSystemPrompt(reportType);
    const userMessage = `Generate ${reportType}.
Institution: ${institution_name}
CBN License: ${cbn_license_number}
Category: ${cbn_license_category}
Compliance Lead: ${compliance_lead_name}
Period: ${reporting_period_start} to ${reporting_period_end}
Pre-computed Metrics: CAR=${metrics.car_percentage.toFixed(2)}%, Liquidity=${metrics.liquidity_percentage.toFixed(2)}%, NPL=${metrics.npl_ratio.toFixed(2)}%, LDR=${metrics.loan_to_deposit_ratio.toFixed(2)}%
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
    // IMPORTANT: deterministic metrics override AI's. AI is a sanity check, not the source of truth.
    const aiSummary = aiData.validation_summary || {};
    const validationSummary = {
      ...aiSummary,
      car_percentage: metrics.car_percentage || Number(aiSummary.car_percentage || 0),
      liquidity_percentage: metrics.liquidity_percentage || Number(aiSummary.liquidity_percentage || 0),
      npl_ratio: metrics.npl_ratio || Number(aiSummary.npl_ratio || 0),
      loan_to_deposit_ratio: metrics.loan_to_deposit_ratio || Number(aiSummary.loan_to_deposit_ratio || 0),
    };

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

    // Update report record to ready — use deterministic metrics
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

    // Send success email — show CAR/Liquidity/NPL only when relevant
    const car = validationSummary.car_percentage;
    const liq = validationSummary.liquidity_percentage;
    const npl = validationSummary.npl_ratio;
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
