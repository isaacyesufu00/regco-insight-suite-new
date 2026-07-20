import { Link } from "react-router-dom";

/* =========================================================
   Shared homepage design tokens + Nav + Footer
   Used by the focused set of footer-linked marketing pages.
   Mirrors RegcoHome.tsx exactly (canvas #F8F8F3, Inter + serif,
   #000000CC ink, 6x16 accent bars).
   ========================================================= */

export const T = {
  canvas: "#F8F8F3",
  ink: "#000000",
  inkCC: "#000000CC",
  ink99: "#00000099",
  ink8C: "#0000008C",
  inkB3: "#000000B3",
  ink66: "#00000066",
  ink26: "#00000026",
  ink14: "#00000014",
  ink0F: "#0000000F",
  inkE6: "#000000E6",
  canvasTone: "#F8F8F3",
  red: "#C8102E",
};

export const SANS = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
export const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

export const MAX = 1136;
export const NARROW = 688;

export const LightChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    background: T.ink0F, borderRadius: 999, padding: "7px 12px",
    fontFamily: SANS, fontSize: 14, fontWeight: 500, color: T.inkCC, lineHeight: 1,
  }}>{children}</span>
);

export const DarkPill: React.FC<{ children: React.ReactNode; to?: string }> = ({ children, to }) => {
  const style: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    height: 32, padding: "0 14px", borderRadius: 999,
    background: T.inkE6, color: T.canvasTone, fontFamily: SANS,
    fontSize: 14, fontWeight: 500, lineHeight: 1, textDecoration: "none",
    border: "none", cursor: "pointer",
  };
  return to ? <Link to={to} style={style}>{children}</Link> : <a style={style}>{children}</a>;
};

export function MarketingNav() {
  const links = [
    { l: "Home", to: "/" },
    { l: "Product", to: "/product" },
    { l: "Who we serve", to: "/who-we-serve" },
    { l: "Docs", to: "/docs" },
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
        .regco-nav-link:hover .regco-underline { transform: scaleX(1); }
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
          <DarkPill to="/book-demo">Book a demo</DarkPill>
        </div>
      </div>
    </div>
  );
}

export function MarketingFooter() {
  const cols = [
    { h: "Platform", items: [
      { l: "Overview", to: "/product" },
      { l: "Fraud Detection", to: "/fraud-detection" },
      { l: "Identity Screening", to: "/identity-screening" },
      { l: "Audit & Governance", to: "/audit-governance" },
      { l: "Regulatory Reporting", to: "/regulatory-reporting" },
      { l: "AI Compliance Brain", to: "/ai-compliance-brain" },
    ] },
    { h: "Company", items: [
      { l: "About", to: "/about" },
      { l: "Customers", to: "/customers" },
      { l: "Pricing", to: "/pricing" },
      { l: "Careers", to: "/careers" },
      { l: "Contact", to: "/contact" },
    ] },
    { h: "Resources", items: [
      { l: "Documentation", to: "/docs" },
      { l: "Knowledge Base", to: "/knowledge-base" },
      { l: "Compliance Guides", to: "/blog/compliance-guide" },
      { l: "Blog", to: "/blog/updates" },
      { l: "Platform Updates", to: "/blog/updates" },
    ] },
    { h: "Legal", items: [
      { l: "Privacy Policy", to: "/legal/privacy-policy" },
      { l: "Terms of Service", to: "/legal/terms-of-service" },
      { l: "Security", to: "/security" },
      { l: "Data Processing Agreement", to: "/legal/data-processing" },
      { l: "Responsible AI", to: "/legal/ndpc-compliance" },
    ] },
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
                    <Link key={i.l} to={i.to} style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, fontWeight: 500, lineHeight: 1.43, textDecoration: "none" }}>{i.l}</Link>
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

/* ---------- reusable section atoms ---------- */
export const AccentBar: React.FC<{ color?: string }> = ({ color = T.red }) => (
  <span style={{ width: 6, height: 16, background: color, display: "inline-block", flexShrink: 0 }} />
);

export const SectionHeading: React.FC<{ kicker?: string; title: string }> = ({ kicker, title }) => (
  <div>
    {kicker && <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, lineHeight: 1.45, marginBottom: 16 }}>{kicker}</div>}
    <div style={{ color: T.inkCC, fontFamily: SERIF, fontSize: 28, letterSpacing: "-0.28px", lineHeight: 1.15, textWrap: "balance" }}>{title}</div>
  </div>
);

export const Para: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <p style={{ color: T.ink99, fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: 1.45, marginTop: 16, marginBottom: 0, textWrap: "pretty", ...style }}>{children}</p>
);

