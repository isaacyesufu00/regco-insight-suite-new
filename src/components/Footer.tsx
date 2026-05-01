import { Link } from "react-router-dom";

const columns = [
  {
    title: "About RegCo",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: null },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Report Generation", to: "/features/report-generation" },
      { label: "Monitoring", to: "/features/monitoring" },
      { label: "Dashboard", to: "/features/dashboard" },
      { label: "Data Sources", to: "/features/data-sources" },
      { label: "Pricing", to: "/#pricing" },
    ],
  },
  {
    title: "Reports",
    links: [
      { label: "MFB Return", to: null },
      { label: "CBN Forex", to: null },
      { label: "AML/CFT", to: null },
      { label: "NFIU", to: null },
      { label: "Prudential", to: null },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Security", to: "/security" },
    ],
  },
];

const Footer = () => (
  <footer style={{ background: "#F5F5F7", borderTop: "1px solid rgba(0,0,0,0.12)" }}>
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "48px 22px" }}>
      <p className="text-[12px] text-[#6E6E73]">
        Copyright © 2026 RegCo Technologies Limited. All rights reserved.
      </p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-[12px] font-semibold text-[#1D1D1F] mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-[12px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                      style={{ backgroundImage: "none" }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-[12px] text-[#6E6E73] opacity-70 cursor-default">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="mt-10 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[12px] text-[#6E6E73]"
        style={{ borderTop: "1px solid rgba(0,0,0,0.12)" }}
      >
        <div>Nigeria</div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link to="/privacy-policy" className="hover:text-[#1D1D1F] transition-colors" style={{ backgroundImage: "none" }}>Privacy Policy</Link>
          <span aria-hidden="true">|</span>
          <Link to="/terms" className="hover:text-[#1D1D1F] transition-colors" style={{ backgroundImage: "none" }}>Terms</Link>
          <span aria-hidden="true">|</span>
          <Link to="/contact" className="hover:text-[#1D1D1F] transition-colors" style={{ backgroundImage: "none" }}>Site Map</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
