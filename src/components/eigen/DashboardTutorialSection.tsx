import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Select your return type",
    description:
      "Choose from all 16 mandatory returns grouped by regulator. CBN, NFIU, SCUML, NDIC, and FIRS — all in one place.",
    highlight: "Create Report page",
  },
  {
    number: "02",
    title: "Upload your CBS data",
    description:
      "Upload your Excel export from FlexCube, Ncube, Finacle, or any core banking system. RegCo reads the file automatically.",
    highlight: "File upload zone",
  },
  {
    number: "03",
    title: "RegCo validates your figures",
    description:
      "Balance sheet reconciliation, CAR check, liquidity ratio, and NPL ratio — all validated automatically against CBN thresholds.",
    highlight: "Validation engine",
  },
  {
    number: "04",
    title: "Your return is generated",
    description:
      "A CBN-formatted regulatory return is produced in under 5 minutes. Download it directly to your computer.",
    highlight: "Report ready",
  },
  {
    number: "05",
    title: "Monitor transactions for AML flags",
    description:
      "Upload transaction data and RegCo flags suspicious activity using 6 CBN AML rules — CTR, structuring, velocity, round figures, dormant accounts, and narration mismatch.",
    highlight: "Transaction Monitor",
  },
  {
    number: "06",
    title: "Track every filing deadline",
    description:
      "The Compliance Calendar shows every CBN, NFIU, SCUML, NDIC and FIRS deadline for the year — colour-coded by urgency.",
    highlight: "Compliance Calendar",
  },
];

const DocumentIllustration = () => (
  <div style={{ display: "flex", gap: 20, justifyContent: "flex-end", alignItems: "center" }}>
    {[0, 1].map((i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 140,
          height: 180,
          background: "#EAEAE4",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.08)",
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          position: "relative",
          transform: i === 0 ? "rotate(-1.5deg)" : "rotate(0.8deg)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(0,0,0,0.15)" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(0,0,0,0.15)" }} />
        </div>
        {[80, 60, 75, 50, 70, 55, 65, 45, 72, 58, 68, 40].map((width, lineIndex) => (
          <div
            key={lineIndex}
            style={{
              height: 7,
              width: `${width}%`,
              background: lineIndex === 0 ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.10)",
              borderRadius: 3,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 14,
            fontSize: 8,
            color: "rgba(0,0,0,0.3)",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {i === 0 ? "GL_SUMMARY.xlsx" : "INSTITUTION_DATA.xlsx"}
        </div>
      </motion.div>
    ))}
  </div>
);

const ProcessingIcon = () => (
  <div
    style={{
      position: "relative",
      width: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width="80" height="120" style={{ position: "absolute", overflow: "visible" }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={`left-${i}`}
          cy={-20 + i * 14}
          r="3"
          fill="#0A0A0A"
          animate={{ cx: [-80, -20], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={`right-${i}`}
          cy={-20 + i * 14}
          r="3"
          fill="#0A0A0A"
          animate={{ cx: [20, 80], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: i * 0.2 + 0.75, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.10)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        position: "relative",
      }}
    >
      <motion.span
        style={{ fontSize: 24, color: "#0A0A0A", fontWeight: 700 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        ✦
      </motion.span>
    </div>
  </div>
);

const labelRow = {
  fontSize: 11,
  color: "#9B9B9B",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
};

const ResultsCard = ({ stepIndex }: { stepIndex: number }) => {
  const cardContents = [
    // Step 0
    <div key="0">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>● Return Types</span>
        <span style={{ fontSize: 12, color: "#0A0A0A", fontWeight: 600 }}>16 available</span>
      </div>
      <div style={labelRow}><span>REGULATOR</span><span>TYPE</span></div>
      {[
        { reg: "CBN", type: "MFB Regulatory Return", active: true },
        { reg: "NFIU", type: "AML/CFT Report", active: false },
        { reg: "FIRS", type: "VAT Return", active: false },
        { reg: "NDIC", type: "NDIC Premium Return", active: false },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            background: item.active ? "rgba(0,0,0,0.04)" : "transparent",
            borderRadius: item.active ? 6 : 0,
            paddingLeft: item.active ? 8 : 0,
          }}
        >
          <span
            style={{
              fontSize: 11,
              background: item.active ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.06)",
              color: item.active ? "#0A0A0A" : "#6B6B6B",
              borderRadius: 4,
              padding: "2px 6px",
              fontWeight: 600,
            }}
          >
            {item.reg}
          </span>
          <span style={{ fontSize: 12, color: "#1A1A1A" }}>{item.type}</span>
        </div>
      ))}
    </div>,

    // Step 1
    <div key="1">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>● File Analysis</span>
        <span style={{ fontSize: 12, color: "#0A0A0A", fontWeight: 600 }}>3 sheets detected</span>
      </div>
      <div style={labelRow}><span>SHEET</span><span>ROWS</span></div>
      {[
        { sheet: "Institution Details", rows: "7 fields" },
        { sheet: "GL Summary", rows: "19 rows" },
        { sheet: "RegCo Upload Format", rows: "16 fields" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#0A0A0A", fontSize: 14 }}>⊙</span>
            <span style={{ fontSize: 12, color: "#1A1A1A" }}>{item.sheet}</span>
          </div>
          <span style={{ fontSize: 12, color: "#6B6B6B" }}>{item.rows}</span>
        </div>
      ))}
    </div>,

    // Step 2
    <div key="2">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>● Validation Results</span>
        <span style={{ fontSize: 12, color: "#0A0A0A", fontWeight: 600 }}>All passed ✓</span>
      </div>
      <div style={labelRow}><span>CHECK</span><span>RESULT</span></div>
      {[
        { check: "Balance Sheet", result: "Reconciled" },
        { check: "Capital Adequacy", result: "14.4% (min 10%)" },
        { check: "Liquidity Ratio", result: "55.3% (min 20%)" },
        { check: "NPL Ratio", result: "4.0% (max 5%)" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#0A0A0A", fontSize: 14 }}>⊙</span>
            <span style={{ fontSize: 12, color: "#1A1A1A" }}>{item.check}</span>
          </div>
          <span style={{ fontSize: 12, color: "#0A0A0A", fontWeight: 500 }}>{item.result}</span>
        </div>
      ))}
    </div>,

    // Step 3
    <div key="3">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>● Report Ready</span>
        <span style={{ fontSize: 12, color: "#0A0A0A", fontWeight: 600 }}>4m 32s</span>
      </div>
      <div style={labelRow}><span>SECTION</span><span>STATUS</span></div>
      {[
        { section: "Section A — Institution", status: "Complete" },
        { section: "Section B — Balance Sheet", status: "Complete" },
        { section: "Section C — Capital Adequacy", status: "Complete" },
        { section: "Section G — Certification", status: "Complete" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#0A0A0A", fontSize: 14 }}>⊙</span>
            <span style={{ fontSize: 12, color: "#1A1A1A" }}>{item.section}</span>
          </div>
          <span style={{ fontSize: 12, color: "#0A0A0A", fontWeight: 500 }}>{item.status}</span>
        </div>
      ))}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: "100%",
          marginTop: 16,
          height: 38,
          background: "#0A0A0A",
          color: "#FFFFFF",
          border: "none",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.04em",
        }}
      >
        DOWNLOAD REPORT →
      </motion.button>
    </div>,

    // Step 4
    <div key="4">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>● AML Flags</span>
        <span style={{ fontSize: 12, color: "#DC2626", fontWeight: 600 }}>4 flagged</span>
      </div>
      <div style={labelRow}><span>CUSTOMER</span><span>SEVERITY</span></div>
      {[
        { name: "Emeka Okafor", amount: "₦6.5M", severity: "CRITICAL", color: "#DC2626", bg: "#FEF2F2" },
        { name: "Fatima Al-Hassan", amount: "₦4.75M", severity: "HIGH", color: "#D97706", bg: "#FFFBEB" },
        { name: "Chukwudi Obi", amount: "₦3.0M", severity: "MEDIUM", color: "#2563EB", bg: "#EFF6FF" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>{item.name}</p>
            <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>{item.amount}</p>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, background: item.bg, color: item.color, borderRadius: 999, padding: "3px 8px", letterSpacing: "0.04em" }}>
            {item.severity}
          </span>
        </div>
      ))}
    </div>,

    // Step 5
    <div key="5">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>● Upcoming Deadlines</span>
        <span style={{ fontSize: 12, color: "#D97706", fontWeight: 600 }}>3 this month</span>
      </div>
      <div style={labelRow}><span>RETURN</span><span>DUE</span></div>
      {[
        { name: "CBN MFB Regulatory", due: "7 days", color: "#DC2626", bg: "#FEF2F2" },
        { name: "PAYE Remittance", due: "14 days", color: "#D97706", bg: "#FFFBEB" },
        { name: "VAT Return", due: "14 days", color: "#D97706", bg: "#FFFBEB" },
        { name: "AML/CFT Report", due: "28 days", color: "#0A0A0A", bg: "#F4F4F4" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#1A1A1A" }}>{item.name}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, background: item.bg, color: item.color, borderRadius: 999, padding: "3px 8px" }}>
            {item.due}
          </span>
        </div>
      ))}
    </div>,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        padding: 24,
        width: 320,
        minHeight: 260,
        flexShrink: 0,
      }}
    >
      {cardContents[stepIndex]}
    </motion.div>
  );
};

