import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RegCoLogo from "@/components/RegCoLogo";

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

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

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
        background: scrolled ? "rgba(255,255,255,0.72)" : "transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.12)" : "1px solid transparent",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="container mx-auto flex items-center justify-between h-[44px] px-[22px]">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <RegCoLogo size="md" />
        </Link>

        {/* Center nav */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handlePricingClick(e, link.href)}
                className="text-[12px] font-normal transition-opacity ease-apple hover:opacity-65"
                style={{
                  color: "#1D1D1F",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Sign in (Apple blue link) */}
        <div className="hidden lg:flex items-center">
          <Link
            to="/login"
            className="text-[12px] font-normal transition-opacity ease-apple hover:opacity-65"
            style={{
              color: "#0066CC",
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2"
          style={{ color: "#1D1D1F" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "saturate(180%) blur(20px)",
              WebkitBackdropFilter: "saturate(180%) blur(20px)",
              borderColor: "rgba(0,0,0,0.12)",
            }}
          >
            <div className="container mx-auto px-[22px] py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => handlePricingClick(e, link.href)}
                  className="text-[15px] font-normal py-3"
                  style={{ color: "#1D1D1F" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="mt-3 text-[15px] font-normal text-center py-3"
                style={{
                  color: "#0066CC",
                }}
              >
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
