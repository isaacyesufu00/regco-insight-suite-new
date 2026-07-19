import { Link } from "react-router-dom";

/* =========================================================
   REGCO — Light editorial homepage
   Pixel-identical structural + content translation of the
   AfterQuery Paper export (app.paper.design, Jul 19 2026).
   Canvas #F8F8F3, serif display headlines, neutral UI text.
   Image assets are local placeholders (gradients).
   ========================================================= */

const T = {
  canvas: "#F8F8F3",
  ink: "#000000",
  inkCC: "#000000CC", // 80% — nav/body strong
  ink99: "#00000099", // 60% — secondary text
  ink8C: "#0000008C", // ~55% — hero sub
  inkB3: "#000000B3", // 70% — marquee label
  ink66: "#00000066", // 40% — meta
  ink26: "#00000026", // 15% — dividers/dots
  ink14: "#00000014", // 8% — hairline divider
  ink0F: "#0000000F", // 6% — chip bg
  inkE6: "#000000E6", // 90% — ink-on-tint
  canvasTone: "#F8F8F3", // ink-on-dark uses canvas tone
  red: "#C8102E",
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
      <div style={{
        maxWidth: MAX, margin: "0 auto", height: 70, paddingInline: 32,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <span style={{ color: T.ink, fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>RegCo</span>
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {links.map((x) => (
            <Link key={x.l} to={x.to} style={{ position: "relative", color: T.inkCC, fontSize: 14, fontWeight: 500, textDecoration: "none", lineHeight: 1.43 }}>
              <span style={{ display: "block", textAlign: "center" }}>{x.l}</span>
              <span style={{ position: "absolute", bottom: -2, left: 0, height: 1, width: "100%", background: T.inkE6 }} />
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

/* ---------- hero ---------- */
function Hero() {
  return (
    <div style={{ background: T.canvas, flexGrow: 1, position: "relative" }}>
      <div style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 688, margin: "0 auto", paddingInline: 16 }}>
          <div>
            <div style={{ color: T.ink, fontFamily: SERIF, fontSize: 24, letterSpacing: "-0.24px", lineHeight: 1.15, maxWidth: 401.856, textWrap: "balance" }}>
              Compliance. Fraud. Identity. Governance. One AI operating system.
            </div>
          </div>
          <div>
            <div style={{ maxWidth: 550.16, marginTop: 20 }}>
              <span style={{ display: "inline-block", color: T.ink8C, fontFamily: SERIF, fontSize: 20, lineHeight: 1.2, textWrap: "pretty" }}>
                RegCo gives regulated institutions a single AI-powered platform to automate reporting, detect fraud, and stay continuously compliant.
              </span>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
              <DarkPill><Link to="/book-demo" style={{ color: T.canvasTone, textDecoration: "none" }}>Book a demo</Link></DarkPill>
              <LightChip><Link to="/sign-in" style={{ color: T.inkCC, textDecoration: "none" }}>Login</Link></LightChip>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1136, margin: "80px auto 0", paddingInline: 16 }}>
          <div>
            <div style={{ borderRadius: 4, boxShadow: "inset 0 0 0 1px #0000001A", overflow: "clip", position: "relative", aspectRatio: "1040 / 419" }}>
              {/* Paper webp placeholder */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #F2F2EC 0%, #E9E9E2 60%, #DEDCD3 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: SANS, fontSize: 15, color: T.ink66, letterSpacing: "0.02em" }}>Product screenshot</span>
              </div>
              {/* center logo mark placeholder (Paper SVG) */}
              <div style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%", width: 144, height: 118, background: T.ink, borderRadius: 4, opacity: 0.9 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- institutions we comply with marquee ---------- */
const COMPLIANCE = ["CBN", "NFIU", "NDIC", "FIRS", "SEC", "NDPC", "CAC", "ICPC"];
const MARQUEE = [...COMPLIANCE, ...COMPLIANCE, ...COMPLIANCE, ...COMPLIANCE, ...COMPLIANCE, ...COMPLIANCE];

function BackedBy() {
  return (
    <div style={{ background: T.canvas, paddingBlock: "48px 32px", paddingInline: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ color: T.inkB3, fontFamily: SERIF, fontSize: 24, letterSpacing: "-0.24px", lineHeight: 1.15, textAlign: "center", textWrap: "balance" }}>
          Institutions we comply with
        </div>
        <div style={{
          marginTop: 32, maxWidth: 640, width: "100%", overflow: "clip",
          maskImage: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgb(0,0,0) 80%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgb(0,0,0) 80%, rgba(0,0,0,0) 100%)",
        }}>
          <div style={{ display: "flex", alignItems: "center", width: "max-content", animation: "regco-marquee 30s linear infinite" }}>
            {MARQUEE.map((n, i) => (
              <div key={i} style={{ flexShrink: 0, marginRight: 56, fontFamily: SANS, fontWeight: 600, fontSize: 20, color: T.ink66, letterSpacing: "-0.01em" }} title={n}>
                {n}
              </div>
            ))}
          </div>
        </div>
        <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, lineHeight: 1.4, textAlign: "center", marginTop: 40, textWrap: "pretty" }}>
          Aligned to Nigerian regulatory and statutory requirements
        </div>
      </div>
    </div>
  );
}

/* ---------- problem / solution ---------- */
function Narrative() {
  return (
    <div style={{ background: T.canvas, paddingBlock: "32px 56px" }}>
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16 }}>
        <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, lineHeight: 1.45, marginBottom: 16, textWrap: "pretty" }}>
          Problem
        </div>
        <div style={{ color: T.inkCC, fontFamily: SERIF, fontSize: 24, letterSpacing: "-0.24px", lineHeight: 1.15, textWrap: "balance" }}>
          Compliance teams and regulated institutions are hitting walls with fragmented, manual processes.
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, marginBottom: 16, textWrap: "pretty" }}>
            Today’s tools generate reports. But they struggle with real work. Because real work isn’t just filings — it’s decisions, tradeoffs, and context. That judgment doesn’t live in spreadsheets — it lives inside your experts.
          </div>
          <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, marginBottom: 16, textWrap: "pretty" }}>
            Expertise has never been captured. Until now.
          </div>
          <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, textWrap: "pretty" }}>
            The most valuable compliance knowledge isn’t written down. It exists in how professionals think — not just answers, but reasoning, decisions, tradeoffs, and context. We work with domain experts to capture that thinking, then structure it into an operating system institutions can run on.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: NARROW, margin: "56px auto 0", paddingInline: 16 }}>
        <div>
          <div style={{ borderRadius: 4, boxShadow: "inset 0 0 0 1px #0000001A", overflow: "clip", aspectRatio: "2720 / 1161" }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #EFEFEA 0%, #E4E4DD 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: SANS, fontSize: 14, color: T.ink66 }}>Workflow screenshot</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: NARROW, margin: "56px auto 0", paddingInline: 16 }}>
        <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, lineHeight: 1.45, marginBottom: 16, textWrap: "pretty" }}>
          Our solution
        </div>
        <div style={{ color: T.inkCC, fontFamily: SERIF, fontSize: 24, letterSpacing: "-0.24px", lineHeight: 1.15, textWrap: "balance" }}>
          We turn real-world compliance work into an operating system.
        </div>
        <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, marginTop: 16, textWrap: "pretty" }}>
          RegCo is an applied compliance platform purpose-built for Nigerian regulated institutions. Models trained on outputs plateau. Models trained on reasoning improve. We build a system that reflects how experts actually solve problems — step by step, decision by decision.
        </div>
        <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, marginTop: 16, textWrap: "pretty" }}>
          Our platform includes:
        </div>
      </div>
    </div>
  );
}

