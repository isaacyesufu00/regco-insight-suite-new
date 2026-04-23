import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RegCoLogo } from "@/components/RegCoLogo";

const navLinks = [
  { label: "Platform", href: "/#platform" },
  { label: "Reports", href: "/features/report-generation" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
  { label: "Security", href: "/security" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleAnchor = (href: string, e: React.MouseEvent) => {
    if (href.startsWith("/#") && location.pathname === "/") {
      e.preventDefault();
      const id = href.substring(2);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-[8px] transition-colors duration-300 ${
        scrolled ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" aria-label="RegCo home">
          <RegCoLogo size={22} />
        </Link>

        {/* Centered desktop nav */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={(e) => handleAnchor(link.href, e)}
              className="text-[14px] font-medium text-[#333] hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right action */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full border border-foreground bg-transparent text-foreground text-[14px] font-medium px-5 py-2 transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            Sign In
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
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
            className="lg:hidden border-t border-border bg-background"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => handleAnchor(link.href, e)}
                  className="py-2 text-[14px] font-medium text-[#333]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="mt-3 inline-flex items-center justify-center rounded-full border border-foreground text-foreground text-[14px] font-medium px-5 py-2"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
