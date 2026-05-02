import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (location.pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection("#" + entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    const ids = ["platform", "features", "pricing", "about"];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const handleAnchor = (e: React.MouseEvent, href: string) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(href.replace("#", ""));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: 44,
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-full px-6">
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 18,
            color: "#1D1D1F",
            textDecoration: "none",
          }}
        >
          RegCo
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-7 relative">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleAnchor(e, link.href)}
              className="relative"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: 12,
                color: "#1D1D1F",
                textDecoration: "none",
                padding: "12px 0",
              }}
            >
              {link.label}
              {activeSection === link.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: "#1D1D1F" }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:block">
          <Link
            to="/login"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: 12,
              color: "#0066CC",
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} color="#1D1D1F" /> : <Menu size={20} color="#1D1D1F" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { handleAnchor(e, link.href); setMobileOpen(false); }}
                  style={{ display: "block", fontSize: 14, color: "#1D1D1F", textDecoration: "none" }}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                style={{ display: "block", fontSize: 14, color: "#0066CC", textDecoration: "none", marginTop: 8 }}
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
