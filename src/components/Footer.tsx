import { Link } from "react-router-dom";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Dashboard", href: "#platform" },
      { label: "How It Works", href: "#platform" },
      { label: "Features", href: "#features" },
      { label: "Create Report", href: "#platform" },
    ],
  },
  {
    title: "Reports",
    links: [
      { label: "MFB Returns", href: "#reports" },
      { label: "CBN Forex", href: "#reports" },
      { label: "AML/CFT", href: "#reports" },
      { label: "NFIU Returns", href: "#reports" },
    ],
  },
  {
    title: "Who We Serve",
    links: [
      { label: "Microfinance Banks", href: "#who-we-serve" },
      { label: "Commercial Banks", href: "#who-we-serve" },
      { label: "Mortgage Banks", href: "#who-we-serve" },
      { label: "Fintechs", href: "#who-we-serve" },
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
  <footer style={{ background: "#F5F5F7", borderTop: "1px solid rgba(0,0,0,0.1)", padding: "40px 22px" }}>
    <div className="max-w-[1200px] mx-auto">
      <p style={{ fontSize: 12, color: "#6E6E73" }}>
        Copyright © 2026 RegCo Technologies Limited. All rights reserved.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-8">
        {columns.map((col) => (
          <div key={col.title}>
            <p style={{ fontSize: 12, color: "#1D1D1F", fontWeight: 700, marginBottom: 8 }}>{col.title}</p>
            {col.links.map((link) => (
              <div key={link.label} className="mb-1">
                {link.href.startsWith("/") ? (
                  <Link to={link.href} className="hover:text-[#0066CC] transition-colors" style={{ fontSize: 12, color: "#6E6E73", textDecoration: "none" }}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} className="hover:text-[#0066CC] transition-colors" style={{ fontSize: 12, color: "#6E6E73", textDecoration: "none" }}>
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <span style={{ fontSize: 12, color: "#6E6E73" }}>Abuja, Nigeria · NDPC Registered</span>
        <div className="flex gap-4">
          {[
            { label: "Privacy Policy", to: "/privacy-policy" },
            { label: "Terms of Service", to: "/terms" },
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
