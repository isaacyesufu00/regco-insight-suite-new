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
              Compliance intelligence for financial institutions.
            </div>
          </div>
          <div>
            <div style={{ maxWidth: 550.16, marginTop: 20 }}>
              <span style={{ display: "inline-block", color: T.ink8C, fontFamily: SERIF, fontSize: 20, lineHeight: 1.2, textWrap: "pretty" }}>
                Compliance shouldn’t begin after an audit. The future of regulatory operations is continuous monitoring, intelligent detection, and automated reporting — so every transaction, customer, and regulatory return is always ready for review.
              </span>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
              <DarkPill><Link to="/book-demo" style={{ color: T.canvasTone, textDecoration: "none" }}>Start Demo</Link></DarkPill>
              <LightChip><Link to="/product" style={{ color: T.inkCC, textDecoration: "none" }}>Explore Platform</Link></LightChip>
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
          Trusted by compliance leaders building the future of financial services.
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
          Purpose-built for regulated financial institutions.
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
          Financial institutions are drowning in fragmented compliance operations.
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, marginBottom: 16, textWrap: "pretty" }}>
            Fraud teams investigate suspicious activity. Compliance officers prepare regulatory returns. Risk teams monitor exposure. Internal audit tracks governance. Identity teams screen customers. Every department works with different tools, disconnected data, and manual workflows.
          </div>
          <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, marginBottom: 16, textWrap: "pretty" }}>
            The result is duplicated work, delayed reporting, operational blind spots, and unnecessary regulatory risk.
          </div>
          <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, textWrap: "pretty" }}>
            Compliance shouldn’t exist as separate departments. It should operate as one intelligent system.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: NARROW, margin: "56px auto 0", paddingInline: 16 }}>
        <div>
          <div style={{ borderRadius: 4, boxShadow: "inset 0 0 0 1px #0000001A", overflow: "clip", aspectRatio: "2720 / 1161" }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #EFEFEA 0%, #E4E4DD 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: SANS, fontSize: 14, color: T.ink66 }}>RegCo dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: NARROW, margin: "56px auto 0", paddingInline: 16 }}>
        <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, lineHeight: 1.45, marginBottom: 16, textWrap: "pretty" }}>
          Our Solution
        </div>
        <div style={{ color: T.inkCC, fontFamily: SERIF, fontSize: 24, letterSpacing: "-0.24px", lineHeight: 1.15, textWrap: "balance" }}>
          One AI platform for fraud, compliance, identity, governance, and regulatory reporting.
        </div>
        <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, marginTop: 16, textWrap: "pretty" }}>
          RegCo continuously analyzes operational data across your institution, detects suspicious activity, validates customer identity, monitors governance controls, prepares regulatory submissions, and provides compliance teams with one real-time operational picture.
        </div>
        <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, marginTop: 16, textWrap: "pretty" }}>
          Instead of reacting to audits… your institution stays continuously prepared.
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
  { t: "Fraud Detection", d: "Real-time monitoring of customer behavior, account activity, transactions, velocity patterns, and anomaly detection using machine learning designed specifically for financial institutions." },
  { t: "Identity & Screening", d: "Continuous customer verification against sanctions lists, politically exposed persons, adverse media, watchlists, and onboarding requirements to reduce compliance exposure before risk enters the institution." },
  { t: "Regulatory Reporting", d: "Automatically generate CBN returns, validate financial data, reconcile reporting inconsistencies, and prepare submission-ready reports without manual spreadsheet workflows." },
  { t: "Audit & Governance", d: "Track internal controls, monitor policy compliance, record every action with immutable audit trails, and provide management with complete governance visibility across the organization." },
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
  { t: "How AI changes regulatory reporting", d: "Discover how automated validation removes manual reconciliation and reduces reporting preparation from days to minutes.", tag: "Platform Insights", date: "June 2026" },
  { t: "The future of continuous compliance", d: "Why quarterly audits are becoming obsolete as financial institutions adopt continuous monitoring and real-time governance.", tag: "Research", date: "June 2026" },
  { t: "Why compliance teams need one operating system", d: "How combining fraud detection, identity verification, governance, and reporting creates stronger regulatory outcomes.", tag: "Industry", date: "July 2026" },
];

function Research() {
  return (
    <div style={{ background: T.canvas, paddingTop: 64, paddingBottom: 32 }}>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ color: T.inkCC, fontFamily: SANS, fontSize: 24, fontWeight: 500, letterSpacing: "-0.24px", lineHeight: 1.15, textWrap: "balance" }}>
              Built from regulatory operations — not generic AI.
            </div>
            <p style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, lineHeight: 1.45, marginTop: 8, marginBottom: 0, textWrap: "pretty" }}>
              Modern AI can summarize documents. But regulatory compliance demands evidence, traceability, governance, explainability, and confidence. RegCo combines artificial intelligence with structured compliance logic, regulatory frameworks, and institutional workflows so recommendations remain transparent, auditable, and regulator-ready.
            </p>
          </div>
          <LightChip><Link to="/blog/updates" style={{ color: T.inkCC, textDecoration: "none" }}>Learn more</Link></LightChip>
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
                    <span style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, fontWeight: 500, lineHeight: 1 }}>{p.tag}</span>
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
                  Build the future of regulatory technology.
                </div>
                <p style={{ color: "#FFFFFFCC", fontFamily: SANS, fontSize: 14, lineHeight: 1.45, marginTop: 12, marginBottom: 0, textWrap: "pretty" }}>
                  We’re building the next generation of compliance infrastructure for financial institutions across Africa. Join engineers, designers, compliance specialists, and researchers creating AI systems trusted by regulated organizations.
                </p>
              </div>
              <div style={{ display: "flex", flexShrink: 0, gap: 6 }}>
                <span style={{ color: T.canvasTone, fontFamily: SANS, fontSize: 14, fontWeight: 500, textDecoration: "underline 1px #FFFFFF66", textUnderlineOffset: 4 }}>View Opportunities</span>
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
    { h: "Platform", items: ["Overview", "Fraud Detection", "Identity Screening", "Audit & Governance", "Regulatory Reporting", "AI Compliance Brain"] },
    { h: "Company", items: ["About", "Customers", "Pricing", "Careers", "Contact"] },
    { h: "Resources", items: ["Documentation", "Knowledge Base", "Compliance Guides", "Blog", "Platform Updates"] },
    { h: "Legal", items: ["Privacy Policy", "Terms of Service", "Security", "Data Processing Agreement", "Responsible AI"] },
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
              © 2026 RegCo
              <br />
              Compliance Intelligence for Financial Institutions.
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
