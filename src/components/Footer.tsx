import { Link } from "react-router-dom";
import { RegCoLogo } from "@/components/RegCoLogo";

const footerLinks: { label: string; to: string | null }[] = [
  { label: "Platform", to: "/#platform" },
  { label: "Reports", to: "/features/report-generation" },
  { label: "Pricing", to: "/#pricing" },
  { label: "Security", to: "/security" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy", to: "/privacy-policy" },
  { label: "Terms", to: "/terms" },
  { label: "Careers", to: null },
];

const Footer = () => (
  <footer className="bg-background border-t border-border">
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <Link to="/" aria-label="RegCo home">
          <RegCoLogo size={22} />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {footerLinks.map((l) =>
            l.to ? (
              <Link
                key={l.label}
                to={l.to}
                className="text-[14px] text-[#666] hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ) : (
              <span key={l.label} className="text-[14px] text-[#999] cursor-default">
                {l.label}
              </span>
            ),
          )}
        </nav>

        <span className="text-[14px] text-[#666]">Abuja, Nigeria</span>
      </div>
    </div>

    {/* Brand gradient hairline */}
    <div className="h-px w-full bg-brand-gradient opacity-80" />

    <div className="container mx-auto px-4 lg:px-8 py-5 text-center space-y-1">
      <p className="text-[13px] text-[#999]">
        © {new Date().getFullYear()} RegCo Technologies Limited. All rights reserved.
      </p>
      <p className="text-[12px] text-[#AAA]">
        RegCo is not affiliated with the Central Bank of Nigeria. All regulatory return formats are based on publicly available CBN guidelines.
      </p>
    </div>
  </footer>
);

export default Footer;
