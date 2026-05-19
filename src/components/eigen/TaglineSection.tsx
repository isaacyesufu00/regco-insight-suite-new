import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const features = [
  { title: "Upload CBS Data", desc: "Upload your Excel export from any core banking system. RegCo extracts all required figures automatically." },
  { title: "AI Validation", desc: "Balance sheet reconciliation, ratio checks, and CBN compliance validation — all automated." },
  { title: "Understand, Extract, Validate", desc: "RegCo reads raw GL summaries, institution details, and financial metrics from any file format." },
  { title: "Generation", desc: "CBN-formatted returns generated in under 5 minutes, ready for immediate submission." },
];

const TaglineSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="capabilities" style={{ background: "#F5F5F0", padding: "80px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <ScrollReveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0A0A0A", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 11, letterSpacing: "0.12em", color: "#9B9B9B", textTransform: "uppercase", margin: "0 0 16px" }}>PRODUCT</p>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-1px", lineHeight: 1.15, maxWidth: 600, margin: "0 auto 20px" }}>
              RegCo. So you don't have<br />to file manually.
            </h2>
            <p style={{ fontSize: 14, color: "#6B6B6B", maxWidth: 520, margin: "0 auto 24px" }}>
              It handles regulatory compliance processing with Nigerian CBN precision. Production-ready results.
            </p>
            <button style={{ background: "#0A0A0A", color: "#fff", borderRadius: 6, padding: "10px 20px", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", border: "none", display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              START AUTOMATING YOUR REPORTS NOW <ArrowRight size={12} />
            </button>
          </div>
        </ScrollReveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <ScrollReveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {features.map((f, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={f.title}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    style={{
                      textAlign: "left",
                      background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
                      borderLeft: isActive ? "2px solid #0A0A0A" : "2px solid transparent",
                      padding: "12px 16px",
                      borderRadius: 4,
                      cursor: "pointer",
                      border: "none",
                      borderLeftWidth: 2,
                      borderLeftStyle: "solid",
                      borderLeftColor: isActive ? "#0A0A0A" : "transparent",
                      transition: "background 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 4, background: "#0A0A0A", display: "inline-block" }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{f.title}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6B6B6B", margin: "0 0 0 18px", lineHeight: 1.55 }}>{f.desc}</p>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 11, letterSpacing: "0.08em", color: "#9B9B9B", textTransform: "uppercase", margin: "0 0 4px" }}>Validation Results</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px" }}>MFB Regulatory Return</p>

              {[
                { label: "Capital Adequacy Ratio (CAR)", val: "14.2%", ok: true },
                { label: "Liquidity Ratio", val: "32.8%", ok: true },
                { label: "NPL Ratio", val: "3.4%", ok: true },
                { label: "Balance Sheet Reconciliation", val: "Balanced", ok: true },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={14} color="#0A0A0A" />
                    <span style={{ fontSize: 12, color: "#1A1A1A" }}>{row.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>{row.val}</span>
                </div>
              ))}

              <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 6, background: "rgba(0,0,0,0.10)", color: "#0A0A0A", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={14} /> Validation Passed · Ready to Generate
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default TaglineSection;
