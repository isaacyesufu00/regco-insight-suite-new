import { motion } from "framer-motion";

type Variant = "agent" | "reports" | "monitoring" | "screening" | "calendar" | "security";

const PALETTE = {
  bg: "#0B0B0C",
  panel: "#141416",
  panelAlt: "#1B1B1E",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  text: "#F5F5F0",
  muted: "rgba(245,245,240,0.55)",
  faint: "rgba(245,245,240,0.35)",
  green: "#4ADE80",
  red: "#F87171",
  amber: "#FBBF24",
};

const Chrome = ({ url, children }: { url: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    style={{
      width: "100%",
      maxWidth: 1080,
      margin: "0 auto",
      borderRadius: 14,
      overflow: "hidden",
      background: PALETTE.bg,
      border: `1px solid ${PALETTE.border}`,
      boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
      fontFamily: "Inter, -apple-system, sans-serif",
    }}
  >
    <div style={{ height: 36, background: "#1A1A1C", borderBottom: `1px solid ${PALETTE.border}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
      <div style={{ display: "flex", gap: 6 }}>
        <span style={{ width: 11, height: 11, borderRadius: 6, background: "#FF5F57" }} />
        <span style={{ width: 11, height: 11, borderRadius: 6, background: "#FEBC2E" }} />
        <span style={{ width: 11, height: 11, borderRadius: 6, background: "#28C840" }} />
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "#0B0B0C", borderRadius: 5, padding: "3px 14px", fontSize: 11, color: PALETTE.faint, border: `1px solid ${PALETTE.border}` }}>
          {url}
        </div>
      </div>
    </div>
    {children}
  </motion.div>
);

const Sidebar = ({ active }: { active: string }) => {
  const items = ["Agent", "Reports", "Monitoring", "Screening", "Calendar", "History", "Audit", "Settings"];
  return (
    <div style={{ width: 188, background: "#0F0F11", borderRight: `1px solid ${PALETTE.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: PALETTE.text, color: PALETTE.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>R</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: PALETTE.text }}>RegCo</span>
      </div>
      {items.map((it) => {
        const isActive = it === active;
        return (
          <div
            key={it}
            style={{
              padding: "7px 10px",
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? PALETTE.text : PALETTE.faint,
              background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
            }}
          >
            {it}
          </div>
        );
      })}
    </div>
  );
};

const AgentMock = () => (
  <div style={{ display: "flex", height: 460, color: PALETTE.text }}>
    <Sidebar active="Agent" />
    <div style={{ flex: 1, padding: "36px 28px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ fontFamily: "var(--font-serif, Georgia)", fontSize: 38, fontWeight: 700, letterSpacing: "-1.2px", margin: "16px 0 18px" }}>RegCo</h2>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {["Generate Return", "Screen Customer", "View Alerts", "Draft STR"].map((p) => (
          <span key={p} style={{ fontSize: 11.5, fontWeight: 500, color: PALETTE.muted, padding: "5px 12px", border: `1px solid ${PALETTE.border}`, borderRadius: 999 }}>{p}</span>
        ))}
      </div>
      <div style={{ width: "100%", maxWidth: 520, background: PALETTE.panel, border: `1px solid ${PALETTE.border}`, borderRadius: 14, padding: "16px 18px" }}>
        <p style={{ fontSize: 13, color: PALETTE.faint, margin: 0 }}>Ask RegCo Agent anything. Type @ to attach a CBS file.</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, fontSize: 11.5, color: PALETTE.faint }}>
          <span>📎 Files · CBS Vault · CBN Circulars</span>
          <span style={{ background: PALETTE.text, color: PALETTE.bg, padding: "3px 9px", borderRadius: 6, fontWeight: 600 }}>↵</span>
        </div>
      </div>
      <div style={{ marginTop: 24, fontSize: 11, color: PALETTE.faint }}>
        Sources cited · Always grounded in CBN, NFIU, SCUML guidance
      </div>
    </div>
  </div>
);

