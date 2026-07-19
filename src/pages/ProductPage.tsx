import { Link } from "react-router-dom";

/* =========================================================
   REGCO — Product page
   Pixel-identical structural translation of the AfterQuery
   Paper "Leaderboards" export (app.paper.design, Jul 19 2026)
   into the RegCo light editorial design system.
   Banner + nav + footer mirror RegcoHome.tsx.
   Image assets are local placeholders (gradients).
   ========================================================= */

const T = {
  canvas: "#F8F8F3",
  ink: "#000000",
  inkCC: "#000000CC", // 80% — nav/body strong
  ink99: "#00000099", // 60% — secondary text
  ink8C: "#0000008C", // ~55% — labels
  ink73: "#00000073", // 45% — metric values
  ink66: "#00000066", // 40% — meta
  ink26: "#00000026", // 15% — dividers
  ink1A: "#0000001A", // 10% — axis divider
  ink0F: "#0000000F", // 6% — chip bg
  inkE6: "#000000E6", // 90% — ink-on-tint
  canvasTone: "#F8F8F3",
  barTrack: "#E9E7E0",
  barFill: "#A8A7A1",
};

const SANS = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const MAX = 1136;
const NARROW = 688;

/* ---------- atoms ---------- */
const LightChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    background: T.ink0F, borderRadius: 999, padding: "7px 12px",
    fontFamily: SANS, fontSize: 14, fontWeight: 500, color: T.inkCC, lineHeight: 1,
  }}>{children}</span>
);

const DarkPill: React.FC<{ children: React.ReactNode; href?: string }> = ({ children, href }) => {
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    height: 32, padding: "0 12px", borderRadius: 999,
    background: T.inkE6, color: T.canvasTone, fontFamily: SANS,
    fontSize: 14, fontWeight: 500, lineHeight: 1, textDecoration: "none",
    border: "none", cursor: "pointer",
  };
  return <a href={href} style={style}>{children}</a>;
};

/* ---------- banner ---------- */
function Banner() {
  return (
    <div style={{ background: T.ink, fontFamily: SANS }}>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingBlock: "10px", paddingInline: 24 }}>
        <div style={{
          color: "#FFFFFFE6", display: "flex", flexWrap: "wrap", justifyContent: "center",
          fontSize: 16, lineHeight: 1.5, textAlign: "center", textWrap: "pretty",
        }}>
          RegCo is currently in the design phase — building the AI operating system for compliance.
        </div>
      </div>
    </div>
  );
}

