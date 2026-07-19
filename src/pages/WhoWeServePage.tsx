import { Link } from "react-router-dom";

/* =========================================================
   REGCO — Who we serve page
   Pixel-identical structural translation of the AfterQuery
   Paper "Products" list export (app.paper.design, Jul 19 2026)
   into the RegCo light editorial design system.
   Banner + nav + footer mirror RegcoHome.tsx.
   ========================================================= */

const T = {
  canvas: "#F8F8F3",
  ink: "#000000",
  inkCC: "#000000CC", // 80% — nav/rows strong
  ink99: "#00000099", // 60% — intro/body
  ink1A: "#0000001A", // 10% — row dividers
  ink0F: "#0000000F", // 6% — chip bg
  inkE6: "#000000E6", // 90% — ink-on-tint / headings
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

/* ---------- a serve row ---------- */
type Row = { color: string; title: string; body: string };
function ServeRow({ r }: { r: Row }) {
  return (
    <div style={{ borderTop: `1px solid ${T.ink1A}`, display: "grid", gridTemplateColumns: "1.13fr 1fr", columnGap: 16, rowGap: 12, paddingBlock: 32, alignItems: "flex-start" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
        <span style={{ background: r.color, flexShrink: 0, height: 16, width: 6, marginTop: 6 }} />
        <div style={{ color: T.inkCC, flexBasis: 0, flexGrow: 1, fontFamily: SERIF, fontSize: 24, letterSpacing: "-0.24px", lineHeight: 1.15, minWidth: 0, textWrap: "balance" }}>
          {r.title}
        </div>
      </div>
      <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, lineHeight: 1.45, textWrap: "pretty" }}>
        {r.body}
      </div>
    </div>
  );
}

/* ---------- data ---------- */
const ROWS: Row[] = [
  { color: "#000000CC", title: "Banks & Microfinance Banks", body: "Deposit money banks and MFBs use RegCo to automate CBN returns, monitor transactions in real time, and keep examiner-ready evidence without expanding compliance headcount." },
  { color: "#A76D3B", title: "Fintechs & Payment Service Banks", body: "Licensed PSBs and fintechs run continuous sanction and PEP screening, generate submission-ready reports, and close onboarding gaps before risk enters the institution." },
  { color: "#AD6565", title: "Insurance & Pension Institutions", body: "Insurers and pension administrators track governance controls and regulator submissions on one platform, replacing fragmented manual workflows with a single operating picture." },
  { color: "#D99518CC", title: "Capital Market & Securities Firms", body: "Brokers, asset managers, and securities dealers rely on immutable audit trails and structured reporting to satisfy SEC oversight and internal governance requirements." },
  { color: "#A76D3B", title: "RegTech & Software Vendors", body: "Compliance and RegTech builders embed RegCo's screening, reporting, and audit modules into their own products through documented APIs and MCP environments." },
  { color: "#2A8C53", title: "Government & Public Agencies", body: "Supervisory and statutory bodies use RegCo to standardize submissions across institutions, monitor exposure, and reconstruct regulatory activity on demand." },
  { color: "#9C47A1CC", title: "Audit & Assurance Practices", body: "External and internal audit teams use RegCo to verify controls, trace every action, and assemble defensible evidence packs that withstand examination." },
  { color: "#A76D3B", title: "Corporate Compliance Functions", body: "Non-financial enterprises with regulatory obligations screen counterparties, monitor policy compliance, and prepare reporting from a single governance workspace." },
  { color: "#A63A9D", title: "Risk & Control Units", body: "Enterprise risk teams monitor exposure continuously, escalate anomalies into supervised case queues, and track remediation across the institution in real time." },
  { color: "#8F5DD4", title: "Screening & KYC Operations", body: "KYC and onboarding teams verify customers against sanction, PEP, and adverse media feeds, flag borderline matches, and preserve a defensible decision trail." },
  { color: "#59A63A", title: "Reporting & Regulatory Liaison", body: "Regulatory liaison teams assemble examiner-ready schedules from operational data, surface readiness gaps early, and render submission packets across the supervised set." },
  { color: "#000000", title: "Enterprise-Wide Programs", body: "Group-level compliance programs standardize controls and reporting across subsidiaries, giving management complete governance visibility in one place." },
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
export default function WhoWeServePage() {
  return (
    <div style={{ background: T.canvas, color: T.ink, fontFamily: SANS, position: "relative", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Banner />
      <Nav />
      <div style={{ flexGrow: 1, position: "relative" }}>
        <div style={{ paddingTop: 64, paddingBottom: 144 }}>
          <div style={{ margin: "0 auto", width: "min(100% - 32px, 1040px)" }}>
            <div style={{ color: T.inkCC, fontFamily: SERIF, fontSize: 38, letterSpacing: "-0.38px", lineHeight: 1.05, textWrap: "balance" }}>
              Who we serve
            </div>
            <div style={{ marginTop: 32 }}>
              <p style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, lineHeight: 1.45, marginBottom: 20, textWrap: "pretty" }}>
                Compliance isn’t solved in a single department. It’s solved across the institutions that move money, manage risk, and answer to regulators every day.
              </p>
              <p style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, lineHeight: 1.45, marginBottom: 20, textWrap: "pretty" }}>
                Our platform serves the full spectrum of Nigerian regulated institutions — from deposit money banks to fintechs, insurers, public agencies, and the audit practices that examine them.
              </p>
              <p style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, lineHeight: 1.45, textWrap: "pretty" }}>
                As the frontier of what regulation demands expands, so does the range of institutions that need one intelligent compliance system.
              </p>
            </div>

            <div style={{ marginTop: 64 }}>
              {ROWS.map((r) => (
                <ServeRow key={r.title} r={r} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
