import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const SUPABASE_URL = 'https://pdplkprcomjslilznbsl.supabase.co';
const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const RESEND_URL = 'https://api.resend.com/emails';

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

You will receive pre-parsed financial data from a RegCo CBS template. Validate the data and return ONLY valid JSON — no markdown, no backticks, no text outside the JSON.

Validation checks:
1. Total Assets (Net) = Total Liabilities + Shareholders Funds (tolerance: 0.1%)
2. CAR = (Tier 1 + Tier 2) / Risk Weighted Assets * 100 — flag if below 10%
3. Liquidity Ratio — flag if below 20%
4. NPL Ratio = Provisions / Gross Loans * 100 — flag if above 5%

If any critical check fails return ONLY:
{"status":"ERROR","error_type":"VALIDATION_FAILED","description":"plain english explanation","action_required":"exactly what to fix","figures_involved":"the specific figures","difference":"exact naira discrepancy"}

If all checks pass return ONLY:
{"status":"SUCCESS","validation_summary":{"car_percentage":0,"liquidity_percentage":0,"npl_ratio":0,"loan_to_deposit_ratio":0},"approved":true}

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

const INTERNATIONAL_TRANSFERS_PROMPT = `You are a Nigerian banking regulatory compliance engine specialising in International Transfers Reports filed quarterly with the NFIU. This return captures all cross-border wire transfers — inbound and outbound — to identify potential money laundering through international channels.

Validate: Total inbound wires must equal sum of all inbound transactions by corridor. Total outbound wires must equal sum of all outbound transactions by corridor. All USD amounts must have corresponding naira equivalents calculated at the CBN official rate provided. Any single transaction above USD 10,000 must be individually listed.

If validation fails return ONLY this JSON:
{"status":"ERROR","error_type":"INTERNATIONAL_TRANSFER_ERROR","description":"plain English explanation of what is wrong","action_required":"exactly what to fix","figures_involved":"the specific figures","difference":"exact discrepancy","report":null}

If valid return ONLY this JSON:
{"status":"SUCCESS","validation_summary":{"total_inbound_transactions":"0","total_outbound_transactions":"0","total_inbound_usd":"0.00","total_outbound_usd":"0.00","high_risk_jurisdictions_count":"0","compliance_status":"COMPLIANT"},"report":{"cover":{"institution_name":"","cbn_license_number":"","reporting_quarter":"","date_prepared":""},"section_a_inbound_transfers":{"total_transactions":0,"total_value_usd":0,"total_value_ngn":0,"transactions_above_10k_usd":0,"top_source_countries":[],"correspondent_banks_used":0},"section_b_outbound_transfers":{"total_transactions":0,"total_value_usd":0,"total_value_ngn":0,"transactions_above_10k_usd":0,"top_destination_countries":[],"purpose_of_transfers":{"trade_finance":0,"personal_remittance":0,"business_payment":0,"other":0}},"section_c_high_risk_jurisdictions":{"transactions_to_fatf_blacklist":0,"transactions_to_fatf_greylist":0,"enhanced_due_diligence_applied":0},"section_d_str_related":{"transfers_flagged_suspicious":0,"str_filed_count":0,"transfers_blocked":0}}}

Replace every field value with the actual figures from the input data. Return ONLY valid JSON. No markdown. No backticks. No text outside the JSON.`;

const VAT_PROMPT = `You are a Nigerian tax compliance engine specialising in Value Added Tax returns filed monthly with the Federal Inland Revenue Service. Nigerian VAT rate is 7.5% on qualifying goods and services. Financial services are largely VAT-exempt under the VAT Act but certain non-core banking services attract VAT including safe deposit box rentals, processing fees for non-banking services, and rental income.

Validate: Output VAT must equal taxable turnover multiplied by 7.5%. Input VAT must have supporting purchase invoices. Net VAT payable must equal output VAT minus allowable input VAT. If input VAT exceeds output VAT the institution has a VAT credit balance.

If validation fails return ONLY this JSON:
{"status":"ERROR","error_type":"VAT_VALIDATION_ERROR","description":"plain English explanation","action_required":"what to fix","figures_involved":"the figures","difference":"exact discrepancy","report":null}

If valid return ONLY this JSON:
{"status":"SUCCESS","validation_summary":{"taxable_turnover":"0","output_vat":"0","input_vat_claimable":"0","net_vat_payable":"0","compliance_status":"COMPLIANT"},"report":{"cover":{"company_name":"","tin":"","vat_registration_number":"","period":"","date_prepared":""},"section_a_output_vat":{"total_vatable_sales_ngn":0,"vat_rate_percentage":7.5,"output_vat_ngn":0,"exempt_supplies_ngn":0,"zero_rated_supplies_ngn":0},"section_b_input_vat":{"total_vatable_purchases_ngn":0,"input_vat_on_purchases_ngn":0,"input_vat_allowable_ngn":0,"input_vat_disallowed_ngn":0},"section_c_vat_computation":{"output_vat_ngn":0,"less_input_vat_ngn":0,"net_vat_payable_ngn":0,"prior_period_credit_ngn":0,"final_vat_due_ngn":0},"section_d_remittance":{"amount_remitted_ngn":0,"remittance_date":"","bank_name":"","receipt_number":"","outstanding_balance_ngn":0}}}

Return ONLY valid JSON. No markdown. No backticks.`;

