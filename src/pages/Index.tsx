import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

/* =========================================================
   CROSBY-INTELLIGENCE STYLE HOMEPAGE
   Pure dark editorial. Helvetica headers. Cream CTA pill.
   All charts/figures are inline HTML/CSS mocks — no libs.
   ========================================================= */

const HELV = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const C = {
  page:   "#0A0A0A",
  surface:"#141414",
  ink:    "#F2EDE4",
  ink2:   "#D8D2C6",
  ink3:   "#8A847A",
  rule:   "#2A2724",
  cream:  "#F2E9D8",
  creamHi:"#E6DCC4",
};

const SERIES = {
  gpt:    "#A8312B",
  fable:  "#B8924A",
  gemini: "#3F6E94",
  opus:   "#3F7A5E",
};

/* ---------- color ramp for heatmap ---------- */
const RAMP = ["#1B1430","#4B1A5C","#8A2A6E","#C73E5E","#E86A3E","#F2C57A"];
function ramp(v: number) {
  if (v <= 0) return RAMP[0];
  if (v >= 1) return RAMP[RAMP.length - 1];
  const t = v * (RAMP.length - 1);
  const i = Math.floor(t);
  const f = t - i;
  const a = hex(RAMP[i]); const b = hex(RAMP[i + 1]);
  const r = Math.round(a.r + (b.r - a.r) * f);
  const g = Math.round(a.g + (b.g - a.g) * f);
  const bl= Math.round(a.b + (b.b - a.b) * f);
  return `rgb(${r},${g},${bl})`;
}
function hex(h: string) {
  const n = h.replace("#","");
  return { r: parseInt(n.slice(0,2),16), g: parseInt(n.slice(2,4),16), b: parseInt(n.slice(4,6),16) };
}

/* ---------- top nav ---------- */
function Nav() {
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 72, zIndex: 50,
      background: C.page,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px 0 24px",
      fontFamily: HELV,
    }}>
      <Link to="/" style={{ textDecoration: "none", color: C.ink, lineHeight: 1.05, letterSpacing: "0.04em", fontWeight: 700, fontSize: 15 }}>
        <div>REGCO</div>
        <div>COMPLIANCE</div>
      </Link>
      <nav style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {[
          ["Home","/"],
          ["Product","/product"],
          ["About us","/about-us"],
          ["Who we serve","/who-we-serve"],
          ["Log in","/login"],
        ].map(([l,to]) => (
          <Link key={l} to={to as string} style={navLink}>{l}</Link>
        ))}
      </nav>
    </header>
  );
}
const navLink: React.CSSProperties = {
  fontFamily: HELV, fontSize: 15, color: C.ink, textDecoration: "none",
};


/* ---------- left scroll ruler ---------- */
function ScrollRuler({ active, total }: { active: number; total: number }) {
  return (
    <div style={{
      position: "fixed", left: 56, top: "50%", transform: "translateY(-50%)",
      display: "flex", flexDirection: "column", gap: 8, zIndex: 40,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 1,
          width: i === active ? 24 : 16,
          background: C.ink3,
          opacity: i === active ? 1 : 0.35,
          transition: "width 150ms ease, opacity 150ms ease",
        }} />
      ))}
    </div>
  );
}

/* ---------- cream CTA pill ---------- */
function CreamCTA({ children, href = "#", to }: { children: React.ReactNode; href?: string; to?: string }) {
  const [hover, setHover] = useState(false);
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: hover ? C.creamHi : C.cream, color: "#0A0A0A",
    borderRadius: 9999, padding: "14px 24px",
    fontFamily: HELV, fontSize: 15, fontWeight: 500,
    textDecoration: "none", transition: "background 150ms ease",
  };
  const inner = (<>{children} <ArrowRight size={16} strokeWidth={1.75} /></>);
  if (to) return <Link to={to} style={style} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>{inner}</Link>;
  return <a href={href} style={style} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>{inner}</a>;
}

