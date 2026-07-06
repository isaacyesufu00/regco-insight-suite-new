import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Reports", href: "#reports" },
  { label: "Who We Serve", href: "#who-we-serve" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    const ids = ["platform", "reports", "who-we-serve", "pricing", "about"];
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

  // Determine if we're in the hero zone (dark-transparent nav)
  const isHome = location.pathname === "/";
  const inHero = isHome && !scrolled;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        height: 44,
        padding: "0 22px",
        background: inHero
          ? "rgba(0,0,0,0)"
          : "rgba(255,255,255,0.72)",
        backdropFilter: inHero ? "none" : "saturate(180%) blur(20px)",
        WebkitBackdropFilter: inHero ? "none" : "saturate(180%) blur(20px)",
        borderBottom: inHero ? "none" : "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-full">
        <Link
          to="/"
          style={{
            fontWeight: 600,
            fontSize: 18,
            color: inHero ? "#1D1D1F" : "#1D1D1F",
            textDecoration: "none",
          }}
        >
          RegCo<span style={{ color: "#CA0101" }}>.</span>
        </Link>

        {/* Center pill */}
        <div
          className="hidden md:flex items-center gap-6 relative"
          style={{
            background: inHero ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.06)",
            borderRadius: 980,
            padding: "5px 20px",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleAnchor(e, link.href)}
              className="relative"
              style={{
                fontWeight: 400,
                fontSize: 13,
                color: inHero ? "#1D1D1F" : "#1D1D1F",
                textDecoration: "none",
                padding: "4px 0",
                zIndex: 1,
              }}
            >
              {link.label}
              {activeSection === link.href && (
                <motion.div
                  layoutId="nav-pill-indicator"
                  className="absolute -inset-x-2 -inset-y-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.85)", zIndex: -1 }}
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
              fontWeight: 400,
              fontSize: 13,
              color: "#0066CC",
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} color="#1D1D1F" /> : <Menu size={20} color="#1D1D1F" />}
        </button>
      </div>

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
