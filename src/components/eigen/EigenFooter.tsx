import { Link } from "react-router-dom";

const cols: { title: string; links: { label: string; to: string }[] }[] = [
  { title: "BLOG", links: [
    { label: "Updates", to: "/blog/updates" },
    { label: "Compliance Guide", to: "/blog/compliance-guide" },
    { label: "CBN Circulars", to: "/blog/cbn-circulars" },
  ]},
  { title: "LEGAL", links: [
    { label: "Privacy Policy", to: "/legal/privacy-policy" },
    { label: "Terms of Service", to: "/legal/terms-of-service" },
    { label: "Data Processing", to: "/legal/data-processing" },
    { label: "NDPC Compliance", to: "/legal/ndpc-compliance" },
  ]},
  { title: "CONTACT", links: [
    { label: "Book a Demo", to: "/book-demo" },
    { label: "Support", to: "/contact/support" },
    { label: "Partnerships", to: "/contact/partnerships" },
  ]},
];

const EigenFooter = () => (
  <footer style={{ background: "#F5F5F0", borderTop: "1px solid rgba(0,0,0,0.07)", padding: "48px 0 0" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>RegCo<span style={{color:"#CA0101"}}>.</span></p>
          <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6, maxWidth: 240 }}>
            Automated regulatory reporting for licensed financial institutions.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <a href="#" style={{ fontSize: 13, color: "#9B9B9B", textDecoration: "none" }}>𝕏</a>
            <a href="#" style={{ fontSize: 13, color: "#9B9B9B", textDecoration: "none" }}>in</a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1A1A1A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
              {c.title}
            </p>
            {c.links.map((l) => (
              <p key={l.label} style={{ margin: "0 0 8px" }}>
                <Link to={l.to} style={{ fontSize: 13, color: "#6B6B6B", textDecoration: "none" }}>{l.label}</Link>
              </p>
            ))}
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <p style={{ fontSize: 12, color: "#9B9B9B", margin: 0 }}>RegCo Technologies Limited · © 2026 · All rights reserved.</p>
        <p style={{ fontSize: 12, color: "#9B9B9B", margin: 0 }}>Built in our headquarters city.</p>
      </div>
    </div>

    <div style={{ width: "100%", overflow: "hidden", marginTop: 0, lineHeight: 0.85, userSelect: "none", pointerEvents: "none" }}>
      <p
        style={{
          fontSize: "clamp(120px, 18vw, 280px)",
          fontWeight: 800,
          color: "transparent",
          WebkitTextStroke: "1px rgba(0,0,0,0.22)",
          letterSpacing: "-8px",
          margin: 0,
          padding: "0 24px",
          lineHeight: 0.85,
          whiteSpace: "nowrap",
          fontFamily: "Inter, -apple-system, sans-serif",
        }}
      >
        RegCo
      </p>
    </div>
  </footer>
);

export default EigenFooter;