const CIT_PROMPT = `You are a Nigerian tax compliance engine specialising in Company Income Tax returns filed annually with the Federal Inland Revenue Service. The CIT rate for companies with turnover above NGN 100 million is 30%. For medium companies with turnover between NGN 25 million and NGN 100 million the rate is 20%. For small companies below NGN 25 million the rate is 0%.

Validate: Chargeable profit must equal gross income minus allowable deductions minus capital allowances. Tax payable must equal chargeable profit multiplied by the applicable rate. Minimum tax provisions apply if the company has been in business for more than 4 years — minimum tax is the higher of 0.5% of gross turnover or 0.5% of net assets. Education tax is 2.5% of assessable profit.

If validation fails return ONLY this JSON:
{"status":"ERROR","error_type":"CIT_VALIDATION_ERROR","description":"explanation","action_required":"what to fix","figures_involved":"figures","difference":"discrepancy","report":null}

If valid return ONLY this JSON:
{"status":"SUCCESS","validation_summary":{"gross_income":"0","chargeable_profit":"0","applicable_rate_percentage":"0","cit_payable":"0","education_tax":"0","total_tax_payable":"0","compliance_status":"COMPLIANT"},"report":{"cover":{"company_name":"","tin":"","rc_number":"","assessment_year":"","date_prepared":""},"section_a_income_statement":{"gross_income_ngn":0,"cost_of_sales_ngn":0,"gross_profit_ngn":0,"operating_expenses_ngn":0,"profit_before_tax_ngn":0,"add_back_disallowable_expenses_ngn":0,"less_allowable_deductions_ngn":0,"less_capital_allowances_ngn":0,"assessable_profit_ngn":0},"section_b_tax_computation":{"assessable_profit_ngn":0,"applicable_cit_rate":0,"cit_payable_ngn":0,"education_tax_at_2_5_percent_ngn":0,"total_taxes_due_ngn":0,"less_withholding_tax_credit_ngn":0,"net_tax_payable_ngn":0},"section_c_minimum_tax":{"gross_turnover_ngn":0,"half_percent_of_turnover_ngn":0,"net_assets_ngn":0,"half_percent_of_net_assets_ngn":0,"minimum_tax_applicable_ngn":0,"standard_tax_vs_minimum_tax":"STANDARD"},"section_d_payment_history":{"first_instalment_paid_ngn":0,"second_instalment_paid_ngn":0,"balance_outstanding_ngn":0}}}

Return ONLY valid JSON. No markdown. No backticks.`;

function getSystemPrompt(reportType: string): string {
  switch (reportType) {
    case 'CBN Forex Return': return FOREX_PROMPT;
    case 'AML/CFT Report':
    case 'AML/CFT Compliance Report': return AML_PROMPT;
    case 'SCUML Compliance Report':
    case 'SCUML Annual Compliance': return SCUML_PROMPT;
    case 'CBN Monetary Policy Return':
    case 'Monetary Policy Return': return MONETARY_POLICY_PROMPT;
    case 'NFIU Regulatory Return': return NFIU_PROMPT;
    case 'Prudential Return': return PRUDENTIAL_PROMPT;
    case 'NDIC Premium Return': return NDIC_PROMPT;
    case 'PAYE Remittance': return PAYE_PROMPT;
    case 'Withholding Tax Return': return WHT_PROMPT;
    case 'Single Obligor Report': return SOL_PROMPT;
    case 'CBN Consumer Protection Return':
    case 'Consumer Protection Return': return CONSUMER_PROTECTION_PROMPT;
    case 'Board Governance Return': return GOVERNANCE_PROMPT;
    case 'International Transfers Report': return INTERNATIONAL_TRANSFERS_PROMPT;
    case 'VAT Return': return VAT_PROMPT;
    case 'Company Income Tax Return': return CIT_PROMPT;
    case 'MFB Regulatory Return':
    default: return MFB_PROMPT;
  }
}

// ─── REPORT-SPECIFIC ERROR GUIDANCE ──────────────────────────────────────────

