import { Link } from "react-router-dom";
import { AnimateIn } from "./AnimateIn";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Reports", href: "#reports" },
      { label: "Dashboard", href: "#platform" },
      { label: "Compliance Mail", href: "#platform" },
      { label: "Data Sources", href: "#platform" },
      { label: "Calendar", href: "#platform" },
    ],
  },
  {
    title: "Reports",
    links: [
      { label: "MFB Regulatory Return", href: "#reports" },
      { label: "CBN Forex Return", href: "#reports" },
      { label: "AML/CFT Report", href: "#reports" },
      { label: "SCUML Return", href: "#reports" },
      { label: "NFIU Return", href: "#reports" },
    ],
  },
  {
    title: "Who We Serve",
    links: [
      { label: "Microfinance Banks", href: "#who-we-serve" },
      { label: "Commercial Banks", href: "#who-we-serve" },
      { label: "Primary Mortgage Banks", href: "#who-we-serve" },
      { label: "Finance Companies", href: "#who-we-serve" },
      { label: "Fintechs", href: "#who-we-serve" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About RegCo", href: "#about" },
      { label: "Our Mission", href: "#about" },
      { label: "Book a Demo", href: "/book-demo" },
      { label: "Contact Us", href: "/contact" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "NDPC Compliance", href: "/security" },
      { label: "Data Processing Agreement", href: "/privacy-policy" },
      { label: "Security", href: "/security" },
    ],
  },
];

const credentials = ["NDPC Registered", "CBN Compliant", "256-bit Encrypted", "NDIC Approved Vendor"];

const Footer = () => (
  <footer style={{ background: "#F5F5F7" }}>
    {/* Row 1 — Navigation columns */}
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "48px 22px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 24 }}>
        {/* Brand column */}
        <AnimateIn delay={0}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 17, color: "#1D1D1F", marginBottom: 12 }}>RegCo</p>
            <p style={{ fontSize: 13, color: "#6E6E73", lineHeight: 1.7, maxWidth: 220 }}>
              Automated regulatory compliance for every licensed financial institution in Nigeria. CBN. NFIU. SCUML. NDIC. FIRS.
            </p>
          </div>
        </AnimateIn>

        {columns.map((col, i) => (
          <AnimateIn key={col.title} delay={(i + 1) * 0.08}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 12, color: "#1D1D1F", marginBottom: 10 }}>{col.title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map((link) => (
                  link.href.startsWith("/") ? (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="hover:text-[#0066CC]"
                      style={{ fontSize: 12, color: "#6E6E73", textDecoration: "none", transition: "color 0.15s" }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="hover:text-[#0066CC]"
                      style={{ fontSize: 12, color: "#6E6E73", textDecoration: "none", transition: "color 0.15s" }}
                    >
                      {link.label}
                    </a>
                  )
                ))}
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>
    </div>

    {/* Row 2 — Divider */}
    <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }} />

    {/* Row 3 — Credentials bar */}
    <div style={{ background: "#EBEBEB" }}>
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "16px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {credentials.map((c) => (
            <span
              key={c}
              style={{
                background: "rgba(0,0,0,0.06)",
                borderRadius: 980,
                padding: "5px 14px",
                fontSize: 12,
                color: "#6E6E73",
              }}
            >
              {c}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "#6E6E73" }}>🇳🇬 Nigeria</span>
      </div>
    </div>

    {/* Row 4 — Legal bottom bar */}
    <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "16px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 12, color: "#86868B" }}>
          Copyright © 2026 RegCo Technologies Limited. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 4, fontSize: 12, color: "#86868B" }}>
          {[
            { label: "Privacy Policy", to: "/privacy-policy" },
            { label: "Terms of Service", to: "/terms" },
            { label: "Site Map", to: "#" },
            { label: "Contact", to: "/contact" },
          ].map((l, i, arr) => (
            <span key={l.label}>
              <Link to={l.to} className="hover:text-[#0066CC]" style={{ color: "#86868B", textDecoration: "none", transition: "color 0.15s" }}>
                {l.label}
              </Link>
              {i < arr.length - 1 && " · "}
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
