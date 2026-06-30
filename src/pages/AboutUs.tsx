import { Nav, ScrollRuler, CreamCTA, EditorialFooter, useRulerActive, C, HELV, Col, H1, H1Washed, H2, Lede, Body, Mono } from "@/components/editorial/EditorialTheme";

const ROWS = [
  { n: "01", title: "Examiner first",
    body: "Every workflow starts from the examiner's frame. We design returns, reviews, and evidence packs that map directly to supervisory expectations rather than internal convenience or product preference." },
  { n: "02", title: "Defensible by default",
    body: "Every decision leaves an audit trail. Reviewer notes, source data, model outputs, and approval chains are captured automatically so the institution can reconstruct any filing under examiner scrutiny." },
  { n: "03", title: "Built for regulated teams",
    body: "Every module respects the institution's controls. Roles, segregation of duties, and four-eye approvals are first-class primitives so compliance, risk, and finance teams stay inside their own lanes." },
];

export default function AboutUs() {
  const active = useRulerActive(3);
  return (
    <div style={{ background: C.page, color: C.ink, minHeight: "100vh", fontFamily: HELV }}>
      <Nav />
      <ScrollRuler active={active} total={3} />

      <section data-ruler-id="0" style={{ paddingTop: 200, paddingBottom: 140 }}>
        <div style={Col}>
          <div style={{ ...Mono, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 32 }}>
            about · v1.0
          </div>
          <h1 style={H1}>
            A team building audit-grade compliance infrastructure.
          </h1>
          <p style={{ ...Lede, marginTop: 32, maxWidth: 640 }}>
            We build the rails regulated institutions need to file returns, period by period. The team brings supervisory, engineering, and risk experience together against senior examiner baselines.
          </p>
          <div style={{ marginTop: 40 }}>
            <CreamCTA to="/book-demo">Book a demo</CreamCTA>
          </div>
        </div>
      </section>

      <section data-ruler-id="1" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div style={Col}>
          <h2 style={H1Washed}>2. Operating Principles</h2>
          <p style={{ ...Body, marginTop: 32 }}>
            Examiner-first work has the highest overall material weight, but the spread across our principles is narrow, suggesting that the team holds every commitment across the supervised reporting set.
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
          <h2 style={H1}>Work with the team building examiner-grade rails.</h2>
          <p style={{ ...Body, marginTop: 40 }}>
            Book a working session to meet the people behind the platform. We will walk through how we think about supervised reporting, the principles guiding the roadmap, and what a paced engagement looks like for your institution.
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
