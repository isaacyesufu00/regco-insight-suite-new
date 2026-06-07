import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Upload, Cpu, CheckCircle, FileText, ArrowRight } from "lucide-react";

const steps = [
  {
    id: "upload",
    icon: Upload,
    label: "Upload",
    heading: "Drop your CBS export. That's it.",
    description:
      "Export your GL trial balance from FlexCube, Ncube, Finacle, or any core banking system as Excel. Drag it in. RegCo reads every column automatically — no template, no mapping, no preparation.",
  },
  {
    id: "validate",
    icon: Cpu,
    label: "AI Validation",
    heading: "Every figure checked before it leaves.",
    description:
      "RegCo checks your balance sheet reconciles (Assets = Liabilities + Equity), your CAR meets the 10% CBN minimum, your liquidity ratio is above 20%, and your NPL ratio is within threshold. If anything fails, you see exactly what to fix.",
  },
  {
    id: "extract",
    icon: CheckCircle,
    label: "Extract & Map",
    heading: "Raw data becomes structured returns.",
    description:
      "RegCo identifies your income, expense, asset, liability, and equity accounts from your raw CBS export. It maps them to the exact line items CBN, NFIU, SCUML, NDIC, and FIRS require — without you touching a formula.",
  },
  {
    id: "generate",
    icon: FileText,
    label: "Generation",
    heading: "A submission-ready return in under 5 minutes.",
    description:
      "RegCo produces a correctly formatted regulatory return with your institution's details pre-filled, all figures validated, and a certification block ready for signature. Download it. Submit it. Done.",
  },
];

const UploadVisual = () => {
  const [dropped, setDropped] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDropped(true), 800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div
        style={{
          width: "100%",
          border: `2px dashed ${dropped ? "#16A34A" : "rgba(0,0,0,0.15)"}`,
          borderRadius: 14,
          padding: "36px 24px",
          textAlign: "center",
          background: dropped ? "#F0FDF4" : "#FAFAFA",
          transition: "all 0.4s ease",
        }}
      >
        <AnimatePresence mode="wait">
          {!dropped ? (
            <motion.div key="idle" exit={{ opacity: 0 }}>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: 36, marginBottom: 12 }}
              >
                📄
              </motion.div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", margin: "0 0 4px" }}>Drop your CBS export here</p>
              <p style={{ fontSize: 12, color: "#9B9B9B", margin: 0 }}>FlexCube · Ncube · Finacle · Any CBS → Excel</p>
            </motion.div>
          ) : (
            <motion.div key="dropped" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#16A34A", margin: "0 0 4px" }}>GL_Summary_May2026.xlsx</p>
              <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0 }}>3 sheets detected · 847 rows · Reading...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {["FlexCube", "Ncube", "Finacle", "Temenos", "Any CBS"].map((cbs) => (
          <span key={cbs} style={{ fontSize: 11, background: "#F5F5F0", color: "#525252", borderRadius: 999, padding: "4px 12px", border: "1px solid rgba(0,0,0,0.07)" }}>
            {cbs}
          </span>
        ))}
      </div>
    </div>
  );
};

