import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const painPoints = [
  {
    headline: "You file 7 returns per year. Manually.",
    description:
      "CBN, NFIU, SCUML and prudential returns each demand hours of cell-by-cell reconciliation across multiple spreadsheets.",
    mockup: "spreadsheet",
  },
  {
    headline: "One wrong figure. ₦2,000,000 fine.",
    description:
      "A single misclassified loan or unbalanced trial balance is enough to trigger a regulatory penalty and a follow-up audit.",
    mockup: "penalty",
  },
  {
    headline: "5 days of work. Every single month.",
    description:
      "Compliance officers lose entire weeks to manual extraction, formula fixes, and last-minute deadline scrambles.",
    mockup: "calendar",
  },
];

const Mockup = ({ type }: { type: string }) => {
  if (type === "spreadsheet") {
    return (
      <div className="w-full h-full bg-white rounded-xl border border-[#E8E8E8] p-5 shadow-sm">
        <div className="text-xs font-mono text-[#888] mb-3">trial_balance_q4.xlsx</div>
        <div className="grid grid-cols-4 gap-px bg-[#E8E8E8]">
          {Array.from({ length: 24 }).map((_, i) => {
            const isError = [3, 7, 14, 19].includes(i);
            return (
              <div
                key={i}
                className={`h-7 px-2 text-[11px] flex items-center font-mono ${
                  isError
                    ? "bg-destructive/10 text-destructive"
                    : "bg-white text-[#555]"
                }`}
              >
                {isError ? "#REF!" : `${(Math.random() * 1000).toFixed(2)}`}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (type === "penalty") {
    return (
      <div className="w-full h-full bg-white rounded-xl border border-[#E8E8E8] p-6 shadow-sm flex flex-col">
        <div className="text-[10px] font-bold text-destructive uppercase tracking-widest">
          Regulatory Notice
        </div>
        <div className="mt-3 text-lg font-bold text-[#0A0A0A] leading-tight">
          Penalty Assessment
        </div>
        <div className="mt-1 text-xs text-[#555]">
          Re: Q3 Regulatory Return — Misclassified loan portfolio
        </div>
        <div className="mt-5 pt-4 border-t border-[#E8E8E8]">
          <div className="text-[11px] uppercase text-[#888] tracking-wider">Amount Due</div>
          <div className="mt-1 text-3xl font-black text-destructive">₦2,000,000</div>
        </div>
      </div>
    );
  }
  // calendar
  return (
    <div className="w-full h-full bg-white rounded-xl border border-[#E8E8E8] p-5 shadow-sm">
      <div className="text-xs font-semibold text-[#0A0A0A] mb-3">January 2026</div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 31 }).map((_, i) => {
          const day = i + 1;
          const crossed = [22, 23, 24, 25, 26].includes(day);
          return (
            <div
              key={i}
              className={`aspect-square rounded text-[11px] flex items-center justify-center font-medium relative ${
                crossed
                  ? "bg-destructive/10 text-destructive"
                  : "bg-[#F5F5F5] text-[#555]"
              }`}
            >
              {day}
              {crossed && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="block w-full h-px bg-destructive rotate-45" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProblemStatementSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={sectionRef} className="relative bg-white" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: text */}
            <div className="relative min-h-[260px]">
              {painPoints.map((p, i) => {
                const start = i / painPoints.length;
                const end = (i + 1) / painPoints.length;
                const opacity = useTransform(
                  scrollYProgress,
                  [start - 0.05, start + 0.05, end - 0.05, end + 0.05],
                  [0, 1, 1, 0],
                );
                return (
                  <motion.div
                    key={i}
                    style={{ opacity }}
                    className="absolute inset-0 flex items-start gap-5"
                  >
                    <span
                      aria-hidden="true"
                      className="block w-1 h-16 bg-brand-gradient rounded-full mt-2 flex-shrink-0"
                    />
                    <div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A] leading-[1.1] tracking-tight">
                        {p.headline}
                      </h2>
                      <p className="mt-5 text-base md:text-lg text-[#555] leading-relaxed max-w-md">
                        {p.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right: mockups */}
            <div className="relative h-[320px] md:h-[380px]">
              {painPoints.map((p, i) => {
                const start = i / painPoints.length;
                const end = (i + 1) / painPoints.length;
                const opacity = useTransform(
                  scrollYProgress,
                  [start - 0.05, start + 0.05, end - 0.05, end + 0.05],
                  [0, 1, 1, 0],
                );
                const scale = useTransform(
                  scrollYProgress,
                  [start - 0.05, start + 0.05, end - 0.05, end + 0.05],
                  [0.95, 1, 1, 0.95],
                );
                return (
                  <motion.div
                    key={i}
                    style={{ opacity, scale }}
                    className="absolute inset-0"
                  >
                    <Mockup type={p.mockup} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
