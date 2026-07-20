import { PageShell, PageHero, SectionHeading, Para, FeatureRow, MAX, NARROW, T, DarkPill } from "./_shared";

const STORIES = [
  { title: "Regional microfinance banks", body: "Tier-2 and Tier-3 MFPs adopt RegCo to meet CBN monitoring expectations without building an in-house compliance engineering team." },
  { title: "Commercial and merchant banks", body: "Larger institutions use RegCo to unify fraud, screening, and reporting under one operating picture shared across risk, compliance, and audit." },
  { title: "Fintechs and payment firms", body: "Licensed operators plug RegCo into existing rails to satisfy NFIU and CBN obligations from day one of live transaction volume." },
];

const STATS = [
  { n: "8", l: "Regulators mapped (CBN, NFIU, NDIC, FIRS, SEC, NDPC, CAC, ICPC)" },
  { n: "1", l: "Operating system for fraud, identity, governance, and reporting" },
  { n: "100%", l: "Of returns validated before submission" },
];

export default function CustomersPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Company"
        title="Built for institutions regulators already know."
        sub="From microfinance banks to licensed fintechs, compliance teams use RegCo to stay continuously prepared for the regulators that oversee Nigerian financial services."
      />
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
          {STATS.map((s) => (
            <div key={s.l} style={{ borderRadius: 4, boxShadow: `inset 0 0 0 1px ${T.ink14}`, padding: 24 }}>
              <div style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.n}</div>
              <Para style={{ fontSize: 14, marginTop: 8 }}>{s.l}</Para>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="Who we serve" title="One platform across the regulated landscape." />
        <div style={{ marginTop: 8 }}>
          {STORIES.map((s, i) => <FeatureRow key={s.title} title={s.title} body={s.body} bar={[T.red, "#1F6FEB", "#0F8A5F"][i]} />)}
        </div>
      </div>
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <DarkPill to="/book-demo">Book a demo</DarkPill>
          <DarkPill to="/who-we-serve">See who we serve</DarkPill>
        </div>
      </div>
    </PageShell>
  );
}
