import { Nav, ScrollRuler, CreamCTA, EditorialFooter, useRulerActive, C, HELV, Col, H1, H1Washed, H2, Lede, Body, Mono } from "@/components/editorial/EditorialTheme";

const ROWS = [
  { n: "01", title: "Returns Engine",
    body: "Returns Engine drafts every supervised filing. The module assembles examiner-ready schedules from ledger feeds, surfaces readiness gaps, and renders submission packets across the regulated set." },
  { n: "02", title: "Screening Core",
    body: "Screening Core grades every customer and counterparty. The module checks identity records against sanction, PEP, and adverse media feeds, flags borderline matches for review, and preserves a defensible decision trail." },
  { n: "03", title: "Monitoring Hub",
    body: "Monitoring Hub watches every transaction stream. The module scores activity against tuned scenarios, escalates anomalies into supervised case queues, and tracks remediation across the institution." },
  { n: "04", title: "Audit Vault",
    body: "Audit Vault preserves every supervisory artifact. The module captures filing snapshots, reviewer notes, and approval chains into immutable evidence packs that examiners can reconstruct on demand." },
];

export default function Product() {
  const active = useRulerActive(3);
  return (
    <div style={{ background: C.page, color: C.ink, minHeight: "100vh", fontFamily: HELV }}>
      <Nav />
      <ScrollRuler active={active} total={3} />

      <section data-ruler-id="0" style={{ paddingTop: 200, paddingBottom: 140 }}>
        <div style={Col}>
          <div style={{ ...Mono, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 32 }}>
            product · v1.0
          </div>
          <h1 style={H1}>
            A platform for audit-grade regulatory compliance.
          </h1>
          <p style={{ ...Lede, marginTop: 32, maxWidth: 640 }}>
            We measure how regulated institutions file real returns, period by period. The platform grades filing prioritization, drafting precision, and adaptive position management against senior examiner baselines.
          </p>
          <div style={{ marginTop: 40 }}>
            <CreamCTA to="/book-demo">Book a demo</CreamCTA>
          </div>
        </div>
      </section>

      <section data-ruler-id="1" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div style={Col}>
          <h2 style={H1Washed}>2. Summary of Capabilities</h2>
          <p style={{ ...Body, marginTop: 32 }}>
            Returns Engine has the highest overall period-weighted readiness score, but the spread across modules is narrow, suggesting that the platform remains exacting across the supervised reporting set.
          </p>

          <div style={{ marginTop: 56 }}>
            {ROWS.map((f, i) => (
              <div key={f.n} style={{
                display: "grid", gridTemplateColumns: "48px 200px 1fr", gap: 24,
                padding: "32px 0",
                borderTop: `1px solid ${C.rule}`,
                borderBottom: i === ROWS.length - 1 ? `1px solid ${C.rule}` : undefined,
              }}>
                <div style={{ ...Mono, fontSize: 14 }}>{f.n}</div>
                <div style={{ ...Body, color: C.ink, fontWeight: 700, fontSize: 16 }}>{f.title}</div>
                <div style={Body}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-ruler-id="2" style={{ paddingTop: 128, paddingBottom: 128 }}>
        <div style={Col}>
          <h2 style={H1}>Bring every return into one supervised system.</h2>
          <p style={{ ...Body, marginTop: 40 }}>
            Book a working session with the team to walk through your filing calendar, ledger sources, and supervisory obligations. We will map the modules to your obligations and outline what a paced rollout looks like for your institution.
          </p>
          <div style={{ marginTop: 40 }}>
            <CreamCTA to="/book-demo">Book a demo</CreamCTA>
          </div>
          <p style={{ ...Body, fontSize: 14, color: C.ink3, marginTop: 24 }}>
            Questions? <a href="mailto:hello@regco.ai" style={{ color: C.ink, textDecoration: "underline", textUnderlineOffset: 4 }}>hello@regco.ai</a>
          </p>
        </div>
      </section>

      <EditorialFooter />
    </div>
  );
}