const ReportsMock = () => {
  const rows = [
    { n: "MFB Prudential Return", reg: "CBN", q: "Q1 2026", s: "Ready", c: PALETTE.green },
    { n: "AML Transaction Scan", reg: "NFIU", q: "Mar 2026", s: "Ready", c: PALETTE.green },
    { n: "Liquidity Ratio Report", reg: "CBN", q: "Mar 2026", s: "Processing", c: PALETTE.amber },
    { n: "NDIC Premium Computation", reg: "NDIC", q: "Q1 2026", s: "Ready", c: PALETTE.green },
    { n: "Capital Adequacy Return", reg: "CBN", q: "Q1 2026", s: "Review", c: PALETTE.red },
    { n: "VAT Return", reg: "FIRS", q: "Mar 2026", s: "Ready", c: PALETTE.green },
  ];
  return (
    <div style={{ display: "flex", height: 460, color: PALETTE.text }}>
      <Sidebar active="Reports" />
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <p style={{ fontSize: 11, color: PALETTE.faint, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>Reports</p>
            <h3 style={{ fontSize: 20, fontWeight: 600, margin: "4px 0 0" }}>All regulatory filings</h3>
          </div>
          <div style={{ background: PALETTE.text, color: PALETTE.bg, padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600 }}>+ New report</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {[{ l: "Ready", v: "12", c: PALETTE.green }, { l: "Processing", v: "3", c: PALETTE.amber }, { l: "Needs review", v: "1", c: PALETTE.red }, { l: "Filed YTD", v: "47", c: PALETTE.text }].map((k) => (
            <div key={k.l} style={{ background: PALETTE.panel, border: `1px solid ${PALETTE.border}`, borderRadius: 10, padding: 12 }}>
              <p style={{ fontSize: 10, color: PALETTE.faint, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.l}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: k.c, margin: "4px 0 0" }}>{k.v}</p>
            </div>
          ))}
        </div>
        <div style={{ background: PALETTE.panel, border: `1px solid ${PALETTE.border}`, borderRadius: 10, overflow: "hidden" }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 90px", padding: "11px 16px", fontSize: 12.5, borderTop: i ? `1px solid ${PALETTE.border}` : "none", alignItems: "center" }}>
              <span>{r.n}</span>
              <span style={{ color: PALETTE.faint }}>{r.reg}</span>
              <span style={{ color: PALETTE.muted }}>{r.q}</span>
              <span style={{ color: r.c, fontWeight: 600, fontSize: 11, padding: "3px 10px", border: `1px solid ${r.c}`, borderRadius: 999, textAlign: "center" }}>{r.s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MonitoringMock = () => (
  <div style={{ display: "flex", height: 460, color: PALETTE.text }}>
    <Sidebar active="Monitoring" />
    <div style={{ flex: 1, padding: 24 }}>
      <p style={{ fontSize: 11, color: PALETTE.faint, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>Live AML monitoring</p>
      <h3 style={{ fontSize: 20, fontWeight: 600, margin: "4px 0 18px" }}>Transactions flagged today</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 14 }}>
        <div style={{ background: PALETTE.panel, border: `1px solid ${PALETTE.border}`, borderRadius: 10, padding: 14 }}>
          {[
            { c: "Emeka O.", amt: "₦9,500,000", rule: "CTR threshold", sev: "Critical" },
            { c: "Ifeoma A.", amt: "₦4,800,000 × 3", rule: "Structuring", sev: "High" },
            { c: "Tunde B.", amt: "₦12,000,000", rule: "Velocity spike", sev: "High" },
            { c: "Chioma E.", amt: "₦2,000,000", rule: "Dormant reactivation", sev: "Medium" },
            { c: "Sani M.", amt: "₦7,500,000", rule: "Round-figure pattern", sev: "Medium" },
          ].map((t, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 130px 130px 80px", padding: "10px 6px", fontSize: 12.5, borderTop: i ? `1px solid ${PALETTE.border}` : "none", alignItems: "center" }}>
              <span>{t.c}</span>
              <span style={{ color: PALETTE.muted }}>{t.amt}</span>
              <span style={{ color: PALETTE.faint }}>{t.rule}</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: t.sev === "Critical" ? PALETTE.red : t.sev === "High" ? PALETTE.amber : PALETTE.muted }}>{t.sev}</span>
            </div>
          ))}
        </div>
        <div style={{ background: PALETTE.panel, border: `1px solid ${PALETTE.border}`, borderRadius: 10, padding: 16 }}>
          <p style={{ fontSize: 11, color: PALETTE.faint, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Today</p>
          <p style={{ fontSize: 40, fontWeight: 700, margin: "6px 0 14px", letterSpacing: "-1px" }}>1,284</p>
          <p style={{ fontSize: 11.5, color: PALETTE.muted, margin: 0 }}>transactions scanned</p>
          <div style={{ height: 1, background: PALETTE.border, margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
            <span style={{ color: PALETTE.muted }}>Flagged</span><span style={{ color: PALETTE.red, fontWeight: 600 }}>5</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 8 }}>
            <span style={{ color: PALETTE.muted }}>STRs drafted</span><span style={{ color: PALETTE.amber, fontWeight: 600 }}>2</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ScreeningMock = () => (
  <div style={{ display: "flex", height: 460, color: PALETTE.text }}>
    <Sidebar active="Screening" />
    <div style={{ flex: 1, padding: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 540 }}>
        <p style={{ fontSize: 11, color: PALETTE.faint, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>Sanctions & PEP screening</p>
        <h3 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 18px" }}>Screen a new customer</h3>
        <div style={{ background: PALETTE.panel, border: `1px solid ${PALETTE.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: PALETTE.faint, margin: "0 0 4px" }}>Full name</p>
          <p style={{ fontSize: 14, color: PALETTE.text, margin: 0 }}>Adebayo Okonkwo</p>
        </div>
        <div style={{ background: PALETTE.panel, border: `1px solid ${PALETTE.border}`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: PALETTE.faint, margin: "0 0 8px" }}>Lists checked</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["UN Consolidated", "OFAC SDN", "EU Sanctions", "UK HM Treasury", "CBN Watchlist", "Domestic PEPs"].map((l) => (
              <span key={l} style={{ fontSize: 11, padding: "4px 10px", border: `1px solid ${PALETTE.border}`, borderRadius: 999, color: PALETTE.muted }}>✓ {l}</span>
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(74,222,128,0.08)", border: `1px solid rgba(74,222,128,0.35)`, borderRadius: 10, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: PALETTE.green, margin: 0 }}>No matches found</p>
            <p style={{ fontSize: 11.5, color: PALETTE.muted, margin: "4px 0 0" }}>Cleared in 2.7s · Certificate available</p>
          </div>
          <span style={{ fontSize: 11.5, color: PALETTE.text, fontWeight: 600 }}>Download →</span>
        </div>
      </div>
    </div>
  </div>
);

const CalendarMock = () => {
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  const events: Record<number, { c: string; t: string }> = {
    5: { c: PALETTE.red, t: "MFB" },
    9: { c: PALETTE.amber, t: "VAT" },
    14: { c: PALETTE.green, t: "AML" },
    21: { c: PALETTE.red, t: "CAR" },
    27: { c: PALETTE.amber, t: "NDIC" },
  };
  return (
    <div style={{ display: "flex", height: 460, color: PALETTE.text }}>
      <Sidebar active="Calendar" />
      <div style={{ flex: 1, padding: 24 }}>
        <p style={{ fontSize: 11, color: PALETTE.faint, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>Compliance calendar</p>
        <h3 style={{ fontSize: 20, fontWeight: 600, margin: "4px 0 18px" }}>March 2026</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, fontSize: 11 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d} style={{ color: PALETTE.faint, textAlign: "center", padding: 6 }}>{d}</div>
          ))}
          {days.map((d, i) => {
            const valid = d > 0 && d <= 31;
            const ev = events[d];
            return (
              <div key={i} style={{ aspectRatio: "1 / 1", background: PALETTE.panel, border: `1px solid ${PALETTE.border}`, borderRadius: 6, padding: 6, display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: valid ? 1 : 0.3 }}>
                <span style={{ fontSize: 11, color: valid ? PALETTE.muted : PALETTE.faint }}>{valid ? d : ""}</span>
                {ev && <span style={{ fontSize: 9, color: ev.c, fontWeight: 600, padding: "1px 4px", border: `1px solid ${ev.c}`, borderRadius: 4, alignSelf: "flex-start" }}>{ev.t}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SecurityMock = () => (
  <div style={{ display: "flex", height: 460, color: PALETTE.text }}>
    <Sidebar active="Audit" />
    <div style={{ flex: 1, padding: 24 }}>
      <p style={{ fontSize: 11, color: PALETTE.faint, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>Audit trail</p>
      <h3 style={{ fontSize: 20, fontWeight: 600, margin: "4px 0 18px" }}>Every agent action, logged</h3>
      <div style={{ background: PALETTE.panel, border: `1px solid ${PALETTE.border}`, borderRadius: 10, overflow: "hidden" }}>
        {[
          { t: "10:42", u: "agent", a: "Generated MFB Prudential Return Q1 2026", reg: "CBN R-12/2024" },
          { t: "10:38", u: "isaac@bank.ng", a: "Approved STR draft #STR-MFB-2026-00187", reg: "NFIU MLPA s.6" },
          { t: "10:21", u: "agent", a: "Flagged ₦9.5M deposit — CTR threshold", reg: "CBN AML/CFT Reg 2022" },
          { t: "09:58", u: "agent", a: "Screened customer 'Adebayo Okonkwo' — clear", reg: "UN/OFAC/EU" },
          { t: "09:14", u: "isaac@bank.ng", a: "Confirmed CAR @ 14.2% — above threshold", reg: "CBN Prudential" },
        ].map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 160px 1fr 200px", padding: "11px 16px", fontSize: 12.5, borderTop: i ? `1px solid ${PALETTE.border}` : "none", alignItems: "center" }}>
            <span style={{ color: PALETTE.faint, fontFamily: "monospace" }}>{r.t}</span>
            <span style={{ color: PALETTE.muted }}>{r.u}</span>
            <span>{r.a}</span>
            <span style={{ color: PALETTE.faint, fontSize: 11 }}>{r.reg}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MAP: Record<Variant, { url: string; node: JSX.Element }> = {
  agent: { url: "regco.ng/agent", node: <AgentMock /> },
  reports: { url: "regco.ng/dashboard/reports", node: <ReportsMock /> },
  monitoring: { url: "regco.ng/dashboard/monitoring", node: <MonitoringMock /> },
  screening: { url: "regco.ng/dashboard/screening", node: <ScreeningMock /> },
  calendar: { url: "regco.ng/dashboard/calendar", node: <CalendarMock /> },
  security: { url: "regco.ng/dashboard/audit", node: <SecurityMock /> },
};

const MockScreenshot = ({ variant = "agent" }: { variant?: Variant }) => {
  const { url, node } = MAP[variant];
  return <Chrome url={url}>{node}</Chrome>;
};

export default MockScreenshot;
