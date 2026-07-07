import { useEffect, useState } from "react";
import { T } from "./tokens";

export default function ScrollTicks() {
  const [ids, setIds] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const list = els.map((el, i) => {
      if (!el.id) el.id = `sec-${i}`;
      return el.id;
    });
    setIds(list);
    if (list.length) setActive(list[0]);

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive((visible[0].target as HTMLElement).id);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-30% 0px -30% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  if (!ids.length) return null;

  return (
    <div
      className="hidden lg:flex"
      style={{
        position: "fixed",
        left: 32,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
        flexDirection: "column",
        gap: 10,
      }}
    >
      {ids.map((id) => {
        const isActive = id === active;
        return (
          <div
            key={id}
            style={{
              width: isActive ? 32 : 16,
              height: 1.5,
              background: isActive ? T.white : T.whiteFaint,
              transition: "all 300ms ease",
            }}
          />
        );
      })}
    </div>
  );
}
