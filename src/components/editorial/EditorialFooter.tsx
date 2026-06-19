import { Link } from "react-router-dom";

const col = (title: string, items: { label: string; to: string }[]) => (
  <div>
    <p className="tag mb-4">{title}</p>
    <ul className="space-y-2.5">
      {items.map((i) => (
        <li key={i.label}>
          <Link to={i.to} className="text-[14px] text-ink-muted hover:text-ink transition-colors">
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function EditorialFooter() {
  return (
    <footer className="bg-[var(--paper)] border-t border-ink-10 pt-20 pb-10">
      <div className="container-editorial">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Link to="/" className="font-serif text-3xl text-ink">
              Reg<span className="text-rust">Co</span>
            </Link>
            <p className="mt-5 max-w-xs text-[14.5px] leading-relaxed text-ink-muted">
              Regulatory infrastructure for Nigerian financial institutions. Audit-ready returns, on time, every cycle.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {col("Product", [
              { label: "Overview", to: "/product" },
              { label: "Security", to: "/security" },
              { label: "Pricing", to: "/pricing" },
              { label: "Changelog", to: "/blog/updates" },
            ])}
            {col("Company", [
              { label: "About", to: "/about" },
              { label: "Who we serve", to: "/who-we-serve" },
              { label: "Partnerships", to: "/contact/partnerships" },
              { label: "Support", to: "/contact/support" },
            ])}
            {col("Resources", [
              { label: "Compliance guide", to: "/blog/compliance-guide" },
              { label: "CBN circulars", to: "/blog/cbn-circulars" },
              { label: "Book a demo", to: "/book-demo" },
            ])}
            {col("Legal", [
              { label: "Privacy", to: "/legal/privacy-policy" },
              { label: "Terms", to: "/legal/terms-of-service" },
              { label: "Data processing", to: "/legal/data-processing" },
              { label: "NDPC", to: "/legal/ndpc-compliance" },
            ])}
          </div>
        </div>

        <div className="hairline mt-16 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[12.5px] text-ink-muted">
            © {new Date().getFullYear()} RegCo. Headquartered in Abuja, Nigeria.
          </p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-ink-muted">
            Independent · Not affiliated with the CBN
          </p>
        </div>
      </div>
    </footer>
  );
}
