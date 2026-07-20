import { PageShell, PageHero, Para, ProseSection, NARROW, T } from "./_shared";

const sections: { id: string; heading: string; body: string }[] = [
  { id: "parties", heading: "1. Parties", body: "Data Controller: the institution subscribing to RegCo (the “Controller”). Data Processor: RegCo Technologies Limited (the “Processor”)." },
  { id: "subject", heading: "2. Subject Matter", body: "RegCo processes financial and institutional data provided by the Controller solely for the purpose of generating regulatory returns." },
  { id: "duration", heading: "3. Duration", body: "This agreement remains in effect for the duration of the RegCo subscription." },
  { id: "nature", heading: "4. Nature and Purpose of Processing", body: "RegCo processes institution financial data, employee payroll data (for PAYE returns), and transaction data (for AML analysis). Processing is automated. No RegCo employee accesses your raw financial data." },
  { id: "security", heading: "5. Security Measures", body: "RegCo implements AES-256 encryption at rest, TLS 1.3 in transit, Row Level Security in the database, access logging, and annual security reviews." },
  { id: "subprocessors", heading: "6. Sub-Processors", body: "RegCo uses managed infrastructure for database, hosting, transactional email, and AI inference. A full sub-processor list is available on request." },
  { id: "rights", heading: "7. Data Subject Rights", body: "RegCo will assist the Controller in responding to data subject rights requests within 72 hours." },
  { id: "breach", heading: "8. Breach Notification", body: "RegCo will notify the Controller of any personal data breach within 72 hours of becoming aware." },
  { id: "ndpc", heading: "9. NDPC Registration", body: "RegCo is registered with the NDPC as a Data Processor. Registration number is available on request." },
];

export default function DataProcessingPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Legal"
        title="Data Processing Agreement"
        sub="This agreement governs how RegCo processes personal data on behalf of your institution."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        {sections.map((s) => (
          <ProseSection key={s.id} id={s.id} heading={s.heading}>
            <Para style={{ fontSize: 16 }}>{s.body}</Para>
          </ProseSection>
        ))}
        <div style={{ color: T.ink66, fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, marginTop: 24 }}>
          Last updated in line with the Nigeria Data Protection Act (NDPA) 2023.
        </div>
      </div>
    </PageShell>
  );
}
