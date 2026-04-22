import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

type FooterLink = { label: string; to: string | null };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Reports", to: "/features/report-generation" },
      { label: "Monitoring", to: "/features/monitoring" },
      { label: "Dashboard", to: "/features/dashboard" },
      { label: "Pricing", to: "/#pricing" },
    ],
  },
  {
    title: "Company",
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
  <footer className="bg-[#0A0A0A] text-white pt-20 pb-0">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <BrandLogo size={28} />
            <span className="font-bold text-base">RegCo Technologies</span>
          </div>
          <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
            AI-powered regulatory reporting infrastructure for Nigerian financial institutions.
          </p>
          <p className="mt-6 text-xs tracking-[0.3em] uppercase text-white/40">Abuja, Nigeria</p>
          <a
            href="mailto:hello@regco.ng"
            className="mt-1 block text-sm text-white/80 hover:text-white"
          >
            hello@regco.ng
          </a>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-white/40 cursor-default">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 h-[3px] w-full bg-gradient-brand" />
      <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/50">
        <p>© 2026 RegCo Technologies Limited. All rights reserved.</p>
        <p className="text-white/40 text-center md:text-right">
          RegCo is not affiliated with the Central Bank of Nigeria. Return formats follow publicly available CBN guidelines.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