function getReportSpecificGuidance(reportType: string, _errorType: string): string {
  const guidance: Record<string, string> = {
    'MFB Regulatory Return': 'Check that your CBS trial balance is fully reconciled. Total Assets must equal Total Liabilities plus Shareholders Funds exactly. Export a fresh trial balance from your core banking system and verify the figures manually before re-uploading.',
    'CBN Forex Return': 'Check that your FX inflow and outflow figures are in USD not naira. Verify that the net open position does not exceed your regulatory limit. Contact your treasury team to confirm the daily FX position figures.',
    'AML/CFT Compliance Report': 'Verify your STR and CTR counts against your transaction monitoring records. Check that the total transactions monitored figure matches your CBS transaction count for the quarter.',
    'AML/CFT Report': 'Verify your STR and CTR counts against your transaction monitoring records. Check that the total transactions monitored figure matches your CBS transaction count for the quarter.',
    'PAYE Remittance': 'Check that the sum of all individual employee PAYE deductions equals the total PAYE figure. Verify pension and NHF deductions are correctly excluded from taxable income before computing PAYE.',
    'Withholding Tax Return': 'Check that the WHT rate applied matches the FIRS schedule — 5% for individuals and 10% for companies on most payment types. Verify all vendor TINs are populated.',
    'VAT Return': 'Check that output VAT equals your vatable sales multiplied by 7.5%. Verify that financial services income is correctly classified as VAT-exempt. Only fee income on non-banking services should attract output VAT.',
    'Company Income Tax Return': 'Check that all disallowable expenses have been added back to profit before tax. Verify capital allowances are computed at the correct initial and annual allowance rates per the Companies Income Tax Act.',
    'Single Obligor Report': 'Check that total shareholders funds is correctly stated. The SOL limit is calculated as shareholders funds multiplied by the applicable percentage for your license category. Review all large exposures against this limit.',
    'NDIC Premium Return': 'Check that total insured deposits are correctly classified. Apply 0.3% for MFBs or 0.4% for commercial banks. Deposits above the insured limit per depositor should be excluded from the premium base.',
    'International Transfers Report': 'Check that all wire transfers are captured and amounts are in USD. Verify the naira equivalent using the CBN official rate for the relevant transaction date. All transfers above USD 10,000 must be individually listed.',
    'Board Governance Return': 'Check board composition meets minimum requirements — at least 5 directors for State MFBs with majority non-executive. Verify all three mandatory committees are constituted with correct membership.',
    'Consumer Protection Return': 'Verify complaint counts are reconciled with your complaints register. Resolution rate must be calculated correctly. Any rate below 80% must be accompanied by an explanation of remediation steps.',
    'CBN Consumer Protection Return': 'Verify complaint counts are reconciled with your complaints register. Resolution rate must be calculated correctly. Any rate below 80% must be accompanied by an explanation of remediation steps.',
    'Prudential Return': 'Verify CAMEL framework data. Capital adequacy ratio must be at least 10%. Check asset quality classifications match CBN guidelines for performing, watch-list, substandard, doubtful and loss categories.',
    'CBN Monetary Policy Return': 'Check that interest rate data matches your core banking system. Verify cash reserve ratio and liquidity ratio against CBN requirements.',
    'Monetary Policy Return': 'Check that interest rate data matches your core banking system. Verify cash reserve ratio and liquidity ratio against CBN requirements.',
    'NFIU Regulatory Return': 'Verify STR and CTR filing counts against your compliance records. Ensure all customer screening results are accurate and PEP matches are documented.',
    'SCUML Compliance Report': 'Verify SCUML registration status and renewal date. Ensure AML policy review date is current and all staff training records are up to date.',
    'SCUML Annual Compliance': 'Verify SCUML registration status and renewal date. Ensure AML policy review date is current and all staff training records are up to date.',
  };
  return guidance[reportType] || 'Please review your uploaded data carefully, correct the identified discrepancy, and resubmit your CBS export.';
}

// ─── CBS ACCOUNT MAPPING ──────────────────────────────────────────────────────

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

  // ── International Transfers ──
  total_inbound_usd: ['inbound usd', 'inbound transfer', 'wire inbound', 'total inbound wire'],
  total_outbound_usd: ['outbound usd', 'outbound transfer', 'wire outbound', 'total outbound wire'],
  inbound_ngn: ['inbound ngn', 'inbound naira'],
  outbound_ngn: ['outbound ngn', 'outbound naira'],
  transactions_above_10k: ['above 10k', 'large transfer', 'above 10000'],

  // ── VAT ──
  vatable_sales: ['vatable sale', 'vat sales', 'taxable turnover', 'vatable turnover'],
  output_vat: ['output vat', 'vat output'],
  input_vat: ['input vat', 'vat input', 'vat on purchase'],
  vat_payable: ['vat payable', 'net vat'],

  // ── CIT ──
  gross_income_cit: ['gross income', 'total income', 'gross revenue'],
  capital_allowances: ['capital allowance', 'wear tear', 'wear and tear'],
  assessable_profit: ['assessable profit', 'chargeable profit'],
  education_tax: ['education tax', 'edu tax', 'tertiary education tax'],
};

const FINANCIAL_FIELDS = Object.keys(FIELD_SYNONYMS);

