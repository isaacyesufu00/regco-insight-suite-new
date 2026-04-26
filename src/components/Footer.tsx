import { Link } from "react-router-dom";
import RegCoLogo from "@/components/RegCoLogo";

type FooterLink = { label: string; to: string | null };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Report generation", to: "/features/report-generation" },
      { label: "Monitoring", to: "/features/monitoring" },
      { label: "Dashboard", to: "/features/dashboard" },
      { label: "Pricing", to: "/#pricing" },
    ],
  },
  {
    title: "About RegCo",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: null },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms", to: "/terms" },
      { label: "Security Policy", to: "/security" },
    ],
  },
];

const Footer = () => (
  <footer className="bg-[#F5F5F7] border-t" style={{ borderColor: "rgba(0,0,0,0.12)" }}>
    <div className="container mx-auto px-[22px] py-12">
      <div className="text-[12px] text-[#6E6E73]">
        Copyright © 2026 RegCo Technologies Limited. All rights reserved.
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <RegCoLogo size="md" />
        </div>
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
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-[12px] text-[#6E6E73] opacity-70 cursor-default">
                      {link.label}
                    </span>
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
          <Link to="/privacy-policy" className="hover:text-[#1D1D1F] transition-colors">
            Privacy Policy
          </Link>
          <span aria-hidden="true">|</span>
          <Link to="/terms" className="hover:text-[#1D1D1F] transition-colors">
            Terms
          </Link>
          <span aria-hidden="true">|</span>
          <Link to="/contact" className="hover:text-[#1D1D1F] transition-colors">
            Site Map
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