const ValidationVisual = () => {
  const checkData = [
    { label: "Balance Sheet Reconciliation", result: "Assets = Liabilities + Equity ✓" },
    { label: "Capital Adequacy Ratio", result: "14.44% — above 10% minimum" },
    { label: "Liquidity Ratio", result: "55.27% — above 20% minimum" },
    { label: "NPL Ratio", result: "4.00% — below 5% maximum" },
  ];
  const [checks, setChecks] = useState([false, false, false, false]);
  useEffect(() => {
    const timers = checkData.map((_, i) =>
      setTimeout(() => {
        setChecks((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 400 + i * 500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
        Validation Results
      </p>
      {checkData.map((check, i) => (
        <motion.div
          key={check.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 14px",
            background: checks[i] ? "#F0FDF4" : "#F9F9F9",
            borderRadius: 8,
            border: `1px solid ${checks[i] ? "rgba(22,163,74,0.2)" : "rgba(0,0,0,0.06)"}`,
            transition: "all 0.3s ease",
          }}
        >
          <span style={{ fontSize: 13, color: "#0A0A0A", fontWeight: 500 }}>{check.label}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {checks[i] ? (
              <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }}>
                {check.result}
              </motion.span>
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: 14, height: 14, border: "2px solid #E5E7EB", borderTopColor: "#0A0A0A", borderRadius: "50%" }}
              />
            )}
          </div>
        </motion.div>
      ))}
      <AnimatePresence>
        {checks.every(Boolean) && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: "#0A0A0A", borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>All validations passed — generating return...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ExtractVisual = () => {
  const mappings = [
    { raw: "Cash and CBN Balances", mapped: "Liquid Assets", category: "ASSET", color: "#DBEAFE" },
    { raw: "Loans & Advances Gross", mapped: "Risk Assets", category: "ASSET", color: "#DBEAFE" },
    { raw: "Customer Deposits", mapped: "Deposit Liabilities", category: "LIABILITY", color: "#FEF3C7" },
    { raw: "Retained Earnings", mapped: "Tier 1 Capital", category: "EQUITY", color: "#D1FAE5" },
    { raw: "Interest Income", mapped: "Gross Earnings", category: "INCOME", color: "#F3E8FF" },
  ];
  const [visibleRows, setVisibleRows] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleRows((prev) => {
        if (prev >= mappings.length) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 350);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your CBS Export</span>
        <span />
        <span style={{ fontSize: 10, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>CBN Format</span>
      </div>
      {mappings.slice(0, visibleRows).map((m) => (
        <motion.div
          key={m.raw}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center", marginBottom: 8 }}
        >
          <div style={{ background: "#F5F5F0", borderRadius: 6, padding: "8px 10px", fontSize: 11, color: "#525252", fontFamily: "monospace" }}>{m.raw}</div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.1, duration: 0.3 }} style={{ width: 20, height: 2, background: "#0A0A0A", borderRadius: 1 }} />
          <div style={{ background: m.color, borderRadius: 6, padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#0A0A0A", fontWeight: 600 }}>{m.mapped}</span>
            <span style={{ fontSize: 9, background: "rgba(0,0,0,0.08)", borderRadius: 4, padding: "1px 5px", color: "#525252" }}>{m.category}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const GenerationVisual = () => {
  const [stage, setStage] = useState<"generating" | "ready">("generating");
  useEffect(() => {
    const t = setTimeout(() => setStage("ready"), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div>
      <AnimatePresence mode="wait">
        {stage === "generating" ? (
          <motion.div key="gen" exit={{ opacity: 0 }} style={{ textAlign: "center", padding: 24 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: 32, height: 32, border: "3px solid #E5E7EB", borderTopColor: "#0A0A0A", borderRadius: "50%", margin: "0 auto 16px" }}
            />
            <p style={{ fontSize: 14, color: "#525252" }}>Generating CBN MFB Regulatory Return...</p>
          </motion.div>
        ) : (
          <motion.div key="ready" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: "#0A0A0A", borderRadius: 12, padding: "20px 20px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>CBN · May 2026</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>MFB Regulatory Return</p>
                </div>
                <span style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "4px 10px" }}>READY</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[
                  { label: "CAR", value: "14.44%" },
                  { label: "Liquidity", value: "55.27%" },
                  { label: "NPL", value: "4.00%" },
                ].map((m) => (
                  <div key={m.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 10px" }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "0 0 2px" }}>{m.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", margin: 0 }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: "100%", height: 44, background: "#0A0A0A", color: "#FFFFFF", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              ↓ Download Return
            </motion.button>
            <p style={{ textAlign: "center", fontSize: 11, color: "#9B9B9B", marginTop: 10 }}>Generated in 4m 18s</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaglineSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (!isInView || !isAutoPlaying) return;
    const interval = setInterval(() => setActiveStep((p) => (p + 1) % steps.length), 3500);
    return () => clearInterval(interval);
  }, [isInView, isAutoPlaying]);

  const handleStepClick = (i: number) => { setActiveStep(i); setIsAutoPlaying(false); };

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      style={{ background: "#F5F5F0", padding: "120px 0", borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: 72 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: 52, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-1.8px", lineHeight: 1.06, margin: 0, maxWidth: 600 }}>
            RegCo. So you don't have<br />to file manually.
          </h2>
        </div>

        <div className="hero-steps-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              const StepIcon = step.icon;
              return (
                <motion.button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  onMouseEnter={() => { setActiveStep(index); setIsAutoPlaying(false); }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 16, padding: 20,
                    borderRadius: 12,
                    background: isActive ? "#FFFFFF" : "transparent",
                    border: `1px solid ${isActive ? "rgba(0,0,0,0.09)" : "transparent"}`,
                    boxShadow: isActive ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
                    cursor: "pointer", textAlign: "left", width: "100%",
                    transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
                  }}
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.15 }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: isActive ? "#0A0A0A" : "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                    <StepIcon size={16} color={isActive ? "#FFFFFF" : "#6B6B6B"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: isActive ? "#0A0A0A" : "#525252", transition: "color 0.2s" }}>
                        {step.label}
                      </span>
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.65, margin: 0, overflow: "hidden" }}
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0, marginTop: 8 }}>
                        <ArrowRight size={14} color="#9B9B9B" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}

            <div style={{ display: "flex", gap: 4, marginTop: 20, paddingLeft: 20 }}>
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleStepClick(i)}
                  style={{ flex: 1, height: 3, borderRadius: 999, background: i === activeStep ? "#0A0A0A" : "rgba(0,0,0,0.1)", border: "none", cursor: "pointer", padding: 0, transition: "background 0.2s" }}
                />
              ))}
            </div>
          </div>

          <div style={{ position: "sticky", top: 100, background: "#FFFFFF", borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", overflow: "hidden", minHeight: 420, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 8, background: "#F5F5F0" }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
              <div style={{ flex: 1, height: 22, background: "#EAEAE4", borderRadius: 5, marginLeft: 8, display: "flex", alignItems: "center", paddingLeft: 10 }}>
                <span style={{ fontSize: 11, color: "#9B9B9B", fontFamily: "monospace" }}>regco-insight-suite.vercel.app/dashboard</span>
              </div>
            </div>
            <div style={{ flex: 1, padding: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: "100%" }}
                >
                  {activeStep === 0 && <UploadVisual />}
                  {activeStep === 1 && <ValidationVisual />}
                  {activeStep === 2 && <ExtractVisual />}
                  {activeStep === 3 && <GenerationVisual />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .hero-steps-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
};

export default TaglineSection;
