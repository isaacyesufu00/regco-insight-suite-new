import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { AnimateIn, CountUp } from "./AnimateIn";

const milestones = [
  { phase: "Phase 1 — Complete", title: "Automated MFB return generation", body: "RegCo generates CBN MFB Regulatory Returns, Forex Returns, AML/CFT reports, Prudential Returns, NFIU and SCUML filings automatically from CBS data.", done: true, label: "#0066CC" },
  { phase: "Phase 2 — Live", title: "FIRS tax remittance automation", body: "PAYE, withholding tax, company income tax, and VAT returns prepared and filed automatically. Payroll data in, FIRS submission out.", done: true, label: "#0066CC" },
  { phase: "Phase 3 — Building", title: "Direct CBS integration", body: "Zero-touch data extraction directly from Flexcube, Finacle, Bankone, and T24 via API. No manual export required.", done: false, label: "rgba(255,255,255,0.4)" },
  { phase: "Phase 4 — Roadmap", title: "Pan-African regulatory compliance", body: "Extending the RegCo platform to Ghana, Kenya, and Rwanda — covering BCEAO, CBK, and Bank of Ghana filing requirements.", done: false, label: "rgba(255,255,255,0.3)" },
];

const AboutSection = () => {
  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" });
  const missionRef = useRef(null);
  const missionInView = useInView(missionRef, { once: true, margin: "-80px" });

  return (
    <section id="about" style={{ background: "#FFFFFF", padding: "160px 0" }}>
      <div className="max-w-[900px] mx-auto px-6">
        {/* Sub-section A — Problem Statement */}
        <AnimateIn>
          <p style={{ fontSize: 13, color: "#0066CC", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            Why RegCo Exists
          </p>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 52px)", color: "#1D1D1F", lineHeight: 1.1, letterSpacing: -1, maxWidth: 800 }}>
            Nigeria has over 2,000 licensed financial institutions. Every single one files regulatory returns manually.
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <p style={{ fontSize: 21, color: "#6E6E73", lineHeight: 1.75, maxWidth: 720, marginTop: 24 }}>
            Every month, compliance teams across Nigeria's microfinance banks, commercial banks, primary mortgage banks, and finance companies spend three to five days preparing CBN returns in Excel. They cross-reference figures from multiple systems, manually calculate ratios, format documents to CBN specifications, and pray the balance sheet reconciles before the 10th deadline. One transposed digit triggers a minimum ₦2,000,000 CBN fine. The problem is not the people — it is the process.
          </p>
        </AnimateIn>

        {/* Sub-section B — Scale Card */}
        <AnimateIn delay={0.1}>
          <div
            style={{
              background: "#F5F5F7",
              borderRadius: 28,
              padding: "64px",
              marginTop: 80,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 32,
            }}
          >
            {[
              { value: 900, suffix: "+", label: "Licensed MFBs in Nigeria alone" },
              { value: 13, suffix: "", label: "Mandatory return types per institution" },
            ].map((s, i) => (
              <div key={i} className="flex-1 text-center">
                <p style={{ fontWeight: 700, fontSize: 72, color: "#1D1D1F", lineHeight: 1 }}>
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p style={{ fontSize: 17, color: "#6E6E73", marginTop: 12 }}>{s.label}</p>
              </div>
            ))}
            <div style={{ width: 1, background: "rgba(0,0,0,0.1)", alignSelf: "stretch" }} />
            <div className="flex-1 text-center">
              <p style={{ fontWeight: 700, fontSize: 72, color: "#1D1D1F", lineHeight: 1 }}>₦2M+</p>
              <p style={{ fontSize: 17, color: "#6E6E73", marginTop: 12 }}>Minimum CBN fine per violation</p>
            </div>
          </div>
        </AnimateIn>

        {/* Sub-section C — Mission Statement */}
        <div ref={missionRef} className="grid grid-cols-1 md:grid-cols-2 gap-16" style={{ marginTop: 120 }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={missionInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p style={{ fontWeight: 700, fontSize: 13, color: "#86868B", textTransform: "uppercase", letterSpacing: "0.08em" }}>Our Mission</p>
            <h3 style={{ fontWeight: 700, fontSize: 36, color: "#1D1D1F", lineHeight: 1.2, marginTop: 16 }}>
              To make regulatory compliance invisible for every licensed financial institution in Nigeria.
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={missionInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            className="space-y-6"
          >
            <p style={{ fontSize: 17, color: "#6E6E73", lineHeight: 1.75 }}>
              RegCo exists to eliminate the compliance gap between what Nigerian financial institutions are required to file and what they have the tools to file accurately. We believe a compliance officer's time is too valuable to spend reformatting Excel spreadsheets.
            </p>
            <p style={{ fontSize: 17, color: "#6E6E73", lineHeight: 1.75 }}>
              We built the platform that reads any CBS export format, maps every field to its regulatory equivalent, validates every figure before generating a single line of output, and delivers a submission-ready return in under five minutes. Not in five days.
            </p>
            <p style={{ fontSize: 17, color: "#6E6E73", lineHeight: 1.75 }}>
              Every licensed institution in Nigeria — from the smallest Unit MFB in a market town to a national commercial bank with 400 branches — deserves access to the same quality of compliance infrastructure. RegCo is how we get there.
            </p>
          </motion.div>
        </div>

        {/* Sub-section D — Road Ahead */}
        <div
          ref={lineRef}
          style={{
            background: "#1D1D1F",
            borderRadius: 28,
            padding: 72,
            marginTop: 120,
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>The Road Ahead</p>
          <h3 style={{ fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 48px)", color: "white", lineHeight: 1.1, maxWidth: 600, marginTop: 16 }}>
            From manual reporting to zero-touch compliance.
          </h3>

          <div style={{ marginTop: 48, position: "relative", paddingLeft: 32 }}>
            {/* Vertical line */}
            <motion.div
              style={{
                position: "absolute",
                left: 5,
                top: 0,
                width: 2,
                height: "100%",
                background: "rgba(255,255,255,0.15)",
                transformOrigin: "top",
              }}
              initial={{ scaleY: 0 }}
              animate={lineInView ? { scaleY: 1 } : undefined}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            <div className="space-y-8">
              {milestones.map((m, i) => (
                <AnimateIn key={i} delay={i * 0.3}>
                  <div style={{ position: "relative" }}>
                    {/* Dot */}
                    <div
                      style={{
                        position: "absolute",
                        left: -32,
                        top: 4,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: m.done ? "#0066CC" : "transparent",
                        border: m.done ? "none" : "2px solid white",
                      }}
                    />
                    <p style={{ fontSize: 13, color: m.label, marginBottom: 4 }}>{m.phase}</p>
                    <p style={{ fontWeight: 600, fontSize: 19, color: m.done ? "white" : "rgba(255,255,255,0.7)" }}>{m.title}</p>
                    <p style={{ fontSize: 15, color: m.done ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.4)", marginTop: 4, lineHeight: 1.6 }}>{m.body}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
