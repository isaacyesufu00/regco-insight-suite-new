import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const stages = [
  {
    label: "MICROFINANCE BANKS",
    headline: "900+ licensed MFBs. Every one of them files the same 9 returns every month.",
    body: "Unit, State, and National MFBs face the same mandatory reporting cycle — CBN Monetary Policy, Prudential Return, MFB Regulatory Return, AML/CFT, NFIU, SCUML, Forex Return, NDIC, and payroll taxes. RegCo automates every single one.",
    stat: "Monthly deadline: 10th of every month",
    building: "M20,180 L20,60 L80,40 L140,60 L140,180 M40,180 L40,100 L60,90 L80,85 L100,90 L120,100 L120,180 M60,180 L60,120 M100,180 L100,120 M70,75 L90,75 M80,40 L80,75",
  },
  {
    label: "COMMERCIAL BANKS",
    headline: "Where the compliance burden is heaviest.",
    body: "Tier 3 commercial banks manage compliance teams of 5 to 15 people yet still rely on Excel for return preparation. RegCo's commercial tier handles everything from CBN prudential returns to FIRS payroll remittances in one unified platform.",
    stat: "Annual compliance filing volume: 60+ returns",
    building: "M15,180 L15,30 L75,10 L135,30 L135,180 M30,180 L30,50 M120,180 L120,50 M50,180 L50,70 L100,70 L100,180 M60,60 L90,60 M60,50 L90,50 M75,10 L75,50 M40,90 L40,130 M110,90 L110,130",
  },
  {
    label: "PRIMARY MORTGAGE BANKS",
    headline: "Housing finance compliance. Just as complex.",
    body: "PMBs file returns to CBN, NFIU, EFCC, and FIRS. The regulatory calendar never stops. RegCo covers the full PMB return schedule including the National Housing Fund remittance and CBN PMB periodic returns.",
    stat: "Quarterly + monthly deadlines",
    building: "M10,180 L10,100 L40,80 L75,65 L110,80 L140,100 L140,180 M30,180 L30,110 L75,85 L120,110 L120,180 M55,180 L55,100 L95,100 L95,180 M65,95 L85,95 M50,130 L50,160 M100,130 L100,160",
  },
  {
    label: "FINANCE COMPANIES AND BDCs",
    headline: "The forgotten sector. Until now.",
    body: "BDCs and finance companies face some of the strictest AML/CFT reporting requirements in the regulated financial system. NFIU reporting, SCUML registration, CBN forex returns — RegCo handles all of it.",
    stat: "STR filing: within 72 hours of detection",
    building: "M20,180 L20,80 L50,60 L100,60 L130,80 L130,180 M40,180 L40,90 L75,75 L110,90 L110,180 M60,180 L60,100 L90,100 L90,180 M55,70 L95,70 M35,120 L35,150 M115,120 L115,150",
  },
  {
    label: "FINTECHS AND PSBs",
    headline: "New licences. Immediate compliance obligations.",
    body: "PSBs, Mobile Money Operators, and licensed fintechs inherit the full CBN reporting calendar from day one. RegCo onboards new institutions in 48 hours and generates your first return before your first compliance deadline.",
    stat: "First return generated within 48 hours",
    building: "M10,180 L10,120 L45,120 L45,90 L105,90 L105,120 L140,120 L140,180 M30,180 L30,130 M120,180 L120,130 M55,180 L55,100 L95,100 L95,180 M65,95 L85,95 M60,130 L90,130 M60,150 L90,150",
  },
];

const InstitutionScrollSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [activeStage, setActiveStage] = useState(0);

  scrollYProgress.on("change", (v) => {
    const idx = Math.min(4, Math.floor(v * 5));
    if (idx !== activeStage && idx >= 0) setActiveStage(idx);
  });

  return (
    <section ref={containerRef} id="who-we-serve" style={{ height: "500vh", position: "relative", background: "#000" }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Progress dots */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {stages.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i === activeStage ? "white" : "transparent",
                border: "1.5px solid white",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Persistent header */}
        <div className="absolute top-16 left-0 right-0 text-center px-6">
          <h2 style={{ fontWeight: 700, fontSize: "clamp(28px, 4vw, 52px)", color: "white" }}>
            Built for every licensed financial institution in our market.
          </h2>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-16 w-full" style={{ marginTop: 60 }}>
          {/* Left content */}
          <div className="flex-1 min-w-0">
            {stages.map((stage, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ opacity: i === activeStage ? 1 : 0, y: i === activeStage ? 0 : 30 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: i === activeStage ? "relative" : "absolute",
                  display: i === activeStage ? "block" : "none",
                }}
              >
                <p style={{ fontSize: 13, color: "#0066CC", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 400 }}>
                  {stage.label}
                </p>
                <h3 style={{ fontWeight: 700, fontSize: "clamp(28px, 3vw, 42px)", color: "white", lineHeight: 1.1, marginTop: 16 }}>
                  {stage.headline}
                </h3>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", marginTop: 20, maxWidth: 460, lineHeight: 1.6 }}>
                  {stage.body}
                </p>
                <div
                  className="inline-flex items-center mt-6"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 980,
                    padding: "8px 20px",
                    fontSize: 14,
                    color: "white",
                  }}
                >
                  {stage.stat}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right SVG wireframe building */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            {stages.map((stage, i) => (
              <motion.svg
                key={i}
                viewBox="0 0 150 200"
                className="w-full max-w-[320px]"
                initial={false}
                animate={{ opacity: i === activeStage ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                style={{ position: i === activeStage ? "relative" : "absolute" }}
              >
                <motion.path
                  d={stage.building}
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={1}
                  initial={{ pathLength: 0 }}
                  animate={i === activeStage ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </motion.svg>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstitutionScrollSection;
