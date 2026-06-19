import { Link } from "react-router-dom";

const col = (title: string, items: { label: string; to: string }[]) => (
  <div>
    <p className="tag mb-4">{title}</p>
    <ul className="space-y-2.5">
      {items.map((i) => (
        <li key={i.label}>
          <Link to={i.to} className="text-[13.5px] text-ink-3 hover:text-ink transition-colors">
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-[var(--line)] pt-16 pb-10">
      <div className="container-site">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Link to="/" className="text-[18px] font-semibold text-ink">RegCo</Link>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-ink-3">
              Regulatory infrastructure for Nigerian financial institutions. Returns, screening, monitoring, and audit — in one system.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {col("Products", [
              { label: "Automated Returns",      to: "/product#returns" },
              { label: "Client Screening",       to: "/product#screening" },
              { label: "Transaction Monitoring", to: "/product#monitoring" },
              { label: "Audit & Case Mgmt",      to: "/product#audit" },
            ])}
            {col("Company", [
              { label: "About",         to: "/about" },
              { label: "Who we serve",  to: "/who-we-serve" },
              { label: "Pricing",       to: "/pricing" },
              { label: "Partnerships",  to: "/contact/partnerships" },
            ])}
            {col("Resources", [
              { label: "Compliance guide", to: "/blog/compliance-guide" },
              { label: "CBN circulars",    to: "/blog/cbn-circulars" },
              { label: "Support",          to: "/contact/support" },
              { label: "Book a demo",      to: "/book-demo" },
            ])}
            {col("Legal", [
              { label: "Privacy",         to: "/legal/privacy-policy" },
              { label: "Terms",           to: "/legal/terms-of-service" },
              { label: "Data processing", to: "/legal/data-processing" },
              { label: "NDPC",            to: "/legal/ndpc-compliance" },
            ])}
          </div>
        </div>

        <div className="hairline mt-14 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[12px] text-ink-3">© {new Date().getFullYear()} RegCo. Abuja, Nigeria.</p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-ink-3 font-mono">
            Independent · Not affiliated with the CBN
          </p>
        </div>
      </div>
    </footer>
  );
}
