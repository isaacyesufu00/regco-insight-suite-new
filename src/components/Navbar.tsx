import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const useCasesDropdown = [
  { label: "MFBs & Community Banks", href: "/use-cases/mfb" },
  { label: "Commercial Banks", href: "/use-cases/commercial" },
  { label: "Finance Companies", href: "/use-cases/finance" },
  { label: "Compliance Teams", href: "/use-cases/compliance" },
];

const featuresDropdown = [
  { label: "Report Generation", href: "/features/report-generation" },
  { label: "Monitoring", href: "/features/monitoring" },
  { label: "Transcription", href: "/features/transcription" },
  { label: "Dashboard", href: "/features/dashboard" },
  { label: "Data Sources", href: "/features/data-sources" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleDropdownEnter = (name: string) => {
    clearTimeout(dropdownTimeout.current);
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [location]);

  const handlePricingClick = (e: React.MouseEvent) => {
    if (location.pathname === "/" || location.pathname === "/#pricing") {
      e.preventDefault();
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold font-display text-foreground tracking-tight flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          RegCo
        </Link>

        {/* Center nav links */}
        <div className="hidden lg:flex items-center gap-7">
          {/* Use Cases dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("usecases")}
            onMouseLeave={handleDropdownLeave}
          >
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Use Cases <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === "usecases" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openDropdown === "usecases" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-border bg-background shadow-lg py-2"
                >
                  {useCasesDropdown.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Features dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("features")}
            onMouseLeave={handleDropdownLeave}
          >
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Features <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === "features" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openDropdown === "features" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-border bg-background shadow-lg py-2"
                >
                  {featuresDropdown.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/#pricing"
            onClick={handlePricingClick}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>

          <Link
            to="/security"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Security Policy
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Login
          </Link>
          <Button asChild size="sm" className="rounded-full px-5 font-medium hover:scale-[1.02] transition-transform">
            <Link to="/book-demo">Book a Demo</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
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
            className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {/* Use Cases collapsible */}
              <button
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 flex items-center justify-between"
                onClick={() => setOpenDropdown(openDropdown === "m-usecases" ? null : "m-usecases")}
              >
                Use Cases <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === "m-usecases" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "m-usecases" && (
                <div className="pl-4 flex flex-col gap-1 mb-2">
                  {useCasesDropdown.map((item) => (
                    <Link key={item.href} to={item.href} className="text-sm text-muted-foreground hover:text-foreground py-1.5" onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Features collapsible */}
              <button
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 flex items-center justify-between"
                onClick={() => setOpenDropdown(openDropdown === "m-features" ? null : "m-features")}
              >
                Features <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === "m-features" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "m-features" && (
                <div className="pl-4 flex flex-col gap-1 mb-2">
                  {featuresDropdown.map((item) => (
                    <Link key={item.href} to={item.href} className="text-sm text-muted-foreground hover:text-foreground py-1.5" onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <Link to="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground py-2" onClick={() => { setMobileOpen(false); }}>
                Pricing
              </Link>
              <Link to="/security" className="text-sm font-medium text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileOpen(false)}>
                Security Policy
              </Link>
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileOpen(false)}>
                About
              </Link>

              <div className="flex flex-col gap-2 pt-3 border-t border-border/50">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/book-demo" onClick={() => setMobileOpen(false)}>Book a Demo</Link>
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