function normalizeLabel(s: string): string {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function coerceNumber(v: any): number | null {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number' && isFinite(v)) return v;
  const cleaned = String(v).replace(/[,\u20a6$£€\s]/g, '').replace(/[()]/g, (m) => (m === '(' ? '-' : ''));
  const n = parseFloat(cleaned);
  return isFinite(n) ? n : null;
}

function parseCBSWorkbook(workbook: XLSX.WorkBook): Record<string, number> {
  const data: Record<string, number> = {};
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

      let value = 0;
      for (let i = numericCells.length - 1; i >= 0; i--) {
        if (numericCells[i] !== 0) {
          value = numericCells[i];
          break;
        }
      }
      if (value === 0) value = numericCells[numericCells.length - 1];

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

function deriveAndValidate(d: Record<string, number>): {
  derived: Record<string, number>;
  metrics: { car_percentage: number; liquidity_percentage: number; npl_ratio: number; loan_to_deposit_ratio: number };
  validationError: string | null;
} {
  const derived = { ...d };

  if (!derived.total_deposits) {
    const sum = (derived.savings_deposits || 0) + (derived.demand_deposits || 0) + (derived.time_deposits || 0) + (derived.other_deposits || 0);
    if (sum > 0) derived.total_deposits = sum;
  }

  if (!derived.gross_loans) {
    const sum = (derived.performing_loans || 0) + (derived.non_performing_loans || 0);
    if (sum > 0) derived.gross_loans = sum;
  }

  if (!derived.total_shareholders_funds) {
    const sum = (derived.paid_up_capital || 0) + (derived.statutory_reserve || 0) + (derived.retained_earnings || 0);
    if (sum > 0) derived.total_shareholders_funds = sum;
  }

  if (!derived.liquid_assets) {
    const sum = (derived.cash_and_equivalents || 0) + (derived.balances_with_cbn || 0) + (derived.balances_with_other_banks || 0) + (derived.investment_securities || 0);
    if (sum > 0) derived.liquid_assets = sum;
  }

  const totalCapital = (derived.tier_1_capital || 0) + (derived.tier_2_capital || 0);
  const car = derived.risk_weighted_assets > 0 ? (totalCapital / derived.risk_weighted_assets) * 100 : 0;
  const liq = derived.total_deposits > 0 ? ((derived.liquid_assets || 0) / derived.total_deposits) * 100 : 0;
  const npl = derived.gross_loans > 0 ? ((derived.non_performing_loans || 0) / derived.gross_loans) * 100 : 0;
  const ltd = derived.total_deposits > 0 ? ((derived.gross_loans || 0) / derived.total_deposits) * 100 : 0;

  let validationError: string | null = null;
  const hasBalanceSheet = derived.total_assets > 0 && derived.total_liabilities > 0;
  if (hasBalanceSheet && derived.total_shareholders_funds > 0) {
    const expected = derived.total_liabilities + derived.total_shareholders_funds;
    const diff = Math.abs(derived.total_assets - expected);
    const tolerance = Math.max(1000, derived.total_assets * 0.005);
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

async function patchReport(reportId: string, data: Record<string, any>, serviceRoleKey: string): Promise<string | null> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}`, {
    method: 'PATCH',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => 'unknown');
    return `DB patch failed (${res.status}): ${errText}`;
  }
  return null;
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
  rc_number?: string;
  address?: string;
  state_of_operation?: string;
  reporting_period?: string;
}

function buildMFBReport(financialData: Record<string, number>, vs: any, meta: Meta): string {
  const car = Number(vs.car_percentage || 0);
  const liq = Number(vs.liquidity_percentage || 0);
  const npl = Number(vs.npl_ratio || 0);
  const now = new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
  const carStatus = car >= 10 ? 'COMPLIANT' : 'NON-COMPLIANT';
  const liqStatus = liq >= 20 ? 'COMPLIANT' : 'NON-COMPLIANT';
  const nplStatus = npl <= 5 ? 'COMPLIANT' : 'NON-COMPLIANT';
  const sep = '='.repeat(80);
  const line = '-'.repeat(55);
  const d = financialData;
  const period = meta.reporting_period || `${meta.reporting_period_start} to ${meta.reporting_period_end}`;

  const fmt = (v: number) => Math.round((v || 0) / 1000).toLocaleString('en-NG');
  const totalLiabAndEquity = (d.total_liabilities || 0) + (d.total_shareholders_funds || 0);
  const totalQualifyingCapital = (d.tier_1_capital || 0) + (d.tier_2_capital || 0);
  const netLoans = (d.gross_loans || 0) - (d.loan_loss_provisions || 0);

  return `${sep}
                        CENTRAL BANK OF NIGERIA
                  MICROFINANCE BANK REGULATORY RETURN
                       MONTHLY REPORT — ${period}
${sep}

SECTION A: INSTITUTION IDENTIFICATION
======================================
1. Name of Institution:          ${meta.institution_name}
2. CBN License Number:           ${meta.cbn_license_number}
3. License Category:             ${meta.cbn_license_category}
4. RC Number:                    ${meta.rc_number || '—'}
5. Head Office Address:          ${meta.address || '—'}
6. State of Operation:           ${meta.state_of_operation || '—'}
7. Reporting Date:               ${period}

SECTION B: BALANCE SHEET
=========================
ASSETS                                         ₦'000
${line}
B1.  Cash and Cash Equivalents:                ${fmt(d.cash_and_equivalents)}
B2.  Balances with CBN:                        ${fmt(d.balances_with_cbn)}
B3.  Balances with Other Banks:                ${fmt(d.balances_with_other_banks)}
B4.  Investment Securities:                    ${fmt(d.investment_securities)}
B5.  Gross Loans and Advances:                 ${fmt(d.gross_loans)}
B6.  Fixed Assets (Net):                       ${fmt(d.fixed_assets)}
B7.  Other Assets:                             ${fmt(d.other_assets)}
     Less: Loan Loss Provisions:               (${fmt(d.loan_loss_provisions)})
${line}
TOTAL ASSETS (NET):                            ${fmt(d.total_assets)}

LIABILITIES
${line}
B8.  Savings Deposits:                         ${fmt(d.savings_deposits)}
B9.  Current and Demand Deposits:              ${fmt(d.demand_deposits)}
B10. Fixed and Time Deposits:                  ${fmt(d.time_deposits)}
B11. Other Special Deposits:                   ${fmt(d.other_deposits)}
B12. CBN Refinancing/Borrowings:               ${fmt(d.cbn_refinancing)}
B13. Other Liabilities:                        ${fmt(d.other_liabilities)}
${line}
TOTAL LIABILITIES:                             ${fmt(d.total_liabilities)}

SHAREHOLDERS' FUNDS
${line}
B14. Shareholders' Funds (Capital & Reserves): ${fmt(d.total_shareholders_funds)}
${line}
TOTAL LIABILITIES AND EQUITY:                  ${fmt(totalLiabAndEquity)}

SECTION C: CAPITAL ADEQUACY
============================
C1.  Tier 1 Capital (₦'000):                  ${fmt(d.tier_1_capital)}
C2.  Tier 2 Capital (₦'000):                  ${fmt(d.tier_2_capital)}
C3.  Total Qualifying Capital (₦'000):         ${fmt(totalQualifyingCapital)}
C4.  Total Risk Weighted Assets (₦'000):       ${fmt(d.risk_weighted_assets)}
C5.  Capital Adequacy Ratio (CAR):             ${car.toFixed(2)}%
     CBN Minimum Requirement:                  10%
     Status:                                   ${carStatus}

SECTION D: LIQUIDITY
=====================
D1.  Liquidity Ratio:                          ${liq.toFixed(2)}%
     CBN Minimum Requirement:                  20%
     Status:                                   ${liqStatus}

SECTION E: DEPOSIT ANALYSIS
============================
E1.  Total Customer Deposits (₦'000):          ${fmt(d.total_deposits)}
E2.  Savings Deposits:                         ${fmt(d.savings_deposits)}
E3.  Current and Demand Deposits:              ${fmt(d.demand_deposits)}
E4.  Fixed/Time Deposits:                      ${fmt(d.time_deposits)}
E5.  Other Special Deposits:                   ${fmt(d.other_deposits)}

SECTION F: LOAN PORTFOLIO
==========================
F1.  Gross Loans and Advances (₦'000):         ${fmt(d.gross_loans)}
F2.  Loan Loss Provisions (₦'000):             ${fmt(d.loan_loss_provisions)}
F3.  Net Loans and Advances (₦'000):           ${fmt(netLoans)}
F4.  NPL Ratio:                                ${npl.toFixed(2)}%
     CBN Maximum Threshold:                    5%
     Status:                                   ${nplStatus}

SECTION G: CERTIFICATION
=========================
I certify that the information provided in this return is true, accurate and complete
to the best of my knowledge and in accordance with the CBN guidelines for Microfinance
Banks as contained in the Revised Regulatory and Supervisory Guidelines for MFBs in
Nigeria (2012) and subsequent circulars.

Name of Authorized Signatory: _______________________________
Designation:                   _______________________________
Date:                          _______________________________
Signature:                     _______________________________

${sep}
Generated by RegCo Compliance Suite | Report Date: ${now}
Compliance Lead: ${meta.compliance_lead_name}
${sep}
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

  const regulatorMap: Record<string, string> = {
    'NDIC Deposit Insurance Premium Return': 'NIGERIA DEPOSIT INSURANCE CORPORATION (NDIC)',
    'FIRS PAYE Remittance Return': 'FEDERAL INLAND REVENUE SERVICE (FIRS)',
    'FIRS Withholding Tax Return': 'FEDERAL INLAND REVENUE SERVICE (FIRS)',
    'FIRS VAT Return': 'FEDERAL INLAND REVENUE SERVICE (FIRS)',
    'FIRS Company Income Tax Return': 'FEDERAL INLAND REVENUE SERVICE (FIRS)',
    'CBN Single Obligor Limit Report': 'CENTRAL BANK OF NIGERIA (CBN)',
    'CBN Consumer Protection Regulatory Return': 'CENTRAL BANK OF NIGERIA (CBN)',
    'CBN Board and Governance Return': 'CENTRAL BANK OF NIGERIA (CBN)',
    'NFIU International Transfers Report': 'NIGERIAN FINANCIAL INTELLIGENCE UNIT (NFIU)',
  };

  const regulator = regulatorMap[reportType] || 'REGULATORY AUTHORITY';

  return `${sep}
                    ${regulator}
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
    case 'SCUML Annual Compliance':
      return buildAMLReport(financialData, vs, meta, reportType);
    case 'NDIC Premium Return':
      return buildGenericReport(financialData, vs, meta, 'NDIC Deposit Insurance Premium Return');
    case 'PAYE Remittance':
      return buildGenericReport(financialData, vs, meta, 'FIRS PAYE Remittance Return');
    case 'Withholding Tax Return':
      return buildGenericReport(financialData, vs, meta, 'FIRS Withholding Tax Return');
    case 'Single Obligor Report':
      return buildGenericReport(financialData, vs, meta, 'CBN Single Obligor Limit Report');
    case 'CBN Consumer Protection Return':
    case 'Consumer Protection Return':
      return buildGenericReport(financialData, vs, meta, 'CBN Consumer Protection Regulatory Return');
    case 'Board Governance Return':
      return buildGenericReport(financialData, vs, meta, 'CBN Board and Governance Return');
    case 'International Transfers Report':
      return buildGenericReport(financialData, vs, meta, 'NFIU International Transfers Report');
    case 'VAT Return':
      return buildGenericReport(financialData, vs, meta, 'FIRS VAT Return');
    case 'Company Income Tax Return':
      return buildGenericReport(financialData, vs, meta, 'FIRS Company Income Tax Return');
    case 'CBN Monetary Policy Return':
    case 'Monetary Policy Return':
      return buildGenericReport(financialData, vs, meta, reportType);
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

    await patchReport(report_id, { status: 'processing' }, serviceRoleKey);

    const fileResponse = await fetch(file_url);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download CBS file: ${fileResponse.status} ${fileResponse.statusText}`);
    }
    const arrayBuffer = await fileResponse.arrayBuffer();

    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

    // ============================================================
    // SHEET PARSER — RegCo CBS Template
    // Handles: Institution Details, GL Summary, RegCo Upload Format
    // Falls back to generic fuzzy parser for non-template uploads
    // ============================================================
    const norm = (s: string) => String(s ?? '').toUpperCase().trim();

    const institutionSheet = workbook.Sheets['Institution Details'];
    const glSheet = workbook.Sheets['GL Summary'];
    const uploadSheet = workbook.Sheets['RegCo Upload Format'];
    const hasRegCoTemplate = !!(institutionSheet && glSheet && uploadSheet);

    let financialData: Record<string, number>;
    let metrics: { car_percentage: number; liquidity_percentage: number; npl_ratio: number; loan_to_deposit_ratio: number };
    let dataPayload: string;
    let institutionNameParsed = institution_name;
    let licenseNumberParsed = cbn_license_number;
    let licenseCategoryParsed = cbn_license_category;
    let rcNumberParsed = '';
    let addressParsed = '';
    let stateFieldParsed = '';
    let reportingPeriodParsed = '';

    if (hasRegCoTemplate) {
      // ── Sheet 1: Institution Details ──────────────────────────
      const institutionRows = XLSX.utils.sheet_to_json(institutionSheet, { header: 1 }) as any[][];
      const instData: Record<string, string> = {};
      for (const row of institutionRows) {
        if (row[0] && row[1]) instData[norm(String(row[0]))] = String(row[1]).trim();
      }
      institutionNameParsed = instData['INSTITUTION NAME'] || institution_name;
      licenseCategoryParsed = instData['LICENSE CATEGORY'] || cbn_license_category;
      licenseNumberParsed = instData['LICENSE NUMBER'] || cbn_license_number;
      rcNumberParsed = instData['RC NUMBER'] || '';
      reportingPeriodParsed = instData['REPORTING PERIOD'] || `${reporting_period_start} to ${reporting_period_end}`;
      stateFieldParsed = instData['STATE'] || '';
      addressParsed = instData['HEAD OFFICE ADDRESS'] || '';
      // local aliases for use within this block
      const rcNumber = rcNumberParsed;
      const reportingPeriod = reportingPeriodParsed;
      const stateField = stateFieldParsed;
      const address = addressParsed;

      // ── Sheet 2: GL Summary ───────────────────────────────────
      const glRows = XLSX.utils.sheet_to_json(glSheet, { header: 1 }) as any[][];
      const glData: Record<string, { debit: number; credit: number }> = {};
      let glTotalDebit = 0, glTotalCredit = 0;
      for (const row of glRows) {
        const label = norm(String(row[0] ?? ''));
        const debit = Number(row[1]) || 0;
        const credit = Number(row[2]) || 0;
        if (label === 'TOTAL') { glTotalDebit = debit; glTotalCredit = credit; }
        else if (label) glData[label] = { debit, credit };
      }

      const glFind = (keys: string[]) => {
        for (const k of keys) {
          if (glData[k]) return glData[k];
          const match = Object.keys(glData).find(l => l.includes(k));
          if (match) return glData[match];
        }
        return { debit: 0, credit: 0 };
      };

      const cashAndEquivalents  = glFind(['CASH AND CASH EQUIVALENTS', 'CASH']).debit;
      const cbnBalance          = glFind(['BALANCES WITH CENTRAL BANK OF NIGERIA', 'CBN BALANCE']).debit;
      const interbankBalance    = glFind(['BALANCES WITH OTHER BANKS', 'INTERBANK']).debit;
      const investments         = glFind(['INVESTMENT SECURITIES', 'INVESTMENTS']).debit;
      const grossLoans          = glFind(['GROSS LOANS AND ADVANCES', 'GROSS LOANS', 'LOANS AND ADVANCES']).debit;
      const fixedAssets         = glFind(['FIXED ASSETS (NET)', 'FIXED ASSETS']).debit;
      const otherAssets         = glFind(['OTHER ASSETS']).debit;
      const provisionsFromGL    = glFind(['LOAN LOSS PROVISIONS (CONTRA-ASSET)', 'LOAN LOSS PROVISIONS', 'PROVISIONS', 'CONTRA']).credit;
      const savingsDeposits     = glFind(['SAVINGS DEPOSITS', 'SAVINGS']).credit;
      const currentDeposits     = glFind(['CURRENT AND DEMAND DEPOSITS', 'CURRENT DEPOSITS']).credit;
      const fixedDeposits       = glFind(['FIXED AND TIME DEPOSITS', 'TERM DEPOSITS', 'FIXED DEPOSITS']).credit;
      const specialDeposits     = glFind(['OTHER SPECIAL DEPOSITS', 'SPECIAL DEPOSITS']).credit;
      const borrowings          = glFind(['CBN REFINANCING/BORROWINGS', 'BORROWINGS', 'CBN REFINANCING']).credit;
      const otherLiabilities    = glFind(['OTHER LIABILITIES']).credit;

      if (Math.abs(glTotalDebit - glTotalCredit) > 1000) {
        console.warn(`GL does not self-balance. Debit: ${glTotalDebit}, Credit: ${glTotalCredit}`);
      }

      // ── Sheet 3: RegCo Upload Format ──────────────────────────
      // IMPORTANT: "TOTAL ASSETS (GROSS)" and "TOTAL ASSETS (NET)" are DISTINCT fields.
      const uploadRows = XLSX.utils.sheet_to_json(uploadSheet, { header: 1 }) as any[][];
      const uploadData: Record<string, number> = {};
      for (const row of uploadRows) {
        const label = norm(String(row[0] ?? ''));
        const amount = Number(String(row[1] ?? '').replace(/,/g, '')) || 0;
        if (label && amount) uploadData[label] = amount;
      }

      const uploadFind = (keys: string[]) => {
        for (const k of keys) {
          if (uploadData[k] !== undefined) return uploadData[k];
          const match = Object.keys(uploadData).find(l => l.includes(k));
          if (match) return uploadData[match];
        }
        return 0;
      };

      const totalAssetsGross        = uploadFind(['TOTAL ASSETS (GROSS)', 'GROSS ASSETS', 'TOTAL ASSETS GROSS']);
      const provisionsAmount        = uploadFind(['LESS: PROVISIONS', 'LOAN LOSS PROVISION', 'PROVISIONS']) || provisionsFromGL;
      const totalAssetsNet          = uploadFind(['TOTAL ASSETS (NET)', 'NET ASSETS', 'TOTAL ASSETS NET'])
                                       || (totalAssetsGross - provisionsAmount);
      const totalDeposits           = uploadFind(['TOTAL CUSTOMER DEPOSITS', 'CUSTOMER DEPOSITS', 'TOTAL DEPOSITS']);
      const totalLiabilities        = uploadFind(['TOTAL LIABILITIES']);
      const shareholdersFunds       = uploadFind(['SHAREHOLDERS FUNDS', "SHAREHOLDERS' FUNDS", 'EQUITY']);
      const totalLiabilitiesAndEquity = uploadFind(['TOTAL LIABILITIES AND EQUITY', 'TOTAL LIABILITIES + EQUITY', 'LIABILITIES AND EQUITY']);
      const tier1Capital            = uploadFind(['TIER 1 CAPITAL']);
      const tier2Capital            = uploadFind(['TIER 2 CAPITAL']);
      const totalCapital            = uploadFind(['TOTAL QUALIFYING CAPITAL', 'QUALIFYING CAPITAL']);
      const rwa                     = uploadFind(['RISK WEIGHTED ASSETS (RWA)', 'RISK WEIGHTED ASSETS', 'RWA']);
      const carPercent              = uploadFind(['CAPITAL ADEQUACY RATIO (%)', 'CAPITAL ADEQUACY RATIO', 'CAR']);
      const liquidityPercent        = uploadFind(['LIQUIDITY RATIO (%)', 'LIQUIDITY RATIO']);

      // Guard: TOTAL LIABILITIES must NOT equal TOTAL LIABILITIES AND EQUITY (wrong fuzzy match)
      const safeTotalLiabilities = (totalLiabilities === totalLiabilitiesAndEquity)
        ? totalLiabilitiesAndEquity - shareholdersFunds
        : totalLiabilities;

      // ── Balance Sheet Validation ──────────────────────────────
      // CORRECT: Total Assets (Net) = Total Liabilities + Equity (NOT Gross)
      const bsRHS = totalLiabilitiesAndEquity || (safeTotalLiabilities + shareholdersFunds);
      const difference = Math.abs(totalAssetsNet - bsRHS);
      const tolerance = totalAssetsNet * 0.001; // 0.1% — handles CBS rounding

      if (totalAssetsNet > 0 && bsRHS > 0 && difference > tolerance) {
        const errMsg =
          `Balance sheet does not reconcile. ` +
          `Net Assets (₦${totalAssetsNet.toLocaleString('en-NG')}) ≠ ` +
          `Total Liabilities + Equity (₦${bsRHS.toLocaleString('en-NG')}). ` +
          `Difference: ₦${difference.toLocaleString('en-NG')}. ` +
          `Please check your RegCo Upload Format sheet. ` +
          `Note: Use Total Assets (Net), not Gross, in your upload file.`;
        await patchReport(report_id, {
          status: 'failed',
          error_message: errMsg,
          error_type: 'BALANCE_SHEET_RECONCILIATION_FAILED',
        }, serviceRoleKey);
        return new Response(JSON.stringify({ success: true, status: 'ERROR', error: errMsg }), {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }

      const carCalc = carPercent || (rwa > 0 ? ((tier1Capital + tier2Capital) / rwa) * 100 : 0);
      const liqCalc = liquidityPercent || (totalDeposits > 0
        ? ((cashAndEquivalents + cbnBalance + interbankBalance + investments) / totalDeposits) * 100
        : 0);
      const nplCalc = grossLoans > 0 ? (provisionsAmount / grossLoans) * 100 : 0;

      metrics = {
        car_percentage: carCalc,
        liquidity_percentage: liqCalc,
        npl_ratio: nplCalc,
        loan_to_deposit_ratio: totalDeposits > 0 ? (grossLoans / totalDeposits) * 100 : 0,
      };

      financialData = {
        cash_and_equivalents: cashAndEquivalents,
        balances_with_cbn: cbnBalance,
        balances_with_other_banks: interbankBalance,
        investment_securities: investments,
        gross_loans: grossLoans,
        fixed_assets: fixedAssets,
        other_assets: otherAssets,
        loan_loss_provisions: provisionsAmount,
        savings_deposits: savingsDeposits,
        demand_deposits: currentDeposits,
        time_deposits: fixedDeposits,
        other_deposits: specialDeposits,
        total_deposits: totalDeposits,
        total_liabilities: safeTotalLiabilities,
        total_shareholders_funds: shareholdersFunds,
        total_assets: totalAssetsNet,
        tier_1_capital: tier1Capital,
        tier_2_capital: tier2Capital,
        risk_weighted_assets: rwa,
        liquid_assets: cashAndEquivalents + cbnBalance + interbankBalance + investments,
        cbn_refinancing: borrowings,
        other_liabilities: otherLiabilities,
      };

      dataPayload = `
INSTITUTION DETAILS
===================
Institution Name: ${institutionNameParsed}
License Number: ${licenseNumberParsed}
License Category: ${licenseCategoryParsed}
RC Number: ${rcNumber}
Reporting Period: ${reportingPeriod}
State: ${stateField}
Head Office Address: ${address}

BALANCE SHEET SUMMARY (CBN-FORMAT)
===================================
Total Assets (Gross): ₦${totalAssetsGross.toLocaleString('en-NG')}
Less: Loan Loss Provisions: ₦${provisionsAmount.toLocaleString('en-NG')}
Total Assets (Net): ₦${totalAssetsNet.toLocaleString('en-NG')}
Total Customer Deposits: ₦${totalDeposits.toLocaleString('en-NG')}
Total Liabilities: ₦${safeTotalLiabilities.toLocaleString('en-NG')}
Shareholders Funds: ₦${shareholdersFunds.toLocaleString('en-NG')}
Total Liabilities and Equity: ₦${bsRHS.toLocaleString('en-NG')}

CAPITAL & LIQUIDITY RATIOS
===========================
Tier 1 Capital: ₦${tier1Capital.toLocaleString('en-NG')}
Tier 2 Capital: ₦${tier2Capital.toLocaleString('en-NG')}
Total Qualifying Capital: ₦${totalCapital.toLocaleString('en-NG')}
Risk Weighted Assets: ₦${rwa.toLocaleString('en-NG')}
Capital Adequacy Ratio (CAR): ${carCalc.toFixed(2)}%
Liquidity Ratio: ${liqCalc.toFixed(2)}%

GL BREAKDOWN
=============
Cash and Cash Equivalents: ₦${cashAndEquivalents.toLocaleString('en-NG')}
Balances with CBN: ₦${cbnBalance.toLocaleString('en-NG')}
Balances with Other Banks: ₦${interbankBalance.toLocaleString('en-NG')}
Investment Securities: ₦${investments.toLocaleString('en-NG')}
Gross Loans and Advances: ₦${grossLoans.toLocaleString('en-NG')}
Fixed Assets (Net): ₦${fixedAssets.toLocaleString('en-NG')}
Other Assets: ₦${otherAssets.toLocaleString('en-NG')}
Savings Deposits: ₦${savingsDeposits.toLocaleString('en-NG')}
Current and Demand Deposits: ₦${currentDeposits.toLocaleString('en-NG')}
Fixed and Time Deposits: ₦${fixedDeposits.toLocaleString('en-NG')}
Other Special Deposits: ₦${specialDeposits.toLocaleString('en-NG')}
CBN Refinancing/Borrowings: ₦${borrowings.toLocaleString('en-NG')}
Other Liabilities: ₦${otherLiabilities.toLocaleString('en-NG')}
`.trim();

      console.log(`RegCo template parsed: ${institutionNameParsed} | CAR=${carCalc.toFixed(2)}%, Liquidity=${liqCalc.toFixed(2)}%, NPL=${nplCalc.toFixed(2)}%`);

    } else {
      // ── Fallback: generic fuzzy CBS parser ───────────────────
      const rawData = parseCBSWorkbook(workbook);

      if (Object.keys(rawData).length === 0) {
        throw new Error(
          'We could not identify any recognized account labels in your CBS export. ' +
          'Please ensure the file contains the trial balance, general ledger, or summary balance sheet from your core banking system, ' +
          'or use the RegCo CBS Template (with sheets: Institution Details, GL Summary, RegCo Upload Format).'
        );
      }

      const { derived, metrics: m, validationError } = deriveAndValidate(rawData);

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

      financialData = derived;
      metrics = m;
      dataPayload = `Institution: ${institution_name}\nPeriod: ${reporting_period_start} to ${reporting_period_end}\nFinancial Data: ${JSON.stringify(financialData)}`;
      console.log(`Generic CBS parsed. CAR=${metrics.car_percentage.toFixed(2)}%, Liquidity=${metrics.liquidity_percentage.toFixed(2)}%, NPL=${metrics.npl_ratio.toFixed(2)}%`);
    }

    const systemPrompt = getSystemPrompt(reportType);
    const userMessage = `Generate ${reportType}.
${dataPayload}
Pre-computed Metrics: CAR=${metrics.car_percentage.toFixed(2)}%, Liquidity=${metrics.liquidity_percentage.toFixed(2)}%, NPL=${metrics.npl_ratio.toFixed(2)}%, LDR=${metrics.loan_to_deposit_ratio.toFixed(2)}%`;

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

    if (aiData.status === 'ERROR') {
      const guidance = getReportSpecificGuidance(reportType, aiData.error_type || '');

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
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="color:#92400e;font-weight:bold;margin:0 0 8px;">Guidance for ${reportType}</p>
            <p style="color:#78350f;margin:0;">${guidance}</p>
          </div>
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

    const aiSummary = aiData.validation_summary || {};
    const validationSummary = {
      ...aiSummary,
      car_percentage: metrics.car_percentage || Number(aiSummary.car_percentage || 0),
      liquidity_percentage: metrics.liquidity_percentage || Number(aiSummary.liquidity_percentage || 0),
      npl_ratio: metrics.npl_ratio || Number(aiSummary.npl_ratio || 0),
      loan_to_deposit_ratio: metrics.loan_to_deposit_ratio || Number(aiSummary.loan_to_deposit_ratio || 0),
    };

    const meta: Meta = {
      institution_name: institutionNameParsed,
      cbn_license_number: licenseNumberParsed,
      cbn_license_category: licenseCategoryParsed,
      compliance_lead_name,
      reporting_period_start,
      reporting_period_end,
      rc_number: rcNumberParsed,
      address: addressParsed,
      state_of_operation: stateFieldParsed,
      reporting_period: reportingPeriodParsed,
    };

    const reportText = buildReportText(reportType, financialData, validationSummary, meta);

    const safeType = reportType.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${institution_name.replace(/\s+/g, '_')}_${safeType}_${reporting_period_end}.txt`;
    const storagePath = `${user_id}/${report_id}/${filename}`;

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

    const updateError = await patchReport(report_id, {
      status: 'ready',
      report_url: storagePath,
      report_filename: filename,
      car_percentage: validationSummary.car_percentage,
      liquidity_percentage: validationSummary.liquidity_percentage,
      npl_ratio: validationSummary.npl_ratio,
      validation_passed: true,
      generated_at: new Date().toISOString(),
      error_message: null,
    }, serviceRoleKey);

    if (updateError) {
      console.error('Failed to update report status:', updateError);
      throw new Error('Report generated but status update failed: ' + updateError);
    }

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
