import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const products = [
  { to: "/product/automated-returns",      name: "Automated Returns",      desc: "End-to-end CBN & NFIU filing" },
  { to: "/product/live-screening",         name: "Live Client Screening",  desc: "BVN, NIN, sanctions, PEP, adverse media" },
  { to: "/product/transaction-monitoring", name: "Transaction Monitoring", desc: "Near-real-time fraud & AML detection" },
  { to: "/product/audit-trail",            name: "Audit Trail & Case Mgmt", desc: "Chain of custody, case workflow" },
];

const links = [
  { to: "/who-we-serve", label: "Who we serve" },
  { to: "/pricing",      label: "Pricing" },
  { to: "/docs",         label: "Docs" },
  { to: "/about",        label: "About" },
];

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setProductsOpen(false); }, [pathname, hash]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled ? "bg-white/90 backdrop-blur border-b border-[var(--line)]" : "bg-transparent"
      }`}
    >
      <div className="container-site flex items-center justify-between h-14">
        <Link to="/" className="text-[18px] font-semibold tracking-tight text-ink">
          RegCo<span style={{ color: "#CA0101" }}>.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[14px]">
          <div ref={productsRef} className="relative">
            <button
              onClick={() => setProductsOpen((p) => !p)}
              className="inline-flex items-center gap-1 text-ink-3 hover:text-ink transition-colors"
            >
              Products <ChevronDown size={13} strokeWidth={2} />
            </button>
            {productsOpen && (
              <div className="absolute left-0 top-full mt-2 w-[360px] bg-white border border-[var(--line)] rounded-lg p-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                {products.map((p) => (
                  <Link
                    key={p.name}
                    to={p.to}
                    className="block px-3 py-2.5 rounded-md hover:bg-[#F5F5F5] transition-colors"
                  >
                    <div className="text-[13.5px] text-ink font-medium">{p.name}</div>
                    <div className="text-[12px] text-ink-3 mt-0.5">{p.desc}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `transition-colors ${isActive ? "text-ink" : "text-ink-3 hover:text-ink"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/sign-in" className="h-9 px-3 inline-flex items-center text-[14px] text-ink-3 hover:text-ink transition-colors">
            Sign in
          </Link>
          <Link
            to="/book-demo"
            className="h-9 px-4 inline-flex items-center rounded-full bg-ink text-white text-[14px] font-medium hover:bg-[#262626] transition-colors"
          >
            Book a demo
          </Link>
        </div>

        <button className="md:hidden p-2 -mr-2 text-ink" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[var(--line)] animate-fade-up">
          <div className="container-site py-5 flex flex-col gap-1 text-[15px]">
            <p className="tag mb-1">Products</p>
            {products.map((p) => (
              <Link key={p.name} to={p.to} className="py-2 text-ink">{p.name}</Link>
            ))}
            <div className="hairline mt-3 pt-3 flex flex-col gap-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="py-2 text-ink">{l.label}</Link>
              ))}
            </div>
            <div className="hairline mt-3 pt-4 flex flex-col gap-2">
              <Link to="/sign-in" className="text-ink-3">Sign in</Link>
              <Link to="/book-demo" className="inline-flex h-10 px-4 items-center justify-center rounded-full bg-ink text-white text-[14px] font-medium">
                Book a demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