/* ---------- nav: Home, Product, Who we serve, About + Login / Book demo ---------- */
function Nav() {
  const links = [
    { l: "Home", to: "/" },
    { l: "Product", to: "/product" },
    { l: "Who we serve", to: "/who-we-serve" },
    { l: "About", to: "/about" },
  ];
  return (
    <div style={{ background: T.canvas, fontFamily: SANS, position: "sticky", top: 0, zIndex: 50 }}>
      <style>{`
        .regco-nav-link .regco-underline {
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .regco-nav-link:hover .regco-underline {
          transform: scaleX(1);
        }
      `}</style>
      <div style={{
        maxWidth: MAX, margin: "0 auto", height: 70, paddingInline: 32,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <span style={{ color: T.ink, fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>RegCo</span>
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {links.map((x) => (
            <Link key={x.l} to={x.to} className="regco-nav-link" style={{ position: "relative", color: T.inkCC, fontSize: 14, fontWeight: 500, textDecoration: "none", lineHeight: 1.43 }}>
              <span style={{ display: "block", textAlign: "center" }}>{x.l}</span>
              <span className="regco-underline" style={{ position: "absolute", bottom: -2, left: 0, height: 1, width: "100%", background: T.inkE6 }} />
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LightChip><Link to="/sign-in" style={{ color: T.inkCC, textDecoration: "none" }}>Login</Link></LightChip>
          <DarkPill><Link to="/book-demo" style={{ color: T.canvasTone, textDecoration: "none" }}>Book a demo</Link></DarkPill>
        </div>
      </div>
    </div>
  );
}

/* ---------- bar with optional CI whisker ---------- */
function Bar({ widthPct, ci }: { widthPct: string; ci?: { left: string } }) {
  return (
    <div style={{ background: T.barTrack, height: 18, position: "relative", width: "100%", overflow: "clip" }}>
      <div style={{ background: T.barFill, position: "absolute", insetBlock: 0, left: 0, width: widthPct } as React.CSSProperties} />
      {ci && (
        <div style={{ position: "absolute", insetBlock: 0, left: ci.left, width: "6px" }}>
          <div style={{ background: T.inkCC, position: "absolute", top: "50%", left: 0, translate: "0 -50%", height: 10, width: 2 }} />
          <div style={{ background: T.inkCC, position: "absolute", top: "50%", right: 0, translate: "0 -50%", height: 10, width: 2 }} />
          <div style={{ background: T.inkCC, position: "absolute", top: "50%", translate: "0 -50%", left: 0, right: 0, height: 2 }} />
        </div>
      )}
    </div>
  );
}

/* ---------- a leaderboard row ---------- */
type Model = { color: string; name: string; value: string; width: string; ci?: string; dim?: boolean };
function Row({ m, ci }: { m: Model; ci?: { left: string } }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ background: m.color, flexShrink: 0, height: 12, width: 6 }} />
          <span style={{ color: m.dim ? T.ink66 : T.ink, fontFamily: SANS, fontSize: 14, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</span>
        </div>
        <span style={{ color: m.dim ? T.ink66 : T.ink, fontFamily: SANS, fontSize: 14, fontWeight: 500, lineHeight: 1, fontFeatureSettings: '"tnum"', flexShrink: 0 }}>{m.value}</span>
      </div>
      <div style={{ marginTop: 10 }}>
        <Bar widthPct={m.width} ci={ci} />
      </div>
    </div>
  );
}

/* ---------- axis ticks ---------- */
function Axis({ ticks }: { ticks: { left: string; label: string; shift?: boolean }[] }) {
  return (
    <div style={{ position: "relative", height: 14, marginTop: 16, paddingTop: 10, borderTop: `1px solid ${T.ink1A}` }}>
      {ticks.map((t, i) => (
        <span key={i} style={{
          position: "absolute", top: 0, left: t.left, color: T.ink66, fontFamily: SANS,
          fontSize: 11, lineHeight: 1, fontFeatureSettings: '"tnum"',
          translate: t.shift ? "-50% 0" : t.left === "0%" ? "0" : t.left === "100%" ? "-100% 0" : "0",
          width: "max-content",
        }}>{t.label}</span>
      ))}
    </div>
  );
}

/* ---------- a benchmark block ---------- */
function Bench({
  tag, tagColor, title, blurb, rows, showMore, axis, note,
}: {
  tag: string; tagColor: string; title: string; blurb: string;
  rows: Model[]; showMore: string; axis: { ticks: { left: string; label: string; shift?: boolean }[] };
  note?: string;
}) {
  return (
    <div style={{ borderTop: `1px solid ${T.ink26}`, display: "grid", gridTemplateColumns: "5fr 6fr", columnGap: 64, rowGap: 32, paddingBlock: 64, position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: tagColor, height: 12, width: 6, flexShrink: 0 }} />
          <span style={{ color: T.ink8C, fontFamily: SANS, fontSize: 14, fontWeight: 500, lineHeight: 1 }}>{tag}</span>
        </div>
        <div style={{ color: T.ink, fontFamily: SERIF, fontSize: 30, letterSpacing: "-0.3px", lineHeight: 1.12, marginTop: 20, textWrap: "balance" }}>
          {title}
        </div>
        <p style={{ color: T.ink8C, fontFamily: SANS, fontSize: 14, lineHeight: 1.55, marginTop: 16, maxWidth: 394.772, textWrap: "pretty" }}>
          {blurb}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 24 }}>
          <span style={{ color: T.ink, fontFamily: SANS, fontSize: 14, fontWeight: 500, lineHeight: 1.43 }}>Read More</span>
          <svg viewBox="0 0 6 10" width="6" height="10" style={{ flexShrink: 0 }}><path d="M1 1l4 4-4 4" fill="none" stroke="#000000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>

      <div style={{ paddingTop: 4 }}>
        {note && <div style={{ color: T.ink73, fontFamily: SANS, fontSize: 12, lineHeight: 1.33, marginBottom: 12, textWrap: "pretty" }}>{note}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {rows.map((m, i) => (
            <Row key={m.name} m={m} ci={i === 0 && m.ci ? { left: m.ci } : undefined} />
          ))}
        </div>
        <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: T.ink8C, fontFamily: SANS, fontSize: 12, fontWeight: 500, lineHeight: 1.33 }}>{showMore}</span>
          <svg viewBox="0 0 6 10" width="6" height="10" style={{ flexShrink: 0 }}><path d="M1 1l4 4-4 4" fill="none" stroke="oklab(0% 0 0 / 55%)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <Axis ticks={axis.ticks} />
      </div>
    </div>
  );
}

/* ---------- data ---------- */
const BENCHES = [
  {
    tag: "Returns-Bench", tagColor: "#9B5B23",
    title: "CBN Return-Readiness",
    blurb: "Returns-Bench evaluates whether the platform can complete real supervised filings end-to-end — not isolated prompts, but sustained workflows across systems, approvals, and examiner rules. It breaks each return into verifiable steps to show how institutions actually perform.",
    rows: [
      { color: "#6B342E", name: "RegCo Returns Engine", value: "87.5% ± 7.3%", width: "87.5%", ci: "80.22%" },
      { color: "#CD8C3C", name: "Manual Spreadsheet Workflow", value: "85.0% ± 7.8%", width: "85%", dim: true },
      { color: "#BA4317", name: "Legacy GRC Suite", value: "83.8% ± 8.1%", width: "83.75%" },
    ],
    showMore: "Show 12 more",
    axis: { ticks: [
      { left: "0%", label: "0%" }, { left: "20%", label: "20%", shift: true }, { left: "40%", label: "40%", shift: true },
      { left: "60%", label: "60%", shift: true }, { left: "80%", label: "80%", shift: true }, { left: "100%", label: "100%" },
    ] },
  },
  {
    tag: "Market-Bench", tagColor: "#2F5BB8",
    title: "Introductory Quantitative Surveillance",
    blurb: "Market-Bench evaluates how the platform performs when outcomes aren't known in advance. It simulates real transaction-flow conditions where timing, judgment, and adaptation matter. Because intelligence isn't just detection. It's decision-making under uncertainty.",
    note: "Mean false-negative rate · lower is better",
    rows: [
      { color: "#2E586B", name: "RegCo Monitoring Hub", value: "443.24", width: "3.69%" },
      { color: "#3C5ECD", name: "Rules-Based Scenario Engine", value: "969.39", width: "8.08%", dim: true },
      { color: "#176BBA", name: "Manual Analyst Review", value: "1744.27", width: "14.54%" },
    ],
    showMore: "Show 10 more",
    axis: { ticks: [
      { left: "0%", label: "0" }, { left: "16.67%", label: "2000", shift: true }, { left: "33.33%", label: "4000", shift: true },
      { left: "50%", label: "6000", shift: true }, { left: "66.67%", label: "8000", shift: true }, { left: "83.33%", label: "10000", shift: true },
      { left: "100%", label: "12000" },
    ] },
  },
  {
    tag: "Screen-Bench", tagColor: "#CEAF5C",
    title: "AI Sanctions & PEP Screening",
    blurb: "Screen-Bench measures how the platform turns a customer record into a defensible match decision. One-shot screening, zero manual triage. It scores the whole result — identity resolution, match grading, and whether the decision is auditable. Because screening isn't lookup. It's a defensible judgment.",
    rows: [
      { color: "#6B442E", name: "RegCo Screening Core", value: "76.8%", width: "96%" },
      { color: "#CDB23C", name: "API Vendor A", value: "67.5%", width: "84.375%" },
      { color: "#BA6E17", name: "In-House List Match", value: "64.9%", width: "81.125%", dim: true },
    ],
    showMore: "Show 7 more",
    axis: { ticks: [
      { left: "0%", label: "0%" }, { left: "25%", label: "20%", shift: true }, { left: "50%", label: "40%", shift: true },
      { left: "75%", label: "60%", shift: true }, { left: "100%", label: "80%" },
    ] },
  },
  {
    tag: "Audit-Bench", tagColor: "#1D9B54",
    title: "Audit Evidence, Assumption-Based",
    blurb: "Audit-Bench evaluates how the platform reasons over real supervisory evidence. Reading filings, making assumptions, working through multi-step analysis. It tests the open-ended, assumption-driven judgment real examinations demand. Because audit isn't lookup. It's interpretation under uncertainty.",
    rows: [
      { color: "#2E6B32", name: "RegCo Audit Vault", value: "54.1%", width: "90.17%", dim: true },
      { color: "#3CCD88", name: "Manual Evidence Pack", value: "49.3%", width: "82.17%" },
      { color: "#17BA3F", name: "Legacy DMS Export", value: "48.6%", width: "81%", dim: true },
    ],
    showMore: "Show 16 more",
    axis: { ticks: [
      { left: "0%", label: "0%" }, { left: "16.67%", label: "10%", shift: true }, { left: "33.33%", label: "20%", shift: true },
      { left: "50%", label: "30%", shift: true }, { left: "66.67%", label: "40%", shift: true }, { left: "83.33%", label: "50%", shift: true },
      { left: "100%", label: "60%" },
    ] },
  },
];

/* ---------- footer ---------- */
function Footer() {
  const cols = [
    { h: "Lab", items: ["Research & Blog", "Leaderboards", "Knowledge"] },
    { h: "Company", items: ["Products", "For Enterprises", "Careers"] },
    { h: "Social", items: ["LinkedIn", "X"] },
    { h: "Terms & Policies", items: ["Terms of Service", "Privacy Policy"] },
  ];
  return (
    <div style={{ background: T.canvas }}>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingBlock: 64, paddingInline: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: T.ink, fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>RegCo</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 40, rowGap: 32 }}>
            {cols.map((c) => (
              <div key={c.h} style={{ minWidth: 112 }}>
                <div style={{ color: T.inkE6, fontFamily: SANS, fontSize: 14, fontWeight: 500, letterSpacing: "-0.14px", lineHeight: 1.43, textWrap: "balance" }}>{c.h}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                  {c.items.map((i) => (
                    <a key={i} href="#" style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, fontWeight: 500, lineHeight: 1.43, textDecoration: "none" }}>{i}</a>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 12, fontWeight: 500, lineHeight: 1.33, textWrap: "pretty" }}>
              RegCo © 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function ProductPage() {
  return (
    <div style={{ background: T.canvas, color: T.ink, fontFamily: SANS, position: "relative", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Banner />
      <Nav />
      <div style={{ flexGrow: 1, position: "relative" }}>
        <div style={{ paddingTop: 112, paddingBottom: 80 }}>
          <div style={{ margin: "0 auto", width: "min(100% - 32px, 688px)" }}>
            <div style={{ color: T.ink99, display: "flex", flexWrap: "wrap", fontFamily: SANS, fontSize: 14, justifyContent: "center", lineHeight: 1.45, marginBottom: 20, textAlign: "center", textWrap: "pretty" }}>
              Benchmarks
            </div>
            <div style={{ color: T.ink, display: "flex", flexWrap: "wrap", fontFamily: SERIF, fontSize: 38, justifyContent: "center", letterSpacing: "-0.38px", lineHeight: 1.05, textAlign: "center", textWrap: "balance" }}>
              Rigorous benchmarks, not cherry-picked compliance.
            </div>
            <p style={{ color: T.ink99, display: "flex", flexWrap: "wrap", fontFamily: SANS, fontSize: 18, justifyContent: "center", lineHeight: 1.45, margin: "24px auto 0", maxWidth: 507.564, textAlign: "center", textWrap: "pretty" }}>
              Design custom evaluations that measure your specified regulatory capabilities.
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
              <DarkPill><Link to="/book-demo" style={{ color: T.canvasTone, textDecoration: "none" }}>Collaborate with us</Link></DarkPill>
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: 128 }}>
          <div style={{ margin: "0 auto", width: "min(100% - 32px, 1136px)" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {BENCHES.map((b) => (
                <Bench key={b.tag} {...b} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
