import { motion } from "framer-motion";

const statusCards = [
  { label: "Ready", value: 12, color: "#0A0A0A" },
  { label: "Processing", value: 3, color: "#FF9F0A" },
  { label: "Draft", value: 5, color: "#6B6B6B" },
  { label: "Failed", value: 1, color: "#FF3B30" },
];

const reports = [
  { name: "MFB Regulatory Return — Oct 2026", reg: "CBN", status: "Ready", color: "#0A0A0A" },
  { name: "AML/CFT Quarterly Report", reg: "NFIU", status: "Ready", color: "#0A0A0A" },
  { name: "SCUML Annual Return", reg: "SCUML", status: "Processing", color: "#FF9F0A" },
  { name: "NDIC Premium Return", reg: "NDIC", status: "Ready", color: "#0A0A0A" },
  { name: "VAT Return — Sep 2026", reg: "FIRS", status: "Draft", color: "#6B6B6B" },
];

const DashboardMockup = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
    transition={{
      opacity: { duration: 0.8, delay: 0.3 },
      scale: { duration: 0.8, delay: 0.3 },
      y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
    }}
    style={{
      width: "100%",
      borderRadius: 12,
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
      overflow: "hidden",
      background: "#fff",
    }}
  >
    {/* Browser chrome */}
    <div style={{ height: 36, background: "#F0F0EB", display: "flex", alignItems: "center", padding: "0 14px", gap: 8, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: "#FF5F57" }} />
        <div style={{ width: 10, height: 10, borderRadius: 5, background: "#FEBC2E" }} />
        <div style={{ width: 10, height: 10, borderRadius: 5, background: "#28C840" }} />
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 4, padding: "3px 12px", fontSize: 11, color: "#6B6B6B", border: "1px solid rgba(0,0,0,0.06)" }}>
          regco-insight-suite.vercel.app/dashboard
        </div>
      </div>
    </div>

    {/* Body */}
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", minHeight: 380 }}>
      {/* Sidebar */}
      <div style={{ background: "#FAFAFA", borderRight: "1px solid rgba(0,0,0,0.06)", padding: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px" }}>RegCo</p>
        {["Home", "New Report", "My Reports", "Calendar", "Data Sources", "Settings"].map((n, i) => (
          <div
            key={n}
            style={{
              fontSize: 12,
              color: i === 0 ? "#1A1A1A" : "#6B6B6B",
              padding: "8px 10px",
              borderRadius: 6,
              background: i === 0 ? "rgba(0,0,0,0.10)" : "transparent",
              marginBottom: 4,
              fontWeight: i === 0 ? 600 : 500,
            }}
          >
            {n}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ padding: 20, background: "#F5F5F0" }}>
        {/* Institution header */}
        <div style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid rgba(0,0,0,0.06)", marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: "#9B9B9B", margin: 0 }}>Institution</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "2px 0 0" }}>Nakdnx Microfinance Bank · RC 1234567</p>
        </div>

        {/* Status cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
          {statusCards.map((c) => (
            <div key={c.label} style={{ background: "#fff", borderRadius: 8, padding: 10, border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 10, color: "#9B9B9B", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: c.color, margin: "2px 0 0" }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Reports table */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)", fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>
            Recent Reports
          </div>
          {reports.map((r, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 70px",
                padding: "8px 14px",
                fontSize: 11,
                borderTop: i ? "1px solid rgba(0,0,0,0.04)" : "none",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#1A1A1A" }}>{r.name}</span>
              <span style={{ color: "#6B6B6B" }}>{r.reg}</span>
              <span style={{ background: r.color + "20", color: r.color, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, textAlign: "center" }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default DashboardMockup;