export const FeatureRow: React.FC<{ title: string; body: string; bar?: string }> = ({ title, body, bar }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, paddingBlock: 24 }}>
    <AccentBar color={bar} />
    <div>
      <div style={{ color: T.inkCC, fontFamily: SANS, fontSize: 18, fontWeight: 600, lineHeight: 1.45 }}>{title}</div>
      <Para style={{ fontSize: 16 }}>{body}</Para>
    </div>
  </div>
);

export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: T.canvas, color: T.ink, fontFamily: SANS, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <MarketingNav />
    <div style={{ flexGrow: 1 }}>{children}</div>
    <MarketingFooter />
  </div>
);

export const PageHero: React.FC<{ kicker: string; title: string; sub: string }> = ({ kicker, title, sub }) => (
  <div style={{ paddingTop: 80, paddingBottom: 48 }}>
    <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16 }}>
      <div style={{ color: T.ink66, fontFamily: SANS, fontSize: 14, fontWeight: 500 }}>{kicker}</div>
      <div style={{ color: T.inkCC, fontFamily: SERIF, fontSize: 40, letterSpacing: "-0.4px", lineHeight: 1.08, marginTop: 16, textWrap: "balance" }}>{title}</div>
      <Para style={{ marginTop: 20 }}>{sub}</Para>
    </div>
  </div>
);

export const ProseSection: React.FC<{ id?: string; heading: string; children: React.ReactNode }> = ({ id, heading, children }) => (
  <div id={id} style={{ paddingBlock: 32, scrollMarginTop: 96 }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
      <AccentBar />
      <div>
        <div style={{ color: T.inkCC, fontFamily: SERIF, fontSize: 24, letterSpacing: "-0.24px", lineHeight: 1.15, textWrap: "balance" }}>{heading}</div>
        <div style={{ marginTop: 8 }}>{children}</div>
      </div>
    </div>
  </div>
);

export const DataRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, paddingBlock: 12, borderBottom: `1px solid ${T.ink14}` }}>
    <span style={{ color: T.ink99, fontFamily: SANS, fontSize: 15, lineHeight: 1.45 }}>{label}</span>
    <span style={{ color: T.inkCC, fontFamily: SANS, fontSize: 15, fontWeight: 600, lineHeight: 1.45, textAlign: "right" }}>{value}</span>
  </div>
);

export const List: React.FC<{ items: string[] }> = ({ items }) => (
  <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0 }}>
    {items.map((it) => (
      <li key={it} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBlock: 6 }}>
        <span style={{ width: 6, height: 6, background: T.inkCC, borderRadius: 999, flexShrink: 0, marginTop: 8 }} />
        <span style={{ color: T.ink99, fontFamily: SANS, fontSize: 16, fontWeight: 500, lineHeight: 1.45 }}>{it}</span>
      </li>
    ))}
  </ul>
);

export const TierCard: React.FC<{
  name: string; price: string; cycle: string; body: string;
  features: string[]; cta: string; to: string; featured?: boolean;
}> = ({ name, price, cycle, body, features, cta, to, featured }) => (
  <div style={{
    padding: 28, borderRadius: 8,
    border: `1px solid ${featured ? T.ink : T.ink14}`,
    background: "#FFFFFF",
    display: "flex", flexDirection: "column",
  }}>
    <div style={{ color: T.ink66, fontFamily: SANS, fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>{name}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 12 }}>
      <span style={{ color: T.inkCC, fontFamily: SANS, fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}>{price}</span>
      <span style={{ color: T.ink66, fontFamily: SANS, fontSize: 14 }}>{cycle}</span>
    </div>
    <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, lineHeight: 1.5, marginTop: 12 }}>{body}</div>
    <ul style={{ listStyle: "none", margin: "20px 0 0", padding: 0, flex: 1 }}>
      {features.map((f) => (
        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBlock: 6 }}>
          <span style={{ width: 6, height: 6, background: T.red, borderRadius: 999, flexShrink: 0, marginTop: 8 }} />
          <span style={{ color: T.inkCC, fontFamily: SANS, fontSize: 14, lineHeight: 1.5 }}>{f}</span>
        </li>
      ))}
    </ul>
    <Link to={to} style={{
      marginTop: 24, height: 40, display: "inline-flex", alignItems: "center", justifyContent: "center",
      borderRadius: 999, fontFamily: SANS, fontSize: 14, fontWeight: 500, textDecoration: "none",
      background: featured ? T.inkE6 : "transparent", color: featured ? T.canvasTone : T.inkCC,
      border: featured ? "none" : `1px solid ${T.ink26}`,
    }}>{cta}</Link>
  </div>
);
