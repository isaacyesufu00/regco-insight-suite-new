import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const reportCards = [
  { title: "MFB Regulatory Return", reg: "CBN", rotate: -1 },
  { title: "AML/CFT Report", reg: "NFIU", rotate: 0.5 },
  { title: "SCUML Annual", reg: "SCUML", rotate: -0.5 },
  { title: "NDIC Premium", reg: "NDIC", rotate: 1 },
  { title: "VAT Return", reg: "FIRS", rotate: -0.3 },
];

const MiniDoc = ({ title, reg, rotate }: { title: string; reg: string; rotate: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    style={{
      width: 200,
      minWidth: 200,
      height: 260,
      borderRadius: 10,
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      background: "#fff",
      padding: 16,
      transform: `rotate(${rotate}deg)`,
      flexShrink: 0,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <span style={{ fontSize: 8, fontWeight: 700, color: "#0A0A0A", letterSpacing: "0.08em" }}>{reg}</span>
      <span style={{ width: 18, height: 18, borderRadius: 9, background: "rgba(0,0,0,0.15)" }} />
    </div>
    <p style={{ fontSize: 11, fontWeight: 700, color: "#1A1A1A", margin: "0 0 12px", lineHeight: 1.3 }}>{title}</p>
    <p style={{ fontSize: 8, color: "#9B9B9B", margin: "0 0 10px", letterSpacing: "0.04em" }}>NAKDNX MFB · RC 1234567</p>
    {[...Array(8)].map((_, i) => (
      <div key={i} style={{ height: 5, background: i % 3 === 0 ? "rgba(0,0,0,0.10)" : "rgba(0,0,0,0.05)", borderRadius: 2, marginBottom: 5, width: `${70 + (i * 13) % 30}%` }} />
    ))}
    <div style={{ marginTop: 12, padding: "4px 8px", background: "rgba(0,0,0,0.10)", borderRadius: 4, fontSize: 8, color: "#0A0A0A", fontWeight: 600, display: "inline-block" }}>
      ✓ READY
    </div>
  </motion.div>
);

const BestInClassSection = () => (
  <section id="reports" style={{ background: "#F5F5F0", padding: "80px 0" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <ScrollReveal>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0A0A0A", marginBottom: 14 }} />
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.8px", margin: 0 }}>
            Best in class CBN compliance
          </h2>
          <p style={{ fontSize: 14, color: "#6B6B6B", maxWidth: 480, margin: "12px auto 0", lineHeight: 1.6 }}>
            Processes regulatory returns for regulated institutions with pinpoint CBN accuracy.
            Production-ready output quality.
          </p>
        </div>
      </ScrollReveal>

      <div style={{ display: "flex", justifyContent: "center", overflow: "visible", marginBottom: 64 }}>
        <div style={{ display: "flex", gap: -20 }}>
          {reportCards.map((c, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -20 }}>
              <MiniDoc {...c} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <ScrollReveal>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#0A0A0A", lineHeight: 1, margin: "0 0 8px" }}>16</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px" }}>Full compliance coverage</h3>
            <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.55, margin: 0 }}>
              All 16 returns across 5 regulators. Every mandatory filing for regulated licensed institutions.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid rgba(0,0,0,0.07)" }}>
            <Shield size={32} color="#0A0A0A" style={{ marginBottom: 8 }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px" }}>On-premise ready and enterprise-grade</h3>
            <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.55, margin: 0 }}>
              Bank-grade security. Your data stays inside your jurisdiction. Supabase PostgreSQL with row-level security.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default BestInClassSection;
