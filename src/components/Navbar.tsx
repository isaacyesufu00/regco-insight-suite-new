import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { label: "Platform", href: "/features/report-generation" },
  { label: "Reports", href: "/features/monitoring" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePricingClick = (e: React.MouseEvent, href: string) => {
    if (href === "/#pricing" && (location.pathname === "/" || location.hash === "#pricing")) {
      e.preventDefault();
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: 44,
        background: scrolled ? "rgba(251,251,253,0.72)" : "rgba(251,251,253,0.72)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.12)",
        transition: "background 0.3s ease",
      }}
    >
      <div className="mx-auto flex items-center justify-between h-full" style={{ maxWidth: 980, padding: "0 22px" }}>
        <Link
          to="/"
          className="text-[18px] font-semibold text-[#1D1D1F] leading-none"
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", backgroundImage: "none" }}
        >
          RegCo
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={(e) => handlePricingClick(e, link.href)}
              className="text-[12px] font-normal text-[#1D1D1F] transition-opacity duration-200 hover:opacity-[0.65]"
              style={{ backgroundImage: "none" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center">
          <Link
            to="/login"
            className="text-[12px] font-normal text-[#0066CC] transition-opacity duration-200 hover:opacity-[0.65]"
            style={{ backgroundImage: "none" }}
          >
            Sign in
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-[#1D1D1F]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden"
            style={{
              background: "rgba(251,251,253,0.92)",
              backdropFilter: "saturate(180%) blur(20px)",
              WebkitBackdropFilter: "saturate(180%) blur(20px)",
              borderTop: "1px solid rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ maxWidth: 980, margin: "0 auto", padding: "20px 22px" }} className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => handlePricingClick(e, link.href)}
                  className="text-[15px] font-normal text-[#1D1D1F] py-3"
                  style={{ backgroundImage: "none" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/login" className="mt-3 text-[15px] font-normal text-[#0066CC] text-center py-3" style={{ backgroundImage: "none" }}>
                Sign in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
