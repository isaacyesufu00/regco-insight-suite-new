import { PageShell, PageHero, Para, ProseSection, DataRow, NARROW, T } from "./_shared";

const bodies: Record<string, { lead: string; rows: [string, string, string, string][] }> = {
  cbn: {
    lead: "Every CBN-licensed institution files between six and ten mandatory returns each year, covering financial position, capital adequacy, foreign exchange, and governance.",
    rows: [
      ["MFB Regulatory Return", "Monthly", "Balance sheet, deposits, loans, CAR", "₦2,000,000"],
      ["Monetary Policy Return", "Monthly", "Interest rates, monetary aggregates", "₦2,000,000"],
      ["Prudential Return", "Monthly", "Risk assets, NPL ratio, provisions", "₦2,000,000"],
      ["CBN Forex Return", "Weekly / Monthly", "FX transactions, positions", "₦2,000,000"],
      ["Board Governance Return", "Bi-annual", "Directors, ownership structure", "₦2,000,000"],
      ["Consumer Protection Return", "Quarterly", "Complaints received and resolved", "₦2,000,000"],
    ],
  },
  nfiu: {
    lead: "All financial institutions file AML/CFT compliance returns to the NFIU and report suspicious transactions in real time.",
    rows: [
      ["AML/CFT Compliance Report", "Quarterly", "STRs, CTRs, training", "₦2,500,000"],
      ["International Transfers Report", "Quarterly", "Cross-border wires by corridor", "₦2,000,000"],
      ["NFIU Regulatory Return", "Quarterly", "Risk assessments, controls", "₦2,000,000"],
    ],
  },
  scuml: {
    lead: "Designated non-financial businesses and financial institutions providing certain services register with SCUML and file annual compliance reports.",
    rows: [
      ["SCUML Annual Compliance", "Annual", "AML programme, KYC stats, training", "₦1,000,000"],
      ["SCUML Registration Renewal", "Annual", "Updated KYC and ownership", "Suspension of registration"],
    ],
  },
  ndic: {
    lead: "Every deposit-taking institution files premium returns and large exposure reports with the NDIC.",
    rows: [
      ["NDIC Premium Return", "Annual", "Insured deposits, premium computation", "₦2,000,000"],
      ["Single Obligor Report", "Quarterly", "Large exposures, capital base", "₦2,000,000"],
    ],
  },
  firs: {
    lead: "All registered taxpayers file monthly VAT, PAYE, and Withholding Tax returns, plus an annual Company Income Tax return.",
    rows: [
      ["VAT Return", "Monthly", "Output VAT, input VAT, net payable", "10% of tax + ₦50,000/mo"],
      ["PAYE Remittance", "Monthly", "Employee gross salary, PAYE deducted", "10% of tax + ₦50,000/mo"],
      ["Withholding Tax Return", "Monthly", "WHT deducted at source, payees", "10% of tax + ₦50,000/mo"],
      ["Company Income Tax Return", "Annual", "Assessable profit, CIT, education tax", "10% of tax + ₦50,000/mo"],
    ],
  },
};

export default function ComplianceGuidesPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Resources"
        title="The Nigerian compliance calendar, in one place."
        sub="A practical reference for the returns Nigerian financial institutions file across regulators — what each one covers, how often, and what the common penalties look like."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <ProseSection id="cbn" heading="CBN — the Central Bank">
          <Para style={{ fontSize: 16 }}>{bodies.cbn.lead}</Para>
          <div style={{ marginTop: 8 }}>
            {bodies.cbn.rows.map((r) => <DataRow key={r[0]} label={`${r[0]} · ${r[1]} · ${r[2]}`} value={r[3]} />)}
          </div>
        </ProseSection>
        <ProseSection id="nfiu" heading="NFIU — Financial Intelligence Unit">
          <Para style={{ fontSize: 16 }}>{bodies.nfiu.lead}</Para>
          <div style={{ marginTop: 8 }}>
            {bodies.nfiu.rows.map((r) => <DataRow key={r[0]} label={`${r[0]} · ${r[1]} · ${r[2]}`} value={r[3]} />)}
          </div>
        </ProseSection>
        <ProseSection id="scuml" heading="SCUML — Anti-Money Laundering Control">
          <Para style={{ fontSize: 16 }}>{bodies.scuml.lead}</Para>
          <div style={{ marginTop: 8 }}>
            {bodies.scuml.rows.map((r) => <DataRow key={r[0]} label={`${r[0]} · ${r[1]} · ${r[2]}`} value={r[3]} />)}
          </div>
        </ProseSection>
        <ProseSection id="ndic" heading="NDIC — Deposit Insurance">
          <Para style={{ fontSize: 16 }}>{bodies.ndic.lead}</Para>
          <div style={{ marginTop: 8 }}>
            {bodies.ndic.rows.map((r) => <DataRow key={r[0]} label={`${r[0]} · ${r[1]} · ${r[2]}`} value={r[3]} />)}
          </div>
        </ProseSection>
        <ProseSection id="firs" heading="FIRS — Federal Inland Revenue">
          <Para style={{ fontSize: 16 }}>{bodies.firs.lead}</Para>
          <div style={{ marginTop: 8 }}>
            {bodies.firs.rows.map((r) => <DataRow key={r[0]} label={`${r[0]} · ${r[1]} · ${r[2]}`} value={r[3]} />)}
          </div>
        </ProseSection>
        <ProseSection id="deadlines" heading="Filing deadlines and penalties">
          <Para style={{ fontSize: 16 }}>
            Most monthly CBN returns fall due within 10 working days of month-end; quarterly NFIU returns within 15. Late or inaccurate filing commonly attracts fines starting around ₦2,000,000 per return, with repeated failures escalating to licensing action. RegCo assembles each return from live data and validates it before sign-off so deadlines are met with evidence attached.
          </Para>
        </ProseSection>
      </div>
    </PageShell>
  );
}
