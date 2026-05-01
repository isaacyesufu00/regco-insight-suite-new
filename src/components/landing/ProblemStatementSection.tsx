import { useEffect, useRef, useState } from "react";

const useCountUp = (end: number, duration = 1500) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(eased * end));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return { ref, value };
};

const ProblemStatementSection = () => {
  const hrs = useCountUp(19);
  const fines = useCountUp(2);

  return (
    <section className="py-[120px]" style={{ background: "#F5F5F7" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 22px" }}>
        <h2 className="text-[48px] font-bold text-[#1D1D1F]" style={{ letterSpacing: "-0.5px", lineHeight: 1.1 }}>
          No more manual errors.
        </h2>
        <p className="mt-4 text-[17px] text-[#6E6E73] max-w-[640px]" style={{ lineHeight: 1.6 }}>
          Compliance officers lose entire weeks to manual extraction, formula fixes, and last-minute deadline scrambles. A single misclassified loan is enough to trigger a regulatory penalty.
        </p>

        <div className="mt-10" style={{ width: "60%", height: 1, background: "rgba(0,0,0,0.1)" }} />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div ref={hrs.ref}>
            <p className="text-[17px] text-[#6E6E73]">Saves up to</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[72px] font-black text-[#1D1D1F]" style={{ letterSpacing: -2, lineHeight: 1 }}>
                {hrs.value}
              </span>
              <span className="text-[34px] font-normal text-[#1D1D1F]">hrs</span>
            </div>
            <p className="text-[17px] text-[#6E6E73] mt-1">per month per compliance officer</p>
          </div>

          <div ref={fines.ref}>
            <p className="text-[17px] text-[#6E6E73]">Prevents</p>
            <span className="text-[72px] font-black text-[#1D1D1F] block mt-1" style={{ letterSpacing: -2, lineHeight: 1 }}>
              ₦{fines.value}M+
            </span>
            <p className="text-[17px] text-[#6E6E73] mt-1">in CBN fines per filing cycle</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
