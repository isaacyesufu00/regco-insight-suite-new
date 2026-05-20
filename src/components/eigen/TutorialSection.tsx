import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const tutorialSteps = [
  {
    step: "01",
    title: "Select your\nreturn type",
    description: "Choose from all 16 mandatory returns grouped by regulator. CBN, NFIU, SCUML, NDIC, and FIRS — all in one place.",
  },
  {
    step: "02",
    title: "Upload your\nCBS data",
    description: "Upload your Excel export from FlexCube, Ncube, Finacle, or any core banking system. RegCo reads the file automatically.",
  },
  {
    step: "03",
    title: "RegCo validates\nyour figures",
    description: "Balance sheet reconciliation, CAR check, liquidity ratio, and NPL ratio — all validated automatically against CBN thresholds.",
  },
  {
    step: "04",
    title: "Download your\nformatted return",
    description: "A CBN-formatted regulatory return is produced in under 5 minutes. Download it directly to your computer.",
  },
  {
    step: "05",
    title: "Monitor\ntransactions",
    description: "Upload transaction data and RegCo flags suspicious activity using 6 CBN AML rules instantly.",
  },
  {
    step: "06",
    title: "Track every\ndeadline",
    description: "The Compliance Calendar shows every filing deadline for the year, colour-coded by urgency.",
  },
];

