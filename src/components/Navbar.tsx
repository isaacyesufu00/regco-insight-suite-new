import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "./BrandLogo";

const links = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "Reports", to: "/features/report-generation" },
  { label: "Pricing", to: "/#pricing" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Hero is dark on the homepage. Other pages have light backgrounds, so always use the solid style.
  const onHomepage = location.pathname === "/";
  const onDark = onHomepage && !scrolled;

  const navClasses = onDark
    ? "bg-transparent text-white"
    : "bg-background/85 backdrop-blur-xl text-foreground border-b border-border";

  const linkClasses = onDark
    ? "text-white/80 hover:text-white"
    : "text-muted-foreground hover:text-foreground";

  const handleAnchor = (e: React.MouseEvent, to: string) => {
    if (to.startsWith("/#") && location.pathname === "/") {
      e.preventDefault();
      const id = to.slice(2);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${navClasses}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-3 font-bold tracking-tight">
          <BrandLogo size={22} />
          <span className={`text-base ${onDark ? "text-white" : "text-foreground"}`}>RegCo</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={(e) => handleAnchor(e, l.to)}
              className={`text-sm font-medium transition-colors ${linkClasses}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={`rounded-none font-semibold border ${
              onDark
                ? "bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white"
                : "border-primary text-primary hover:bg-primary/10"
            }`}
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-none bg-gradient-brand text-white border-0 hover:opacity-90 font-semibold px-5"
          >
            <Link to="/book-demo">Get Started</Link>
          </Button>
        </div>

        <button
          className={`lg:hidden p-2 ${onDark ? "text-white" : "text-foreground"}`}
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
            className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl text-foreground"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={(e) => handleAnchor(e, l.to)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-border/40 mt-2">
                <Button asChild variant="outline" size="sm" className="rounded-none border-primary text-primary">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="rounded-none bg-gradient-brand text-white border-0 hover:opacity-90">
                  <Link to="/book-demo">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