/* ---------- shared text styles ---------- */
const H1: React.CSSProperties = {
  fontFamily: HELV, fontWeight: 700, fontSize: 56, lineHeight: 1.05,
  letterSpacing: "-0.025em", color: C.ink, margin: 0,
};
const H1Washed: React.CSSProperties = { ...H1, color: "#6F6A62", fontSize: 44 };
const H2: React.CSSProperties = {
  fontFamily: HELV, fontWeight: 700, fontSize: 28, lineHeight: 1.15,
  letterSpacing: "-0.02em", color: C.ink, margin: 0,
};
const Lede: React.CSSProperties = {
  fontFamily: HELV, fontWeight: 400, fontSize: 19, lineHeight: 1.55,
  color: C.ink, margin: 0,
};
const Body: React.CSSProperties = {
  fontFamily: HELV, fontWeight: 400, fontSize: 17, lineHeight: 1.6,
  color: C.ink2, margin: 0,
};
const Mono: React.CSSProperties = {
  fontFamily: MONO, fontWeight: 400, fontSize: 13, color: C.ink3,
};

/* ---------- column wrapper ---------- */
const Col: React.CSSProperties = { maxWidth: 760, margin: "0 auto", padding: "0 24px" };

/* =========================================================
   FIGURE 1 — Cluster intensity heatmap
   ========================================================= */
type Cell = { row: string; values: (number | null)[] };
const SCEN_1: Cell[] = [
  { row:"ExC",  values:[0.18,0.02,0.27,0.06] },
  { row:"ExA.2",values:[0.26,0.08,0.07,null] },
  { row:"3.3.5",values:[0.10,0.21,0.02,0.05] },
  { row:"1.3",  values:[0.20,0.15,0.04,0.04] },
  { row:"1.4",  values:[0.20,0.02,null,0.01] },
  { row:"10",   values:[0.20,0.03,null,0.03] },
  { row:"1",    values:[0.20,0.03,0.03,0.06] },
  { row:"3.2",  values:[0.20,0.02,0.04,0.02] },
  { row:"14.1", values:[0.20,0.09,0.02,0.06] },
  { row:"ExA.5",values:[0.20,0.02,0.07,0.05] },
  { row:"1.15", values:[0.20,0.06,0.03,0.05] },
  { row:"2",    values:[0.20,null,0.05,null] },
  { row:"5.1",  values:[0.18,null,0.03,null] },
  { row:"4",    values:[0.18,null,null,0.03] },
  { row:"7.1",  values:[0.10,0.15,0.05,0.05] },
];
const SCEN_2: Cell[] = [
  { row:"6.1", values:[0.63,0.24,0.02,null] },
  { row:"2.9", values:[0.47,0.07,0.04,0.04] },
  { row:"2.3", values:[0.45,0.02,0.06,0.02] },
  { row:"7.1", values:[0.42,0.05,0.16,0.03] },
  { row:"9.2", values:[0.42,0.15,0.15,0.07] },
  { row:"6.3", values:[0.40,0.23,0.03,0.04] },
  { row:"8.1", values:[0.40,0.09,0.10,0.11] },
  { row:"10.2",values:[0.33,0.23,0.03,0.08] },
  { row:"11.8",values:[0.33,0.08,0.03,0.06] },
  { row:"2.13",values:[0.27,0.13,0.06,0.06] },
  { row:"10.1",values:[0.25,0.07,0.16,0.07] },
  { row:"2.6", values:[0.25,0.03,0.06,0.04] },
  { row:"ExA", values:[0.25,0.08,0.05,0.04] },
  { row:"2.10",values:[0.25,0.05,null,null] },
  { row:"2.11",values:[0.25,0.07,null,null] },
];
const SCEN_3: Cell[] = [
  { row:"15.12",values:[0.60,0.06,0.21,0.13] },
  { row:"7.5",  values:[0.20,0.26,0.11,0.11] },
  { row:"13.1", values:[0.16,0.06,0.04,0.21] },
  { row:"5.1",  values:[0.20,0.03,0.07,0.07] },
  { row:"5.10", values:[0.20,null,null,null] },
  { row:"7.8",  values:[0.20,null,0.07,null] },
  { row:"10.2", values:[0.20,null,0.06,0.02] },
  { row:"12.2", values:[0.20,0.07,null,0.07] },
  { row:"7.3",  values:[0.18,0.13,0.10,0.05] },
  { row:"3.1",  values:[0.18,0.05,0.04,null] },
  { row:"4.1",  values:[0.18,0.07,0.02,null] },
  { row:"15",   values:[0.18,null,null,null] },
  { row:"4.5",  values:[0.18,0.02,0.06,0.05] },
  { row:"9.10", values:[0.16,0.17,0.10,null] },
  { row:"12.1", values:[0.16,0.15,0.08,0.05] },
];