/* ---------- data types grid ---------- */
const DATA_TYPES = [
  { t: "Regulatory Reporting (SFT)", d: "CBN, NFIU, NDIC and FIRS returns with structured prompt–response pairs and chain-of-thought traces — teaching the platform how to file accurately across every institution." },
  { t: "AML & Fraud Rubrics", d: "Expert-designed detection prompts with grading frameworks for suspicious activity and fraud — turning subjective judgment into scalable, auditable signals." },
  { t: "Screening Environments (API / MCP)", d: "Custom environments across BVN, NIN, CAC, and watchlist services — enabling validation and evaluation of compliance checks in real workflows." },
  { t: "Audit Trajectories", d: "Human-demonstrated interactions across the compliance workspace — teaching the platform to navigate examinations and remediations end-to-end." },
];

function DataTypes() {
  return (
    <div style={{ background: T.canvas, maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 56 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: 16, rowGap: 32 }}>
        {DATA_TYPES.map((d) => (
          <div key={d.t} style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <div style={{
              flexShrink: 0, width: 44, height: 44, borderRadius: 4,
              background: T.ink0F, backgroundPosition: "50%", backgroundSize: "cover",
              mixBlendMode: "multiply", overflow: "clip",
            }} />
            <div>
              <div style={{ color: T.inkCC, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45 }}>
                {d.t}
              </div>
              <p style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, marginTop: 8, marginBottom: 0, textWrap: "pretty" }}>{d.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- divider ---------- */
function Divider() {
  return (
    <div style={{ background: T.canvas, maxWidth: NARROW, margin: "0 auto", paddingInline: 16 }}>
      <div style={{ background: T.ink14, height: 1, width: "100%", overflow: "clip" }} />
    </div>
  );
}

/* ---------- research ---------- */
const POSTS = [
  { t: "How We Improved Regulatory Filing Accuracy by Over 5x Using Expert Traces", d: "How expert-curated workflows and tooling lifted filing accuracy more than 5x — and what it says about training compliance AI.", date: "Mar 31, 2026" },
  { t: "Compliance expertise, reimagined", d: "Capturing how experts think — turning real-world decisions, judgment, and workflows into a system institutions can run on.", date: "Apr 9, 2026" },
  { t: "Solving the Last Mile Problem in Partnership with Leading Institutions", d: "Encoding domain-specific excellence into forms machines can learn — so the platform thinks and executes like real-world experts.", date: "Apr 28, 2026" },
];

function Research() {
  return (
    <div style={{ background: T.canvas, paddingTop: 64, paddingBottom: 32 }}>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ color: T.inkCC, fontFamily: SANS, fontSize: 24, fontWeight: 500, letterSpacing: "-0.24px", lineHeight: 1.15, textWrap: "balance" }}>
              Research
            </div>
            <p style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, lineHeight: 1.45, marginTop: 8, marginBottom: 0, textWrap: "pretty" }}>
              Our approach starts with research: where exactly do compliance teams break down in real institutional contexts? Why do these failure modes exist? We take a proactive stance — every regulated domain has its own patterns.
            </p>
          </div>
          <LightChip><Link to="/blog/updates" style={{ color: T.inkCC, textDecoration: "none" }}>More research</Link></LightChip>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginTop: 32 }}>
          {POSTS.map((p) => (
            <div key={p.t}>
              <div style={{ borderRadius: 4 }}>
                <div style={{ aspectRatio: "1 / 1", background: T.ink, borderRadius: 4, boxShadow: "inset 0 0 0 1px #00000026", overflow: "clip", position: "relative", width: "100%" }}>
                  {/* Paper avif placeholder */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #2A2A28 0%, #141413 100%)" }} />
                </div>
                <div style={{ marginTop: 20 }}>
                  <div style={{ color: T.ink, fontFamily: SERIF, fontSize: 20, letterSpacing: "-0.2px", lineHeight: 1.15, textWrap: "balance" }}>
                    {p.t}
                  </div>
                  <p style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, lineHeight: 1.45, marginTop: 12, marginBottom: 0, maxWidth: 446.264, textWrap: "pretty" }}>
                    {p.d}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
                    <span style={{ background: T.inkCC, width: 6, height: 10, flexShrink: 0 }} />
                    <span style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, fontWeight: 500, lineHeight: 1 }}>Blog</span>
                    <span style={{ color: T.ink26, fontFamily: SANS, fontSize: 14, lineHeight: 1 }}>·</span>
                    <span style={{ color: T.ink66, fontFamily: SANS, fontSize: 14, lineHeight: 1 }}>{p.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- careers cta ---------- */
function CareersCTA() {
  return (
    <div style={{ background: T.canvas, paddingTop: 64, paddingBottom: 100 }}>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16 }}>
        <div>
          <div style={{ borderRadius: 4, boxShadow: "inset 0 0 0 1px #0000001A", overflow: "clip", position: "relative", aspectRatio: "auto" }}>
            {/* Paper avif placeholder */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #2A2A28 0%, #141413 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
            <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, padding: 24 }}>
              <div style={{ maxWidth: 549.248 }}>
                <div style={{ color: T.canvasTone, fontFamily: SERIF, fontSize: 24, letterSpacing: "-0.24px", lineHeight: 1.15, textWrap: "balance" }}>
                  Careers
                </div>
                <p style={{ color: "#FFFFFFCC", fontFamily: SANS, fontSize: 14, lineHeight: 1.45, marginTop: 12, marginBottom: 0, textWrap: "pretty" }}>
                  We’re hiring for engineering, operations, and compliance roles to help us accelerate AI for regulated institutions. Join the team revolutionizing regulatory technology in Nigeria.
                </p>
              </div>
              <div style={{ display: "flex", flexShrink: 0, gap: 6 }}>
                <span style={{ color: T.canvasTone, fontFamily: SANS, fontSize: 14, fontWeight: 500, textDecoration: "underline 1px #FFFFFF66", textUnderlineOffset: 4 }}>See open roles</span>
                <span style={{ color: T.canvasTone, fontFamily: SANS, fontSize: 14, fontWeight: 500 }}>↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- footer ---------- */
function Footer() {
  const cols = [
    { h: "Product", items: ["Regulatory Reporting", "Fraud Detection", "Identity & Screening", "Audit & Governance", "AI Assistant"] },
    { h: "Company", items: ["About", "Careers", "Security", "Contact"] },
    { h: "Social", items: ["LinkedIn", "X"] },
    { h: "Terms & Policies", items: ["Terms of Service", "Privacy Policy"] },
  ];
  return (
    <div style={{ background: T.canvas }}>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingBlock: 64, paddingInline: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ height: 22, width: 96, background: T.ink, borderRadius: 3, opacity: 0.85 }} />
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

/* ---------- keyframes ---------- */
function Keyframes() {
  return (
    <style>{`
      @keyframes regco-marquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
    `}</style>
  );
}

/* =========================================================
   PAGE
   ========================================================= */
export default function RegcoHome() {
  return (
    <div style={{ background: T.canvas, color: T.ink, fontFamily: SANS, position: "relative", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Keyframes />
      <Banner />
      <Nav />
      <Hero />
      <BackedBy />
      <Narrative />
      <DataTypes />
      <Divider />
      <Research />
      <CareersCTA />
      <Footer />
    </div>
  );
}
