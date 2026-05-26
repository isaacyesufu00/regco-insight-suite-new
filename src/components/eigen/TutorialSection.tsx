import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  number: string;
  title: string;
  description: string;
  detail: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Open Create Report",
    description:
      'From your dashboard, click "Create Report" in the left sidebar. You\'ll see all 16 mandatory return types organised by regulator — CBN, NFIU, SCUML, NDIC, and FIRS. Pick the one you need to file.',
    detail: "RegCo shows you every return your institution is required to file based on your CBN license category. Nothing irrelevant — just the returns that apply to you.",
  },
  {
    number: "02",
    title: "Select the reporting period",
    description:
      "Choose the month, quarter, or year you are filing for. RegCo shows you the CBN deadline for that period and tells you if you are cutting it close.",
    detail: "The deadline tracker compares today's date against the CBN filing deadline. Red means urgent. Orange means file this week. Green means you're ahead.",
  },
  {
    number: "03",
    title: "Upload your CBS export",
    description:
      "Export your trial balance or GL summary from your core banking system — FlexCube, Ncube, Finacle, or any system that can export to Excel. Drag and drop the file onto RegCo.",
    detail: "No special template required. RegCo reads your raw CBS export and automatically identifies your assets, liabilities, deposits, loans, and capital figures.",
  },
  {
    number: "04",
    title: "RegCo validates your figures",
    description:
      "Before generating the return, RegCo checks your balance sheet reconciles, your Capital Adequacy Ratio meets CBN's 10% minimum, your Liquidity Ratio is above 20%, and your NPL ratio is within threshold.",
    detail: "If validation fails, RegCo tells you exactly what's wrong and which figure to check — not a generic error. You fix it once and regenerate.",
  },
  {
    number: "05",
    title: "Download your CBN-formatted return",
    description:
      "In under 5 minutes, your regulatory return is ready. It's formatted exactly as CBN requires — section headers, figure alignment, certification block, everything. Download it directly to your computer.",
    detail: "The downloaded file is plain text that opens in any text editor, Word, or Notepad. Format it, print it, or submit it — exactly as regulators accept.",
  },
  {
    number: "06",
    title: "Your dashboard updates automatically",
    description:
      "The generated report appears instantly in My Reports. Your compliance health score updates. Your calendar marks the deadline as filed. Every metric reflects the new report in real time.",
    detail: "No page refresh needed. RegCo uses Supabase Realtime — every change in the database pushes to your dashboard instantly.",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const Mockup = ({ index }: { index: number }) => {
  const wrap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
  const title: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: "#0A0A0A", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" };

  if (index === 0) {
    return (
      <div style={wrap}>
        <p style={title}>Select Report Type</p>
        <div style={{ display: "flex", gap: 6 }}>
          {["CBN", "NFIU", "SCUML", "NDIC", "FIRS"].map((t, i) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 999,
                background: i === 0 ? "#0A0A0A" : "rgba(0,0,0,0.05)",
                color: i === 0 ? "#FFFFFF" : "#525252",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["MFB Regulatory Return", "Monetary Policy Return", "Prudential Return", "CBN Forex Return"].map((r, i) => (
            <div
              key={r}
              style={{
                background: i === 0 ? "#F5F5F0" : "#FFFFFF",
                border: i === 0 ? "1px solid #0A0A0A" : "1px solid rgba(0,0,0,0.08)",
                borderRadius: 8,
                padding: "12px 14px",
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{r}</p>
              <p style={{ fontSize: 11, color: "#737373", margin: "2px 0 0" }}>Monthly · CBN</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div style={wrap}>
        <p style={title}>Select Reporting Period</p>
        <div style={{ background: "#F5F5F0", borderRadius: 10, padding: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#737373", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Month</p>
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>
            May 2026
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(234, 88, 12, 0.08)", border: "1px solid rgba(234,88,12,0.25)", borderRadius: 10, padding: "14px 16px" }}>
          <span style={{ fontSize: 18 }}>⚠</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>Deadline: June 15, 2026</p>
            <p style={{ fontSize: 12, color: "#A04D00", margin: "2px 0 0" }}>26 days remaining</p>
          </div>
        </div>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div style={wrap}>
        <p style={title}>Upload CBS Data</p>
        <div
          style={{
            border: "2px dashed rgba(0,0,0,0.15)",
            borderRadius: 12,
            padding: "32px 16px",
            textAlign: "center",
            background: "rgba(0,0,0,0.02)",
          }}
        >
          <p style={{ fontSize: 36, margin: 0 }}>📄</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", margin: "8px 0 4px" }}>Drag your CBS export here</p>
          <p style={{ fontSize: 12, color: "#737373", margin: 0 }}>Excel files from FlexCube, Ncube, Finacle accepted</p>
        </div>
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: "10px 14px" }}>
          <p style={{ fontSize: 12, color: "#047857", fontWeight: 600, margin: 0 }}>✓ GL_Summary_May2026.xlsx — 3 sheets detected</p>
        </div>
      </div>
    );
  }

  if (index === 3) {
    const items = [
      { check: "Balance Sheet Reconciliation", result: "Balanced" },
      { check: "Capital Adequacy Ratio", result: "14.4% — above 10% min" },
      { check: "Liquidity Ratio", result: "55.3% — above 20% min" },
      { check: "NPL Ratio", result: "4.0% — below 5% max" },
    ];
    return (
      <div style={wrap}>
        <p style={title}>Validation Results</p>
        {items.map((v) => (
          <div key={v.check} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ fontSize: 13, color: "#0A0A0A", margin: 0, fontWeight: 500 }}>{v.check}</p>
            <span style={{ fontSize: 12, color: "#047857", fontWeight: 600 }}>✓ {v.result}</span>
          </div>
        ))}
        <div style={{ background: "#0A0A0A", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 600, margin: 0 }}>All validations passed — generating report...</p>
        </div>
      </div>
    );
  }

  if (index === 4) {
    return (
      <div style={wrap}>
        <p style={title}>Report Ready</p>
        <div style={{ background: "#F5F5F0", borderRadius: 12, padding: "32px 16px", textAlign: "center" }}>
          <p style={{ fontSize: 40, margin: 0 }}>✅</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", margin: "10px 0 4px" }}>Report Generated</p>
          <p style={{ fontSize: 13, color: "#525252", margin: 0 }}>MFB Regulatory Return — May 2026</p>
          <p style={{ fontSize: 11, color: "#737373", margin: "4px 0 0" }}>Generated in 4m 32s</p>
        </div>
        <button
          style={{
            background: "#0A0A0A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            padding: "12px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ↓ Download MFB_Return_May2026.txt
        </button>
      </div>
    );
  }

  // index 5 — dashboard update
  return (
    <div style={wrap}>
      <p style={title}>Dashboard Updated</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          { n: "12", l: "Total" },
          { n: "1", l: "Processing" },
          { n: "11", l: "Ready" },
        ].map((c) => (
          <div key={c.l} style={{ background: "#F5F5F0", borderRadius: 8, padding: "12px" }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#0A0A0A", margin: 0, lineHeight: 1 }}>{c.n}</p>
            <p style={{ fontSize: 11, color: "#737373", margin: "4px 0 0" }}>{c.l}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: "12px 14px" }}>
        <p style={{ fontSize: 11, color: "#737373", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Compliance Health</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: "#047857", margin: 0 }}>94<span style={{ fontSize: 14, color: "#737373" }}>/100</span></p>
          <span style={{ fontSize: 11, color: "#047857", fontWeight: 600 }}>↑ +3 this month</span>
        </div>
      </div>
      <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: "10px 14px" }}>
        <p style={{ fontSize: 12, color: "#047857", fontWeight: 600, margin: 0 }}>✓ MFB Regulatory Return — May 2026 marked as filed</p>
      </div>
    </div>
  );
};

const TutorialSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, i) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) setActiveStep(i);
        },
        { threshold: 0.6 }
      );
      observer.observe(ref);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section id="tutorial" style={{ background: "#F5F5F0", padding: "120px 0" }}>
      <style>{`
        @media (max-width: 980px) {
          .tutorial-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .tutorial-sticky { position: relative !important; top: auto !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <p style={{ fontSize: 11, color: "#9B9B9B", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px", fontWeight: 600 }}>
            PRODUCT TOUR
          </p>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "#0A0A0A", letterSpacing: "-1.5px", lineHeight: 1.05, margin: "0 0 24px" }}>
            From file upload<br />to filed return.
          </h2>
          <p style={{ fontSize: 17, color: "#525252", lineHeight: 1.6, maxWidth: 620, margin: "0 auto" }}>
            Here is exactly how RegCo turns your CBS data into a CBN-ready regulatory return in under 5 minutes.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="tutorial-grid">
          {/* LEFT — Step cards */}
          <div>
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => (stepRefs.current[i] = el)}
                style={{
                  marginBottom: 80,
                  paddingBottom: 80,
                  borderBottom: i < steps.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: activeStep === i ? "#0A0A0A" : "rgba(0,0,0,0.06)",
                        color: activeStep === i ? "#FFFFFF" : "#525252",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                        transition: "background 0.3s ease, color 0.3s ease",
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Step {step.number}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 30, fontWeight: 800, color: "#0A0A0A", margin: "0 0 16px", letterSpacing: "-0.8px", lineHeight: 1.15 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 16, color: "#525252", lineHeight: 1.7, margin: "0 0 16px" }}>
                    {step.description}
                  </p>
                  <p style={{ fontSize: 14, color: "#737373", lineHeight: 1.6, margin: 0, padding: "12px 16px", background: "rgba(0,0,0,0.03)", borderRadius: 8, borderLeft: "2px solid #0A0A0A" }}>
                    💡 {step.detail}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>

          {/* RIGHT — Sticky mockup */}
          <div className="tutorial-sticky" style={{ position: "sticky", top: 100 }}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", background: "#F5F5F0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
                <div
                  style={{
                    marginLeft: 12,
                    flex: 1,
                    background: "#FFFFFF",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 11,
                    color: "#737373",
                    textAlign: "center",
                  }}
                >
                  regco-insight-suite.vercel.app/dashboard
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  style={{ padding: 24, minHeight: 400 }}
                >
                  <Mockup index={activeStep} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === activeStep ? 32 : 8,
                    background: i === activeStep ? "#0A0A0A" : "rgba(0,0,0,0.15)",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ height: 8, borderRadius: 999 }}
                />
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 12, color: "#737373", marginTop: 12 }}>
              Step {activeStep + 1} of {steps.length} — {steps[activeStep].title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorialSection;
