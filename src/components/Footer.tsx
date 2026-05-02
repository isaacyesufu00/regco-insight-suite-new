import { Link } from "react-router-dom";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Dashboard", href: "#platform" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Reports",
    links: [
      { label: "MFB Returns", href: "#features" },
      { label: "CBN Forex", href: "#features" },
      { label: "AML/CFT", href: "#features" },
      { label: "Prudential", href: "#features" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "Compliance", href: "#features" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Book Demo", href: "/book-demo" },
      { label: "Help Centre", href: "/contact" },
      { label: "Status", href: "#" },
    ],
  },
];

const Footer = () => (
  <footer style={{ background: "#F5F5F7", borderTop: "1px solid rgba(0,0,0,0.1)", padding: "40px 0" }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <p style={{ fontSize: 12, color: "#6E6E73" }}>
        Copyright © 2026 RegCo Technologies Limited. All rights reserved.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
        {columns.map((col) => (
          <div key={col.title}>
            <p style={{ fontSize: 12, color: "#1D1D1F", fontWeight: 600, marginBottom: 8 }}>{col.title}</p>
            {col.links.map((link) => (
              <div key={link.label} className="mb-1">
                {link.href.startsWith("/") ? (
                  <Link to={link.href} style={{ fontSize: 12, color: "#6E6E73", textDecoration: "none" }}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} style={{ fontSize: 12, color: "#6E6E73", textDecoration: "none" }}>
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <span style={{ fontSize: 12, color: "#6E6E73" }}>Nigeria</span>
        <div className="flex gap-4">
          {[
            { label: "Privacy", to: "/privacy-policy" },
            { label: "Terms", to: "/terms" },
            { label: "Contact", to: "/contact" },
          ].map((l) => (
            <Link key={l.label} to={l.to} style={{ fontSize: 12, color: "#6E6E73", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