const DashboardTutorialSection = () => {
  const tutorialRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: tutorialRef,
    offset: ["start start", "end end"],
  });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const step = Math.min(Math.floor(value * 6), 5);
      setActiveStep(step);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section ref={tutorialRef} style={{ position: "relative", height: "600vh", background: "#F5F5F0" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "80px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9B9B9B",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            PRODUCT WALKTHROUGH
          </p>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#1A1A1A",
              letterSpacing: "-1px",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Everything you need.<br />One dashboard.
          </h2>
          <p style={{ fontSize: 15, color: "#6B6B6B", maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
            From uploading your CBS data to downloading a CBN-ready return — here is exactly how RegCo works.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 40,
            width: "100%",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <DocumentIllustration />
          <ProcessingIcon />
          <AnimatePresence mode="wait">
            <ResultsCard key={activeStep} stepIndex={activeStep} />
          </AnimatePresence>
        </div>

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {steps.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === activeStep ? 28 : 8,
                  background: i === activeStep ? "#0A0A0A" : "rgba(0,0,0,0.15)",
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: 8, borderRadius: 999 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center" }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#0A0A0A",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                STEP {steps[activeStep].number}
              </span>
              <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px", letterSpacing: "-0.3px" }}>
                {steps[activeStep].title}
              </p>
              <p style={{ fontSize: 13, color: "#6B6B6B", maxWidth: 440, lineHeight: 1.6, margin: 0 }}>
                {steps[activeStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {activeStep === 0 && (
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: 12, color: "#9B9B9B", display: "flex", alignItems: "center", gap: 4 }}
            >
              Scroll to explore ↓
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardTutorialSection;
