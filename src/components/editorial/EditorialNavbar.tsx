import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/product", label: "Product" },
  { to: "/who-we-serve", label: "Who we serve" },
  { to: "/about", label: "About" },
  { to: "/security", label: "Security" },
];

export default function EditorialNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[var(--paper)]/85 backdrop-blur border-b border-ink-10" : "bg-transparent"
      }`}
    >
      <div className="container-editorial flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-2xl tracking-tight text-ink">
          Reg<span className="text-rust">Co</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-[13.5px] tracking-tight transition-colors ${
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/sign-in" className="text-[13.5px] text-ink-muted hover:text-ink transition-colors">
            Sign in
          </Link>
          <Link
            to="/book-demo"
            className="text-[13.5px] font-medium px-4 py-2 rounded-full bg-ink text-[var(--paper)] hover:bg-[var(--rust)] transition-colors"
          >
            Book a demo
          </Link>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--paper)] border-t border-ink-10 animate-fade-up">
          <div className="container-editorial py-6 flex flex-col gap-5">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-base text-ink">
                {l.label}
              </Link>
            ))}
            <div className="hairline pt-5 flex flex-col gap-3">
              <Link to="/sign-in" className="text-base text-ink-muted">Sign in</Link>
              <Link to="/book-demo" className="inline-block text-center text-sm font-medium px-4 py-2.5 rounded-full bg-ink text-[var(--paper)]">
                Book a demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
