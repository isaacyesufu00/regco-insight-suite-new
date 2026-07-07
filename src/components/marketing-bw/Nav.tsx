import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { T } from "./tokens";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 72,
        zIndex: 50,
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? T.black : "transparent",
        borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
        transition: "background 200ms ease, border-color 200ms ease",
        fontFamily: T.font,
      }}
    >
      <Link
        to="/"
        style={{
          color: T.white,
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "-0.3px",
          textDecoration: "none",
        }}
      >
        REGCO<span style={{ color: T.red }}>.</span>
      </Link>

      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 40,
        }}
      >
        {[
          { label: "Product", to: "/product" },
          { label: "Who We Serve", to: "/who-we-serve" },
          { label: "About", to: "/about-us" },
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              color: T.whiteDim,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = T.white)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = T.whiteDim)}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <Link
        to="/book-demo"
        style={{
          background: T.red,
          color: T.white,
          borderRadius: 4,
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          transition: "background 150ms ease",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = T.redHover)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = T.red)}
      >
        Book a Demo
      </Link>
    </nav>
  );
}
