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
      zIndex: 200,
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 48px",
      background: "#FFFFFF",
      borderBottom: "1px solid rgba(0,0,0,0.08)",
    }}
  >
    <Link
      to="/"
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 16,
        fontWeight: 700,
        color: "#0A0A0A",
        letterSpacing: "-0.3px",
        textDecoration: "none",
      }}
    >
      RegCo
    </Link>

    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {NAV.map((n) => (
        <Link
          key={n.label}
          to={n.href}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            color: "rgba(0,0,0,0.55)",
            textDecoration: "none",
            padding: "6px 14px",
            borderRadius: 6,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#0A0A0A")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.55)")}
        >
          {n.label}
        </Link>
      ))}
    </div>

    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <Link
        to="/login"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: "rgba(0,0,0,0.55)",
          textDecoration: "none",
        }}
      >
        Log in
      </Link>
      <Link
        to="/book-demo"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          fontWeight: 600,
          color: "#FFFFFF",
          background: "#0A0A0A",
          borderRadius: 7,
          padding: "8px 18px",
          textDecoration: "none",
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
    <footer
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        padding: "64px 48px 40px",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 56 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", margin: "0 0 12px", letterSpacing: "-0.3px" }}>RegCo</p>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", lineHeight: 1.65, maxWidth: 240, margin: 0 }}>
            AI compliance agent for licensed financial institutions.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.heading}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              {c.heading}
            </p>
            {c.links.map(([label, href]) => (
              <Link key={label} to={href} style={{ display: "block", fontSize: 13, color: "rgba(0,0,0,0.6)", textDecoration: "none", marginBottom: 10 }}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", margin: 0 }}>RegCo Technologies Limited · © 2026 · All rights reserved.</p>
        <p style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", margin: 0 }}>Built in our headquarters city.</p>
      </div>
    </footer>
  );
};
