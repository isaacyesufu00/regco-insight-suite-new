import { motion } from "framer-motion";

const sidebarItems = [
  { label: "Dashboard", active: true },
  { label: "My Reports", active: false },
  { label: "Create Report", active: false },
  { label: "Customer 360", active: false },
  { label: "Transactions", active: false },
  { label: "Risk Screening", active: false },
  { label: "Board Pack", active: false },
  { label: "Audit Tracker", active: false },
  { label: "Regulatory Intel", active: false },
  { label: "Calendar", active: false },
  { label: "Settings", active: false },
];

const statCards = [
  { label: "Reports Ready", value: "9", color: "#16A34A", bg: "#F0FDF4" },
  { label: "Flagged Txns", value: "3", color: "#DC2626", bg: "#FEF2F2" },
  { label: "KYC Incomplete", value: "15", color: "#D97706", bg: "#FFFBEB" },
  { label: "Screened", value: "47", color: "#2563EB", bg: "#EFF6FF" },
];

const reports = [
  { name: "MFB Regulatory Return", reg: "CBN", status: "Ready", statusColor: "#16A34A", statusBg: "#F0FDF4" },
  { name: "VAT Return", reg: "FIRS", status: "Ready", statusColor: "#16A34A", statusBg: "#F0FDF4" },
  { name: "AML/CFT Compliance", reg: "NFIU", status: "Processing", statusColor: "#2563EB", statusBg: "#EFF6FF" },
  { name: "NDIC Premium Return", reg: "NDIC", status: "Ready", statusColor: "#16A34A", statusBg: "#F0FDF4" },
];

const DashboardMockup = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
    transition={{
      opacity: { duration: 0.8, delay: 0.3 },
      scale: { duration: 0.8, delay: 0.3 },
      y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
    }}
    style={{
      width: "100%",
      maxWidth: 680,
      margin: "0 auto",
      background: "#FFFFFF",
      borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.14)",
      overflow: "hidden",
    }}
  >
    {/* Browser chrome */}
    <div style={{ height: 36, background: "#F5F5F0", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", padding: "0 14px", gap: 6, flexShrink: 0 }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
      ))}
      <div style={{ flex: 1, height: 18, background: "#EAEAE4", borderRadius: 4, marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 10, color: "#9B9B9B", fontFamily: "monospace" }}>regco-insight-suite.vercel.app/dashboard</span>
      </div>
    </div>

    <div style={{ display: "flex", height: 420 }}>
      {/* Sidebar */}
      <div style={{ width: 168, borderRight: "1px solid rgba(0,0,0,0.07)", background: "#FAFAFA", padding: "16px 10px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "2px 6px", marginBottom: 20 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.4px" }}>RegCo</span>
        </div>

        <div style={{ background: "#F0F0EB", borderRadius: 6, padding: "6px 8px", marginBottom: 16 }}>
          <p style={{ fontSize: 9, color: "#9B9B9B", margin: "0 0 1px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>INSTITUTION</p>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>Nakdnx MFB</p>
        </div>

        {sidebarItems.map((item) => (
          <div key={item.label} style={{
            padding: "6px 8px", borderRadius: 6,
            background: item.active ? "#FFFFFF" : "transparent",
            boxShadow: item.active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            marginBottom: 1,
          }}>
            <span style={{ fontSize: 11, fontWeight: item.active ? 600 : 400, color: item.active ? "#0A0A0A" : "#6B6B6B" }}>{item.label}</span>
          </div>
        ))}

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 7, padding: "8px 6px", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#FFFFFF" }}>M</span>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>Marvellous O.</p>
            <p style={{ fontSize: 9, color: "#9B9B9B", margin: 0 }}>Compliance Officer</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 18, overflow: "hidden" }}>
        <div style={{ background: "#0A0A0A", borderRadius: 10, padding: "14px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>INSTITUTION</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", margin: 0, letterSpacing: "-0.3px" }}>Nakdnx Microfinance Bank</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "2px 0 0" }}>State MFB · Abuja, FCT</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>COMPLIANCE SCORE</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: "#4ADE80", margin: 0, letterSpacing: "-1px" }}>82</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: 0 }}>out of 100</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
          {statCards.map((card) => (
            <div key={card.label} style={{ background: card.bg, borderRadius: 8, padding: "10px 8px", border: `1px solid ${card.color}20` }}>
              <p style={{ fontSize: 18, fontWeight: 900, color: card.color, margin: "0 0 2px", letterSpacing: "-0.5px" }}>{card.value}</p>
              <p style={{ fontSize: 9, color: "#6B6B6B", margin: 0 }}>{card.label}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 8, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0A0A0A" }}>Recent Reports</span>
            <span style={{ fontSize: 10, color: "#9B9B9B" }}>View all →</span>
          </div>
          {reports.map((row, i) => (
            <div key={i} style={{ padding: "9px 12px", borderBottom: i < reports.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: "#0A0A0A", margin: 0 }}>{row.name}</p>
                <p style={{ fontSize: 10, color: "#9B9B9B", margin: 0 }}>{row.reg}</p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, background: row.statusBg, color: row.statusColor, borderRadius: 999, padding: "2px 8px" }}>
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default DashboardMockup;
