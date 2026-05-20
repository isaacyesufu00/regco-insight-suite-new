import { ReactNode, useEffect, useState } from "react";
import { PageShell, PageHero } from "./PageShell";

export interface LegalSection {
  id: string;
  label: string;
  title: string;
  body: ReactNode;
}

export const LegalPage = ({ label, title, subtitle, sections }: { label: string; title: string; subtitle: string; sections: LegalSection[] }) => {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <PageShell>
      <PageHero label={label} title={title} subtitle={subtitle} />
      <section style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 56 }} className="legal-grid">
          <aside style={{ position: "sticky", top: 100, alignSelf: "start", display: "none" }} className="legal-toc">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9B9B9B", margin: "0 0 16px" }}>Contents</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, borderLeft: "1px solid rgba(0,0,0,0.1)" }}>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} style={{
                    display: "block", padding: "8px 16px", fontSize: 13,
                    color: active === s.id ? "#0A0A0A" : "#6B6B6B",
                    fontWeight: active === s.id ? 600 : 400,
                    borderLeft: active === s.id ? "2px solid #0A0A0A" : "2px solid transparent",
                    marginLeft: -1, textDecoration: "none", transition: "all 0.2s",
                  }}>{s.label}</a>
                </li>
              ))}
            </ul>
          </aside>
          <div style={{ maxWidth: 760 }}>
            {sections.map((s) => (
              <section key={s.id} id={s.id} style={{ scrollMarginTop: 120, paddingBottom: 56 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.015em", margin: "0 0 14px" }}>{s.title}</h2>
                <div style={{ fontSize: 15, lineHeight: 1.75, color: "#3A3A3A" }}>{s.body}</div>
              </section>
            ))}
          </div>
        </div>
      </section>
      <style>{`@media (min-width: 1024px) { .legal-grid { grid-template-columns: 220px 1fr !important; } .legal-toc { display: block !important; } }`}</style>
    </PageShell>
  );
};

export const P = ({ children }: { children: ReactNode }) => <p style={{ margin: "0 0 14px" }}>{children}</p>;
export const UL = ({ items }: { items: ReactNode[] }) => (
  <ul style={{ margin: "0 0 14px", padding: "0 0 0 20px" }}>
    {items.map((it, i) => <li key={i} style={{ marginBottom: 6 }}>{it}</li>)}
  </ul>
);
