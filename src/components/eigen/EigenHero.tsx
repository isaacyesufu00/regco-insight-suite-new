import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

const trustedNames = [
  "the Central Bank", "NFIU", "SCUML", "NDIC", "FIRS",
  "Nakdnx MFB", "FlexCube Compatible", "Ncube Compatible",
];

const EigenHero = () => (
  <section id="product" style={{ background: "#F5F5F0", paddingTop: 52 }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 80, padding: "80px 0 60px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0,0,0,0.1)",
              color: "#0A0A0A",
              borderRadius: 4,
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 24,
              border: "1px solid rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#0A0A0A", marginRight: 8, verticalAlign: "middle" }} /> Trusted by Regulated Financial Institutions
          </div>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              maxWidth: 520,
              margin: 0,
            }}
          >
            End-to-end<br />compliance automation<br />for regulated banks.
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} style={{ maxWidth: 320, justifySelf: "end" }}>
          <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.65, marginBottom: 24 }}>
            Enterprise compliance platform. Generate all 16 mandatory regulatory returns,
            monitor transactions, and manage KYC — from one dashboard.
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link to="/login" style={{ background: "#0A0A0A", color: "#FFFFFF", borderRadius: 6, padding: "10px 18px", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              LOG IN <ArrowRight size={12} />
            </Link>
            <Link to="/book-demo" style={{ background: "transparent", color: "#1A1A1A", borderRadius: 6, padding: "10px 18px", fontSize: 12, fontWeight: 600, border: "1px solid rgba(0,0,0,0.15)", textDecoration: "none" }}>
              BOOK A DEMO
            </Link>
          </div>
        </motion.div>
      </div>

      <DashboardMockup />

      {/* Trusted-by ticker */}
      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.06)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "20px 0",
          marginTop: 60,
          display: "flex",
          alignItems: "center",
          gap: 48,
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9B9B9B", whiteSpace: "nowrap", flexShrink: 0 }}>
          TRUSTED BY
        </span>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: 48, whiteSpace: "nowrap" }}
        >
          {[...trustedNames, ...trustedNames].map((n, i) => (
            <span key={i} style={{ fontSize: 13, color: "#9B9B9B", fontWeight: 500 }}>{n}</span>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default EigenHero;
