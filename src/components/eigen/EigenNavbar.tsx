import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Product", href: "#features" },
  { label: "Reports", href: "#reports" },
  { label: "Customers", href: "#who-we-serve" },
  { label: "Pricing", href: "#pricing" },
];

const EigenNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        height: 72,
        background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(23,25,28,0.06)" : "1px solid transparent",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        transition: "background 0.2s, border-color 0.2s",
        fontFamily: "Inter, -apple-system, system-ui, sans-serif",
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: "#17191c",
          textDecoration: "none",
          letterSpacing: "-0.02em",
          fontFamily: "'Instrument Serif', Georgia, serif",
        }}
      >
        RegCo
      </Link>

      <div style={{ display: "flex", gap: 36, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
        {navItems.map((n) => (
          <a
            key={n.label}
            href={n.href}
            onClick={(e) => handleNavClick(e, n.href)}
            style={{
              fontSize: 15,
              color: "#17191c",
              textDecoration: "none",
              fontWeight: 450,
              cursor: "pointer",
              letterSpacing: "-0.01em",
            }}
          >
            {n.label}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link
          to="/book-demo"
          style={{
            fontSize: 15,
            color: "#17191c",
            textDecoration: "none",
            fontWeight: 450,
          }}
        >
          Book a demo
        </Link>
        <Link
          to="/login"
          style={{
            background: "#17191c",
            color: "#ffffff",
            borderRadius: 9999,
            padding: "10px 22px",
            fontSize: 15,
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Get started
        </Link>
      </div>
    </nav>
  );
};

export default EigenNavbar;
