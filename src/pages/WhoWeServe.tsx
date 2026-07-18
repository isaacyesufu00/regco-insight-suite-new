import { Nav, ScrollRuler, CreamCTA, EditorialFooter, useRulerActive, C, HELV, Col, H1, H1Washed, H2, Lede, Body, Mono } from "@/components/editorial/EditorialTheme";

const ROWS = [
  { n: "01", title: "Tier-1 banks",
    body: "Tier-1 banks anchor the supervised reporting load. The platform consolidates branch ledgers, prudential schedules, and group filings into one examiner-ready workflow across the regulated holding structure." },
  { n: "02", title: "Microfinance banks",
    body: "Microfinance banks face the same calendar with smaller teams. The platform automates statutory returns, screening reviews, and supervisory submissions so a lean compliance function can stay current across every monthly cycle." },
  { n: "03", title: "Fintechs and PSPs",
    body: "Fintechs and payment providers carry high-volume transaction streams. The platform monitors flows, scores customer risk, and renders the prescribed returns so operators can stay supervised as they scale." },
  { n: "04", title: "Holdcos and groups",
    body: "Holding companies consolidate filings across subsidiaries. The platform aggregates subsidiary submissions, surfaces group-level readiness gaps, and preserves the evidence chain examiners expect across the regulated entity set." },
];

export default function WhoWeServe() {
  const active = useRulerActive(3);
  return (
    <div className="regco-page" style={{ background: C.page, color: C.ink, minHeight: "100vh", fontFamily: HELV }}>
      <Nav />
      <ScrollRuler active={active} total={3} />

      <section data-ruler-id="0" style={{ paddingTop: 200, paddingBottom: 140 }}>
        <div style={Col}>
          <div style={{ ...Mono, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 32 }}>
            audience · v1.0
          </div>
          <h1 style={H1}>
            A platform built for regulated financial institutions.
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
          <h2 style={H1Washed}>2. Institutions We Serve</h2>
          <p style={{ ...Body, marginTop: 32 }}>
            Tier-1 banks carry the highest overall supervised reporting load, but the spread across institution types is narrow, suggesting that the platform remains exacting across the regulated set.
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
          <h2 style={H1}>See how the platform fits your institution.</h2>
          <p style={{ ...Body, marginTop: 40 }}>
            Book a working session with the team to walk through your filing calendar, ledger sources, and supervisory obligations. We will map the modules to your institution type and outline what a paced rollout looks like for your team.
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
