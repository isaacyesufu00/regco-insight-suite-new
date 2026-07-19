import { Link } from "react-router-dom";

/* =========================================================
   REGCO — About page
   Pixel-identical structural translation of the AfterQuery
   Paper "Fey → Wealthsimple" statement export
   (app.paper.design, Jul 19 2026) into the RegCo light
   editorial design system. Background uses the site canvas
   #F8F8F3 to stay consistent with the rest of the site.
   ========================================================= */

const T = {
  canvas: "#F8F8F3",
  ink: "#000000",
  inkCC: "#000000CC",
  ink99: "#00000099",
  meta: "#595959", // paper body grey, used for the statement
  ink66: "#00000066",
  ink0F: "#0000000F",
  inkE6: "#000000E6",
  canvasTone: "#F8F8F3",
};

const SANS = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const MAX = 1136;

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

/* ---------- statement ---------- */
const PARAS = [
  "RegCo began inside the institutions it now serves. We watched compliance teams at banks, fintechs, and agencies fight the same battle — fragmented tools, manual filings, and audits that arrived too late to matter.",
  "We proved a small, focused team could raise the bar in a category that had settled for less. We built with taste, conviction, and an obsession with making regulatory work feel simpler, smarter, and genuinely trustworthy.",
  "RegCo is now building the AI operating system for compliance across Nigerian financial services. With the backing of the institutions we serve, that ambition goes further.",
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
export default function AboutUsPage() {
  return (
    <div style={{ background: T.canvas, color: T.ink, fontFamily: SANS, position: "relative", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Banner />
      <Nav />
      <div style={{ flexGrow: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "clip", paddingBlock: 80, paddingInline: 16 }}>
        <div style={{ position: "relative", width: 520, maxWidth: "100%" }}>
          {PARAS.map((p, i) => (
            <div
              key={i}
              style={{
                color: T.meta, fontFamily: SANS, fontSize: 21, fontWeight: 600,
                letterSpacing: "-0.21px", lineHeight: 1.55, textWrap: "pretty",
                marginBottom: i < PARAS.length - 1 ? "29.4px" : 0,
                marginTop: i === PARAS.length - 1 ? "21px" : 0,
              }}
            >
              {p}
            </div>
          ))}
          <div
            style={{
              marginTop: 44, width: "clamp(180px, 42%, 240px)", aspectRatio: "541 / 129",
              background: "linear-gradient(135deg, #E9E9E2 0%, #DEDCD3 100%)",
              borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: SANS, fontSize: 15, color: T.ink66, letterSpacing: "0.02em" }}>RegCo</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