const labelRow: React.CSSProperties = {
  fontSize: 10,
  color: "#9B9B9B",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const TutorialMockupContent = ({ stepIndex }: { stepIndex: number }) => {
  const inner: React.CSSProperties = { padding: 20 };

  if (stepIndex === 0) {
    return (
      <div style={inner}>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {["CBN", "NFIU", "SCUML", "NDIC", "FIRS"].map((t, i) => (
            <span key={t} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
              background: i === 0 ? "#0A0A0A" : "rgba(0,0,0,0.05)",
              color: i === 0 ? "#fff" : "#6B6B6B",
            }}>{t}</span>
          ))}
        </div>
        <div style={labelRow}><span>RETURN TYPE</span><span>FREQUENCY</span></div>
        {[
          { name: "MFB Regulatory Return", f: "Monthly", active: true },
          { name: "Prudential Return", f: "Quarterly" },
          { name: "Forex Return", f: "Monthly" },
          { name: "Monetary Policy Return", f: "Monthly" },
        ].map((r) => (
          <div key={r.name} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 8px", borderRadius: 6, marginBottom: 2,
            background: r.active ? "rgba(0,0,0,0.05)" : "transparent",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
          }}>
            <span style={{ fontSize: 12, color: "#1A1A1A", fontWeight: r.active ? 600 : 400 }}>{r.name}</span>
            <span style={{ fontSize: 11, color: "#6B6B6B" }}>{r.f}</span>
          </div>
        ))}
      </div>
    );
  }

  if (stepIndex === 1) {
    return (
      <div style={inner}>
        <div style={{
          border: "2px dashed rgba(0,0,0,0.15)", borderRadius: 12, padding: "40px 20px",
          textAlign: "center", background: "#F5F5F0",
        }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#0A0A0A", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 12 }}>↑</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>Drop your CBS export here</p>
          <p style={{ fontSize: 11, color: "#9B9B9B", margin: "4px 0 0" }}>.xlsx, .csv up to 50MB</p>
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#F5F5F0", borderRadius: 8 }}>
          <span style={{ fontSize: 12, color: "#1A1A1A" }}>📄 GL_SUMMARY_NOV2025.xlsx</span>
          <span style={{ fontSize: 11, color: "#0A0A0A", fontWeight: 600 }}>Uploaded ✓</span>
        </div>
      </div>
    );
  }

  if (stepIndex === 2) {
    return (
      <div style={inner}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>● Validation Results</span>
          <span style={{ fontSize: 11, color: "#0A0A0A", fontWeight: 600 }}>All passed ✓</span>
        </div>
        {[
          { check: "Balance Sheet", result: "Reconciled" },
          { check: "Capital Adequacy", result: "14.4% (min 10%)" },
          { check: "Liquidity Ratio", result: "55.3% (min 20%)" },
          { check: "NPL Ratio", result: "4.0% (max 5%)" },
        ].map((r) => (
          <div key={r.check} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: 12, color: "#1A1A1A" }}>⊙ {r.check}</span>
            <span style={{ fontSize: 11, color: "#0A0A0A", fontWeight: 600 }}>{r.result}</span>
          </div>
        ))}
      </div>
    );
  }

  if (stepIndex === 3) {
    return (
      <div style={inner}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>● Report Ready</span>
          <span style={{ fontSize: 11, color: "#0A0A0A", fontWeight: 600 }}>4m 32s</span>
        </div>
        {[
          "Section A — Institution",
          "Section B — Balance Sheet",
          "Section C — Capital Adequacy",
          "Section G — Certification",
        ].map((s) => (
          <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: 12, color: "#1A1A1A" }}>⊙ {s}</span>
            <span style={{ fontSize: 11, color: "#0A0A0A", fontWeight: 600 }}>Complete</span>
          </div>
        ))}
        <button style={{
          width: "100%", marginTop: 14, padding: "10px", background: "#0A0A0A", color: "#fff",
          border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer",
        }}>DOWNLOAD REPORT →</button>
      </div>
    );
  }

  if (stepIndex === 4) {
    return (
      <div style={inner}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>● AML Flags</span>
          <span style={{ fontSize: 11, color: "#DC2626", fontWeight: 600 }}>4 flagged</span>
        </div>
        {[
          { n: "Emeka Okafor", a: "₦6.5M", s: "CRITICAL", c: "#DC2626", bg: "#FEF2F2" },
          { n: "Fatima Al-Hassan", a: "₦4.75M", s: "HIGH", c: "#D97706", bg: "#FFFBEB" },
          { n: "Chukwudi Obi", a: "₦3.0M", s: "MEDIUM", c: "#2563EB", bg: "#EFF6FF" },
        ].map((r) => (
          <div key={r.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>{r.n}</p>
              <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>{r.a}</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, background: r.bg, color: r.c, borderRadius: 999, padding: "3px 8px", letterSpacing: "0.04em" }}>{r.s}</span>
          </div>
        ))}
      </div>
    );
  }

  // stepIndex 5 — calendar
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const deadlines: Record<number, string> = { 7: "#DC2626", 10: "#DC2626", 14: "#D97706", 21: "#D97706", 28: "#22C55E" };
  return (
    <div style={inner}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>May 2026</span>
        <span style={{ fontSize: 11, color: "#D97706", fontWeight: 600 }}>3 deadlines</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} style={{ fontSize: 9, color: "#9B9B9B", textAlign: "center" }}>{d}</div>
        ))}
        {days.map((d) => (
          <div key={d} style={{
            aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", background: "#F5F5F0", borderRadius: 4, fontSize: 10, color: "#1A1A1A",
          }}>
            {d}
            {deadlines[d] && <span style={{ width: 4, height: 4, borderRadius: "50%", background: deadlines[d], marginTop: 1 }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const TutorialSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-500vw"]);

  return (
    <section id="tutorial" ref={sectionRef} style={{ height: "600vh", position: "relative", background: "#F5F5F0" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>PRODUCT TOUR</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.8px", margin: 0 }}>How RegCo works</h2>
        </div>

        <motion.div style={{ display: "flex", width: "600vw", height: "100vh", x, willChange: "transform" }}>
          {tutorialSteps.map((step, i) => (
            <div key={i} style={{
              width: "100vw", height: "100vh", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: "140px 80px 80px", flexShrink: 0,
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1100, width: "100%" }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 16 }}>
                    STEP {step.step}
                  </span>
                  <h3 style={{
                    fontSize: 52, fontWeight: 800, color: "#1A1A1A",
                    letterSpacing: "-2px", lineHeight: 1.05, marginBottom: 24, whiteSpace: "pre-line",
                  }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 17, color: "#6B6B6B", lineHeight: 1.7, maxWidth: 400 }}>
                    {step.description}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 40 }}>
                    {tutorialSteps.map((_, di) => (
                      <div key={di} style={{
                        width: di === i ? 24 : 8, height: 8, borderRadius: 999,
                        background: di === i ? "#0A0A0A" : "rgba(0,0,0,0.15)",
                        transition: "width 0.3s ease",
                      }} />
                    ))}
                  </div>
                </div>

                <div style={{
                  background: "#FFFFFF", borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
                  overflow: "hidden", minHeight: 360,
                }}>
                  <div style={{
                    height: 36, background: "#F5F5F0", borderBottom: "1px solid rgba(0,0,0,0.07)",
                    display: "flex", alignItems: "center", padding: "0 14px", gap: 6,
                  }}>
                    {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                      <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                    ))}
                    <div style={{
                      flex: 1, height: 20, background: "#EAEAE4", borderRadius: 4, marginLeft: 8,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: 10, color: "#9B9B9B" }}>regco.app/dashboard</span>
                    </div>
                  </div>
                  <TutorialMockupContent stepIndex={i} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9B9B9B",
        }}>
          <span>Scroll to continue</span>
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↓</motion.span>
        </div>
      </div>
    </section>
  );
};

export default TutorialSection;
