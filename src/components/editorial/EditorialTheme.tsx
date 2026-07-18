import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export const HELV = 'Helvetica Neue, Helvetica, Arial, sans-serif';
export const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export const C = {
  page:    "#0A0A0A",
  surface: "#141414",
  ink:     "#F2EDE4",
  ink2:    "#D8D2C6",
  ink3:    "#8A847A",
  rule:    "#2A2724",
  cream:   "#F2E9D8",
  creamHi: "#E6DCC4",
};

export const NAV_ITEMS: [string, string][] = [
  ["Home", "/"],
  ["Product", "/product"],
  ["About us", "/about-us"],
  ["Who we serve", "/who-we-serve"],
  ["Log in", "/login"],
];

const navLink: React.CSSProperties = {
  fontFamily: HELV, fontSize: 15, color: C.ink, textDecoration: "none",
};

export function Nav() {
  return (
    <header className="regco-nav" style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 72, zIndex: 50,
      background: C.page,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px 0 24px",
      fontFamily: HELV,
    }}>
      <Link to="/" style={{ textDecoration: "none", color: C.ink, lineHeight: 1.05, letterSpacing: "0.04em", fontWeight: 700, fontSize: 18 }}>
        RegCo<span style={{ color: "#CA0101" }}>.</span>
      </Link>
      <nav style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {NAV_ITEMS.map(([l, to]) => (
          <Link key={l} to={to} style={navLink}>{l}</Link>
        ))}
      </nav>
    </header>
  );
}


export function ScrollRuler({ active, total }: { active: number; total: number }) {
  return (
    <div style={{
      position: "fixed", left: 56, top: "50%", transform: "translateY(-50%)",
      display: "flex", flexDirection: "column", gap: 8, zIndex: 40,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 1,
          width: i === active ? 24 : 16,
          background: C.ink3,
          opacity: i === active ? 1 : 0.35,
          transition: "width 150ms ease, opacity 150ms ease",
        }} />
      ))}
    </div>
  );
}

export function CreamCTA({ children, href = "#", to, hero = false }: { children: React.ReactNode; href?: string; to?: string; hero?: boolean }) {
  const [hover, setHover] = useState(false);
  // Hero CTA is excluded from the global black-CTA rule — keeps the cream look.
  const style: React.CSSProperties = hero
    ? {
        display: "inline-flex", alignItems: "center", gap: 8,
        background: hover ? C.creamHi : C.cream, color: "#0A0A0A",
        borderRadius: 9999, padding: "14px 24px",
        fontFamily: HELV, fontSize: 15, fontWeight: 500,
        textDecoration: "none", transition: "background 150ms ease",
      }
    : {
        display: "inline-flex", alignItems: "center", gap: 8,
        background: hover ? "#222222" : "#0A0A0A", color: "#FFFFFF",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 9999, padding: "14px 24px",
        fontFamily: HELV, fontSize: 15, fontWeight: 500,
        textDecoration: "none", transition: "background 150ms ease",
      };
  const inner = (<>{children} <ArrowRight size={16} strokeWidth={1.75} /></>);
  if (to) return <Link to={to} className={hero ? undefined : "regco-cta"} style={style} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>{inner}</Link>;
  return <a href={href} className={hero ? undefined : "regco-cta"} style={style} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>{inner}</a>;
}

export const H1: React.CSSProperties = {
  fontFamily: HELV, fontWeight: 700, fontSize: 56, lineHeight: 1.05,
  letterSpacing: "-0.025em", color: C.ink, margin: 0,
};
export const H1Washed: React.CSSProperties = { ...H1, color: "#6F6A62", fontSize: 44 };
export const H2: React.CSSProperties = {
  fontFamily: HELV, fontWeight: 700, fontSize: 28, lineHeight: 1.15,
  letterSpacing: "-0.02em", color: C.ink, margin: 0,
};
export const Lede: React.CSSProperties = {
  fontFamily: HELV, fontWeight: 400, fontSize: 19, lineHeight: 1.55,
  color: C.ink, margin: 0,
};
export const Body: React.CSSProperties = {
  fontFamily: HELV, fontWeight: 400, fontSize: 17, lineHeight: 1.6,
  color: C.ink2, margin: 0,
};
export const Mono: React.CSSProperties = {
  fontFamily: MONO, fontWeight: 400, fontSize: 13, color: C.ink3,
};

export const Col: React.CSSProperties = { maxWidth: 760, margin: "0 auto", padding: "0 24px" };

export function useRulerActive(count: number) {
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-ruler-id]"));
    sectionsRef.current = sections;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = Number((e.target as HTMLElement).dataset.rulerId);
          setActive(id);
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [count]);
  return active;
}

export function EditorialFooter() {
  return (
    <footer style={{
      borderTop: `1px solid ${C.rule}`, padding: "48px 32px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{ fontFamily: HELV, fontWeight: 700, fontSize: 15, color: C.ink, letterSpacing: "0.04em", lineHeight: 1.05 }}>
        RegCo<span style={{ color: "#CA0101" }}>.</span>
      </div>
      <div style={{ ...Mono, fontSize: 12 }}>© 2026 RegCo Compliance</div>
    </footer>
  );
}
