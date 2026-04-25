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
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handlePricingClick = (e: React.MouseEvent, href: string) => {
    if (href === "/#pricing" && (location.pathname === "/" || location.hash === "#pricing")) {
      e.preventDefault();
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-black/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <RegCoLogo dark size="md" />
        </Link>

        {/* Center pill nav */}
        <div className="hidden lg:flex items-center">
          <div
            className="flex items-center gap-7 px-6 py-1.5 rounded-full border border-dark-soft"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={(e) => handlePricingClick(e, link.href)}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors ease-apple"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Sign in pill */}
        <div className="hidden lg:flex items-center">
          <Link
            to="/login"
            className="px-5 py-2 rounded-full text-sm font-medium transition-all ease-apple hover:scale-[1.03]"
            style={{
              background: "rgba(147,197,253,0.22)",
              border: "1px solid rgba(147,197,253,0.4)",
              color: "rgb(191,219,254)",
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-white"
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
            className="lg:hidden border-t border-dark-soft bg-surface-black"
          >
            <div className="container mx-auto px-4 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => handlePricingClick(e, link.href)}
                  className="text-sm font-medium text-white/70 hover:text-white py-3"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="mt-3 px-5 py-2.5 rounded-full text-sm font-medium text-center"
                style={{
                  background: "rgba(147,197,253,0.22)",
                  border: "1px solid rgba(147,197,253,0.4)",
                  color: "rgb(191,219,254)",
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
