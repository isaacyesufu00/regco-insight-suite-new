import { Link } from "react-router-dom";

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
  <footer className="border-t border-border bg-muted/30 py-14">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <span className="text-lg font-bold font-display text-foreground">RegCo</span>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
            AI-powered regulatory reporting and compliance infrastructure for financial institutions.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-foreground mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground cursor-default">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-6 border-t border-border text-center space-y-2">
        <p className="text-sm text-muted-foreground">© 2026 RegCo. All rights reserved.</p>
        <p className="text-xs text-muted-foreground/70">
          RegCo is not affiliated with the Central Bank of Nigeria. All regulatory return formats are based on publicly available CBN guidelines.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
