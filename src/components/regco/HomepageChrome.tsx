import { Link } from "react-router-dom";

const NAV = [
  { label: "Product", href: "/product" },
  { label: "Security", href: "/security" },
  { label: "Who We Serve", href: "/who-we-serve" },
  { label: "Pricing", href: "/pricing" },
  { label: "Company", href: "/company" },
];

export const HomepageNavbar = () => (
  <nav
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 40px",
      height: 56,
      background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <Link to="/" style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", textDecoration: "none", letterSpacing: "-0.3px" }}>
      RegCo
    </Link>
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      {NAV.map((n) => (
        <Link
          key={n.label}
          to={n.href}
          style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", textDecoration: "none", letterSpacing: "-0.1px", transition: "color 0.15s" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#FFFFFF")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.65)")}
        >
          {n.label}
        </Link>
      ))}
    </div>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Link to="/login" style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", textDecoration: "none", padding: "0 4px" }}>
        Log in
      </Link>
      <Link
        to="/book-demo"
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#000000",
          background: "#FFFFFF",
          borderRadius: 6,
          padding: "8px 18px",
          textDecoration: "none",
          letterSpacing: "-0.1px",
        }}
      >
        Request Demo
      </Link>
    </div>
  </nav>
);

export const HomepageFooter = () => {
  const cols = [
    { heading: "Product", links: [["Agent", "/product"], ["Security", "/security"], ["Pricing", "/pricing"]] },
    { heading: "Company", links: [["About", "/company"], ["Who We Serve", "/who-we-serve"], ["Blog", "/blog/updates"]] },
    { heading: "Legal", links: [["Privacy", "/legal/privacy-policy"], ["Terms", "/legal/terms-of-service"], ["NDPC", "/legal/ndpc-compliance"]] },
    { heading: "Contact", links: [["Book a Demo", "/book-demo"], ["Support", "/contact/support"], ["Partnerships", "/contact/partnerships"]] },
  ] as const;
  return (
    <footer style={{ background: "#000000", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginBottom: 8 }}>RegCo</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.65, maxWidth: 220 }}>
            AI compliance agent for Nigerian licensed financial institutions.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.heading}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              {c.heading}
            </p>
            {c.links.map(([label, href]) => (
              <Link key={label} to={href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 10 }}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>RegCo Technologies Limited · © 2026 · All rights reserved.</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>Built in Abuja, Nigeria.</p>
      </div>
    </footer>
  );
};
