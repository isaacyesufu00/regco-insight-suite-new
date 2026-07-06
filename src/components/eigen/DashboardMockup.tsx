import { motion } from "framer-motion";

const statusCards = [
  { label: "Reports Ready", value: "8", color: "#16A34A", bg: "#F0FDF4" },
  { label: "Flagged Txns", value: "3", color: "#DC2626", bg: "#FEF2F2" },
  { label: "KYC Incomplete", value: "12", color: "#D97706", bg: "#FFFBEB" },
  { label: "Screened Today", value: "47", color: "#2563EB", bg: "#EFF6FF" },
];

const reports = [
  { name: "MFB Regulatory Return", reg: "CBN", status: "Ready", color: "#16A34A", bg: "#F0FDF4" },
  { name: "AML Transaction Scan", reg: "NFIU", status: "Ready", color: "#16A34A", bg: "#F0FDF4" },
  { name: "Customer 360 — Emeka Okafor", reg: "Internal", status: "Screened", color: "#2563EB", bg: "#EFF6FF" },
];

const sidebarItems = [
  { label: "Dashboard", active: true },
  { label: "My Reports", active: false },
  { label: "Create Report", active: false },
  { label: "Customer 360", active: false, isNew: true },
  { label: "Transactions", active: false },
  { label: "Risk Screening", active: false, isNew: true },
  { label: "Compliance Mail", active: false },
  { label: "Calendar", active: false },
  { label: "Data Sources", active: false },
  { label: "Settings", active: false },
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
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: 420 }}>
      {/* Sidebar */}
      <div style={{ background: "#FAFAFA", borderRight: "1px solid rgba(0,0,0,0.06)", padding: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px" }}>RegCo<span style={{color:"#CA0101"}}>.</span></p>
        {sidebarItems.map((item) => (
          <div
            key={item.label}
            style={{
              fontSize: 12,
              color: item.active ? "#1A1A1A" : "#6B6B6B",
              padding: "7px 10px",
              borderRadius: 6,
              background: item.active ? "rgba(0,0,0,0.10)" : "transparent",
              marginBottom: 3,
              fontWeight: item.active ? 600 : 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
            }}
          >
            <span>{item.label}</span>
            {item.isNew && (
              <span style={{ background: "#16A34A", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 3, letterSpacing: "0.04em" }}>
                NEW
              </span>
            )}
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
            <div key={c.label} style={{ background: c.bg, borderRadius: 8, padding: 10, border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 10, color: "#6B6B6B", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{c.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: c.color, margin: "2px 0 0" }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Reports table */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)", fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>
            Recent Activity
          </div>
          {reports.map((r, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 70px 80px",
                padding: "9px 14px",
                fontSize: 11,
                borderTop: i ? "1px solid rgba(0,0,0,0.04)" : "none",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#1A1A1A" }}>{r.name}</span>
              <span style={{ color: "#6B6B6B" }}>{r.reg}</span>
              <span style={{ background: r.bg, color: r.color, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, textAlign: "center" }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default DashboardMockup;
