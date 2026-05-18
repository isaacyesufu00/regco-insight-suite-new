import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const navItems = [
  { label: "PRODUCT", href: "#product" },
  { label: "CAPABILITIES", href: "#capabilities" },
  { label: "USE CASES", href: "#use-cases" },
  { label: "REPORTS", href: "#reports" },
  { label: "PRICING", href: "#pricing" },
];

const EigenNavbar = () => (
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
      RegCo
    </Link>

    <div style={{ display: "flex", gap: 28 }}>
      {navItems.map((n) => (
        <a
          key={n.label}
          href={n.href}
          style={{
            fontSize: 12,
            color: "#6B6B6B",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          {n.label}
        </a>
      ))}
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
          background: "#4CAF50",
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
        START FOR FREE <ArrowRight size={12} />
      </Link>
    </div>
  </nav>
);

export default EigenNavbar;