function HeatmapScenario({ title, data }: { title: string; data: Cell[] }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ ...Mono, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "44px repeat(4, 1fr)", rowGap: 4, columnGap: 4 }}>
        <div />
        {["S1","S2","S3","S4"].map(t => (
          <div key={t} style={{ ...Mono, textAlign: "center", paddingBottom: 4 }}>{t}</div>
        ))}
        {data.flatMap(r => [
          <div key={r.row+"-l"} style={{ ...Mono, textAlign: "right", paddingRight: 8, alignSelf: "center" }}>{r.row}</div>,
          ...r.values.map((v, i) => (
            <div key={r.row+"-"+i} style={{
              height: 22, borderRadius: 3,
              background: v == null ? "transparent" : ramp(v),
              color: v == null ? "transparent" : (v > 0.5 ? "#0A0A0A" : C.ink),
              fontFamily: MONO, fontSize: 10, textAlign: "center", lineHeight: "22px",
            }}>{v == null ? "" : v.toFixed(2)}</div>
          )),
        ])}
      </div>
    </div>
  );
}

function Figure1() {
  return (
    <div>
      <div style={{
        background: C.surface, border: `1px solid ${C.rule}`, borderRadius: 4,
        padding: 32,
      }}>
        <div style={{ display: "flex", gap: 32 }}>
          <HeatmapScenario title="TYPE 1 → STRUCTURING" data={SCEN_1} />
          <HeatmapScenario title="TYPE 2 → SHELL ACCOUNTS" data={SCEN_2} />
          <HeatmapScenario title="TYPE 3 → SYNTHETIC IDENTITY" data={SCEN_3} />
        </div>
        {/* gradient legend */}
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={Mono}>0</span>
          <div style={{
            flex: 1, height: 6, borderRadius: 3,
            background: `linear-gradient(90deg, ${RAMP.join(",")})`,
          }} />
          <span style={Mono}>1.0 intensity</span>
          <span style={{
            width: 14, height: 14, background: "#F2C57A", borderRadius: 2,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <Check size={10} color="#0A0A0A" strokeWidth={3} />
          </span>
          <span style={Mono}>Scores</span>
        </div>
      </div>
      <p style={{ ...Mono, marginTop: 16 }}>
        <span style={{ letterSpacing: "0.08em" }}>FIG.&nbsp;&nbsp;1</span>{" "}
        Each cell shows detection activity intensity across case type and review stage. Higher = more concentrated review at that point in the workflow.
      </p>
      <p style={{ ...Mono, marginTop: 8, fontSize: 11 }}>
        Data is illustrative. Pattern structure based on documented AML typologies.
      </p>
    </div>
  );
}

/* =========================================================
   FIGURE 3 — Ranked bar list (Overall score)
   ========================================================= */
const OVERALL = [
  { name: "RegCo",                  desc: "Automated + AI-assisted review", color: SERIES.gpt },
  { name: "Rule-Based Detection",   desc: "Threshold rules only",           color: SERIES.fable },
  { name: "Machine Learning Only",  desc: "Anomaly models only",            color: SERIES.gemini },
  { name: "Manual Review",          desc: "Officer review, no automation",  color: SERIES.opus },
];


function RankedBars() {
  return (
    <div>
      <div style={{
        background: C.surface, border: `1px solid ${C.rule}`, borderRadius: 4,
        padding: 32, display: "flex", flexDirection: "column", gap: 18,
      }}>
        {OVERALL.map((r, i) => (
          <div key={r.name} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 16, alignItems: "center" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9999, border: `1px solid ${C.rule}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: MONO, fontSize: 13, color: C.ink3,
            }}>{i+1}</div>
            <div style={{ height: 44, position: "relative" }}>
              <div style={{
                height: "100%", width: "100%",
                background: r.color, borderRadius: 4,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 20px",
                fontFamily: HELV, fontSize: 14, color: C.ink,
              }}>
                <span style={{ fontWeight: 500 }}>{r.name}</span>
                <span style={{ fontWeight: 400, opacity: 0.85, fontSize: 13 }}>{r.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ ...Mono, marginTop: 16 }}>
        <span style={{ letterSpacing: "0.08em" }}>FIG.&nbsp;&nbsp;2</span>{" "}
        Four detection approaches compared by method coverage. RegCo combines rule enforcement, pattern detection, and AI-assisted review.
      </p>
      <p style={{ ...Mono, marginTop: 8, fontSize: 11 }}>
        Comparison is based on internal methodology assessment, not independent study.
      </p>
    </div>
  );
}

/* =========================================================
   FIGURE 6 — Grouped bars (Dimension pass rates)
   ========================================================= */
const DIMS: { label: string; values: [number, number, number, number] }[] = [
  { label: "Detection",       values: [49.0, 44.9, 45.2, 44.2] },
  { label: "Documentation",   values: [49.9, 47.0, 51.5, 44.7] },
  { label: "Audit Trail",     values: [50.9, 45.2, 45.0, 41.2] },
  { label: "Filing",          values: [51.0, 48.3, 57.1, 45.4] },
  { label: "Case Resolution", values: [84.4, 83.2, 82.5, 86.2] },
];

function GroupedBars() {
  const CHART_H = 320;
  const seriesColors = [SERIES.gpt, SERIES.fable, SERIES.gemini, SERIES.opus];
  return (
    <div>
      <div style={{
        background: C.surface, border: `1px solid ${C.rule}`, borderRadius: 4,
        padding: 32,
      }}>
        {/* legend */}
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 24 }}>
          {["RegCo","Rule-Based Detection","Machine Learning Only","Manual Review"].map((n,i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 9999, background: seriesColors[i] }} />
              <span style={{ ...Body, fontSize: 13, color: C.ink }}>{n}</span>
            </div>
          ))}
        </div>
        {/* plot */}
        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 12 }}>
          <div style={{ height: CHART_H, position: "relative" }}>
            {[100,80,60,40,20,0].map((y, idx) => (
              <div key={y} style={{
                position: "absolute", right: 0, top: `${(idx / 5) * 100}%`,
                transform: "translateY(-50%)", ...Mono, fontSize: 11,
              }}>{y}%</div>
            ))}
          </div>
          <div style={{ height: CHART_H, position: "relative", borderLeft: `1px solid ${C.rule}` }}>
            {/* gridlines */}
            {[0,1,2,3,4,5].map(i => (
              <div key={i} style={{
                position: "absolute", left: 0, right: 0,
                top: `${(i / 5) * 100}%`, height: 1, background: C.rule,
              }} />
            ))}
            {/* groups */}
            <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: `repeat(${DIMS.length}, 1fr)` }}>
              {DIMS.map((g, gi) => (
                <div key={g.label} style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, padding: "0 12px" }}>
                  {g.values.map((v, vi) => (
                    <div key={vi} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                      <span style={{ ...Mono, fontSize: 11, color: C.ink, marginBottom: 4 }}>{v.toFixed(1)}</span>
                      <div style={{ width: "100%", height: `${v}%`, background: seriesColors[vi] }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* x labels */}
        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 12, marginTop: 12 }}>
          <div />
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${DIMS.length}, 1fr)` }}>
            {DIMS.map(g => (
              <div key={g.label} style={{ ...Body, fontSize: 14, color: C.ink, textAlign: "center" }}>{g.label}</div>
            ))}
          </div>
        </div>
      </div>
      <p style={{ ...Mono, marginTop: 16 }}>
        <span style={{ letterSpacing: "0.08em" }}>FIG.&nbsp;&nbsp;6</span>{" "}
        Weighted accuracy for each part of the compliance workflow, pooled across every test case.
      </p>
    </div>
  );
}

/* =========================================================
   Findings list
   ========================================================= */
const FINDINGS = [
  { n: "01", title: "Filing Engine",
    body: "Filing prioritization is a shared gap across most institutions. Teams struggle to know which returns examiners treat as most material, especially when filing across multiple regulators in the same period. RegCo generates returns automatically and flags the ones that need human sign-off before the deadline hits." },
  { n: "02", title: "Over-reporting",
    body: "Institutions that review manually tend to flag too much. Every marginal transaction gets escalated because the cost of missing something feels higher than the cost of wasting an officer's time. RegCo filters activity by risk weight, so the alerts that reach your team are the ones that actually warrant a decision." },
  { n: "03", title: "Precision",
    body: "RegCo's Screening Core is built to match the way a senior examiner reads a case, not the way a rule engine reads a number. Among the modules, Screening comes closest to examination-level review behavior, with fewer blanket holds and faster clearance times on low-risk accounts." },
  { n: "04", title: "The gap",
    body: "No automated system fully replaces a trained compliance officer, and RegCo does not claim otherwise. The gap that remains is real: complex cases, unusual counterparty structures, and edge-case transaction patterns still need human judgment. What RegCo eliminates is the paperwork that was consuming that judgment before it got to the cases that actually needed it." },
];


/* =========================================================
   PAGE
   ========================================================= */
export default function Index() {
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [active, setActive] = useState(0);
  const SECTION_COUNT = 10;

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-ruler-id]"));
    sectionsRef.current = sections;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = Number((e.target as HTMLElement).dataset.rulerId);
          setActive(id);
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: C.page, color: C.ink, minHeight: "100vh", fontFamily: HELV }}>
      <Nav />
      <ScrollRuler active={active} total={SECTION_COUNT} />

      {/* HERO */}
      <section data-ruler-id="0" style={{ paddingTop: 200, paddingBottom: 140 }}>
        <div style={Col}>
          <div style={{ ...Mono, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 32 }}>
            ledger · v1.0
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

      {/* SUMMARY OF FINDINGS */}
      <section id="findings" data-ruler-id="1" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div style={Col}>
          <h2 style={H1Washed}>2. Summary of Capabilities</h2>
          <p style={{ ...Body, marginTop: 32 }}>
            RegCo gives compliance teams the strongest overall readiness score, and it stays accurate across every part of the platform, from filing to screening to case review.
          </p>

          <div style={{ marginTop: 56 }}>
            {FINDINGS.map((f, i) => (
              <div key={f.n} style={{
                display: "grid", gridTemplateColumns: "48px 200px 1fr", gap: 24,
                padding: "32px 0",
                borderTop: `1px solid ${C.rule}`,
                borderBottom: i === FINDINGS.length - 1 ? `1px solid ${C.rule}` : undefined,
              }}>
                <div style={{ ...Mono, fontSize: 14 }}>{f.n}</div>
                <div style={{ ...Body, color: C.ink, fontWeight: 700, fontSize: 16 }}>{f.title}</div>
                <div style={Body}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIGURE 1 — wider column for the chart */}
      <section data-ruler-id="2" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ ...Col, padding: 0, marginBottom: 56 }}>
            <p style={Body}>
              spot the details that matter in a live case. RegCo is built around that complexity, so the platform shows whether its outputs actually help your team get work done, not just whether it can catch obvious problems.
            </p>
          </div>
          <Figure1 />
        </div>
      </section>

      {/* TURN-LEVEL FINDINGS */}
      <section data-ruler-id="3" style={{ paddingTop: 96, paddingBottom: 32 }}>
        <div style={Col}>
          <h2 style={H1Washed}>6. Stage-level Findings</h2>
          <h3 style={{ ...H2, marginTop: 56 }}>6.1 Overall score</h3>
          <p style={{ ...Body, marginTop: 24 }}>
            RegCo scores 50.5% overall across every case type and review stage, ahead of rule-only detection at 47.3%, machine-learning-only detection at 45.1%, and fully manual review at 44.4%. The gap between methods is small, which shows this kind of work is genuinely hard no matter how it's automated — but RegCo still comes out ahead, and the result holds steady across every case type tested.
          </p>
        </div>
      </section>

      {/* RANKED BARS */}
      <section data-ruler-id="4" style={{ paddingTop: 32, paddingBottom: 96 }}>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>
          <RankedBars />
        </div>
      </section>

      {/* 6.2 SCORE BY SIDE */}
      <section data-ruler-id="5" style={{ paddingTop: 96, paddingBottom: 32 }}>
        <div style={Col}>
          <h3 style={H2}>6.2 Score by side</h3>
          <p style={{ ...Body, marginTop: 24 }}>
            Every method, including RegCo, still struggles with escalation decisions that need
          </p>
        </div>
      </section>

      {/* 6.3 SCORE BY STAGE */}
      <section data-ruler-id="6" style={{ paddingTop: 96, paddingBottom: 32 }}>
        <div style={Col}>
          <h3 style={H2}>6.3 Score by stage</h3>
          <p style={{ ...Body, marginTop: 24, fontStyle: "italic", color: C.ink3 }}>
            Every method struggles most at the very first step: intake.
          </p>
          <p style={{ ...Body, marginTop: 24 }}>
            The stage-by-stage chart shows Intake is the hardest step for every method: RegCo scores 30.3%, rule-based detection scores 22.6%, machine-learning-only scores 21.9%, and manual review scores 17.9%. This lines up with what examiners told us — Intake is the stage where experienced reviewers agree most strongly on what matters, which is exactly where automated systems struggle most. Scores climb fast in later stages, mostly settling between 50% and 60% once a case has more history attached to it. In short: every method gets better once a case is already underway. The hard part is spotting and prioritizing the right case before any history exists.
          </p>
          <p style={{ ...Body, marginTop: 32, color: C.ink3, fontSize: 15 }}>
            default toward clearing transactions.
          </p>
        </div>
      </section>

      <section data-ruler-id="7" style={{ paddingTop: 32, paddingBottom: 96 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          <GroupedBars />
        </div>
      </section>

      {/* RESEARCH PROGRAM */}
      <section id="fellowship" data-ruler-id="9" style={{ paddingTop: 128, paddingBottom: 128 }}>
        <div style={Col}>
          <div style={{ ...Mono, marginBottom: 24 }}>
            <Link to="/" style={{ color: C.ink3, textDecoration: "none" }}>‹ RegCo Compliance</Link>
          </div>
          <h2 style={H1}>Introducing the RegCo<br />Compliance Research Program</h2>
          <p style={{ ...Body, marginTop: 40 }}>
            We're starting the RegCo Compliance Research Program to support new work on fraud detection and automated compliance. Two researchers will share <strong style={{ color: C.ink }}>$50,000 in funding</strong> and <strong style={{ color: C.ink }}>$25,000 in compute credits</strong> to pursue their own focused projects.
          </p>

          <h3 style={{ ...H2, marginTop: 64 }}>Why we're starting this program</h3>
          <p style={{ ...Body, marginTop: 24 }}>
            Every regulated transaction depends on trust being verified somewhere behind the scenes. Right now, that verification is still slow and costly.
          </p>
          <p style={{ ...Body, marginTop: 24 }}>
            AI has made the fastest progress in areas with a clear right answer: math, code, games like chess. Fraud detection isn't like that. There's rarely one obvious signal — information is incomplete, a lot of what matters is never written down, and the right response depends on what the other side is actually doing. It's closer to reading a room than solving an equation: good compliance officers notice the pattern, weigh what looks legitimate, and know when to escalate, when to clear, and when to hold firm without being certain. They anticipate how a bad actor adjusts, and adapt as the case develops.
          </p>

          <p style={{ ...Body, marginTop: 48 }}>
            If you're working on something related — fraud detection, regulatory technology, automated review — we want to see it. The strongest proposals make their progress measurable, explain clearly why simpler approaches fall short, and apply beyond just one product.
          </p>

          <h3 style={{ ...H2, marginTop: 48 }}>Who we're looking for</h3>
          <p style={{ ...Body, marginTop: 24 }}>
            Open to PhD students, postdocs, faculty, or independent researchers. You're likely a good fit if you have real experience in machine learning or anomaly detection, can run a research project on your own while taking feedback well, and want to work on problems where the data is messy and confidential. No compliance background needed.
          </p>

          <h3 style={{ ...H2, marginTop: 48 }}>How to apply</h3>
          <p style={{ ...Body, marginTop: 24 }}>
            Send your resume and a one-page proposal: what question you're asking, why current approaches fall short, your plan, and what you'll deliver.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 56 }}>
            <DatePanel label="Applications close" value="July 17, 2026" />
            <DatePanel label="Researchers announced" value="July 31, 2026" />
          </div>

          <div style={{ marginTop: 40 }}>
            <CreamCTA to="/book-demo">Apply here</CreamCTA>
          </div>

          <p style={{ ...Body, fontSize: 14, color: C.ink3, marginTop: 24 }}>
            Questions? <a href="mailto:research@regco.ng" style={{ color: C.ink, textDecoration: "underline", textUnderlineOffset: 4 }}>research@regco.ng</a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: `1px solid ${C.rule}`, padding: "48px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontFamily: HELV, fontWeight: 700, fontSize: 13, color: C.ink, letterSpacing: "0.04em", lineHeight: 1.05 }}>
          <div>REGCO</div><div>COMPLIANCE</div>
        </div>
        <div style={{ ...Mono, fontSize: 12 }}>© 2026 RegCo Compliance</div>
      </footer>

    </div>
  );
}

function DatePanel({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      border: `1px solid ${C.rule}`, borderRadius: 6, padding: "20px 24px",
      background: "transparent",
    }}>
      <div style={{ ...Body, fontSize: 14, color: C.ink3 }}>{label}</div>
      <div style={{ ...H2, fontSize: 24, marginTop: 8 }}>{value}</div>
    </div>
  );
}
