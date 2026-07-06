import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const navItems = [
  { label: "FEATURES", href: "#features" },
  { label: "REPORTS", href: "#reports" },
  { label: "WHO WE SERVE", href: "#who-we-serve" },
  { label: "PRICING", href: "#pricing" },
  { label: "ABOUT", href: "#about" },
];

const EigenNavbar = () => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const ids = ["features", "reports", "who-we-serve", "pricing", "about"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 52,
        background: "rgba(245,245,240,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
      }}
    >
      <Link to="/" style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", textDecoration: "none" }}>
        RegCo<span style={{ color: "#CA0101" }}>.</span>
      </Link>

      <div style={{ display: "flex", gap: 28 }}>
        {navItems.map((n) => {
          const active = activeSection === n.href.slice(1);
          return (
            <a
              key={n.label}
              href={n.href}
              onClick={(e) => handleNavClick(e, n.href)}
              style={{
                fontSize: 12,
                color: active ? "#1A1A1A" : "#6B6B6B",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontWeight: active ? 600 : 500,
                transition: "color 0.15s",
                cursor: "pointer",
              }}
            >
              {n.label}
            </a>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link
          to="/login"
          style={{
            fontSize: 12,
            color: "#6B6B6B",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          LOG IN
        </Link>
        <Link
          to="/book-demo"
          style={{
            background: "#0A0A0A",
            color: "#FFFFFF",
            borderRadius: 6,
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
          }}
        >
          BOOK A DEMO <ArrowRight size={12} />
        </Link>
      </div>
    </nav>
  );
};

export default EigenNavbar;
