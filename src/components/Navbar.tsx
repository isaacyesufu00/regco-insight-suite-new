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
    const onScroll = () => setScrolled(window.scrollY > 60);
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

  // Text-shadow only when at top (no opaque navbar bg) for readability over imagery
  const textShadow = scrolled ? "none" : "0 1px 4px rgba(0,0,0,0.85)";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
      }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center" style={{ textShadow }}>
          <RegCoLogo dark size="md" />
        </Link>

        {/* Center pill nav */}
        <div className="hidden lg:flex items-center">
          <div
            className="flex items-center gap-7 px-6 py-1.5 rounded-full"
            style={{
              background: scrolled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handlePricingClick(e, link.href)}
                className="text-sm font-medium transition-colors ease-apple"
                style={{
                  color: "#ffffff",
                  textShadow,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Sign in pill — always visible border */}
        <div className="hidden lg:flex items-center">
          <Link
            to="/login"
            className="px-5 py-2 rounded-full text-sm font-medium transition-all ease-apple hover:scale-[1.03]"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              color: "#ffffff",
              textShadow,
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2"
          style={{ color: "#ffffff", textShadow }}
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
              background: "rgba(10,10,10,0.96)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <div className="container mx-auto px-4 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => handlePricingClick(e, link.href)}
                  className="text-sm font-medium py-3"
                  style={{ color: "#ffffff" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="mt-3 px-5 py-2.5 rounded-full text-sm font-medium text-center"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1.5px solid rgba(255,255,255,0.4)",
                  color: "#ffffff",
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
