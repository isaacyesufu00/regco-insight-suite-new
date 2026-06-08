import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";

const labelChip: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#9B9B9B",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

/* ───────── Mockups ───────── */

const ReportGenMockup = () => (
  <div style={mockShell}>
    <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
      {["CBN", "NFIU", "SCUML", "NDIC", "FIRS"].map((t, i) => (
        <span key={t} style={{
          padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
          background: i === 0 ? "#0A0A0A" : "rgba(0,0,0,0.05)",
          color: i === 0 ? "#FFFFFF" : "#6B6B6B",
        }}>{t}</span>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {[
        "MFB Regulatory Return",
        "Prudential Return",
        "Forex Return",
        "Monetary Policy Return",
        "AML/CFT Quarterly",
        "Capital Adequacy",
      ].map((r) => (
        <div key={r} style={{ background: "#F5F5F0", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 8, padding: "10px 12px" }}>
          <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0, marginBottom: 4 }}>CBN</p>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>{r}</p>
        </div>
      ))}
    </div>
  </div>
);

const TxMonitorMockup = () => (
  <div style={mockShell}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>● Flagged Transactions</span>
      <span style={{ fontSize: 11, color: "#DC2626", fontWeight: 600 }}>3 active alerts</span>
    </div>
    {[
      { id: "TXN-08821", amt: "₦9,800,000", rule: "CTR Threshold", sev: "CRITICAL", c: "#DC2626", bg: "#FEF2F2" },
      { id: "TXN-08819", amt: "₦4,750,000", rule: "Structuring", sev: "HIGH", c: "#D97706", bg: "#FFFBEB" },
      { id: "TXN-08812", amt: "₦3,000,000", rule: "Velocity", sev: "MEDIUM", c: "#2563EB", bg: "#EFF6FF" },
    ].map((r) => (
      <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>{r.id} · {r.amt}</p>
          <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>{r.rule}</p>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, background: r.bg, color: r.c, borderRadius: 999, padding: "3px 8px", letterSpacing: "0.04em" }}>
          {r.sev}
        </span>
      </div>
    ))}
  </div>
);

const Customer360Mockup = () => (
  <div style={mockShell}>
    <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#0A0A0A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>
        AO
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>Adaeze Obi</p>
        <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>BVN · 22183047219</p>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, background: "#ECFDF5", color: "#059669", padding: "4px 8px", borderRadius: 999, letterSpacing: "0.04em" }}>
        KYC COMPLETE
      </span>
    </div>
    {[
      { ch: "Core Banking", acct: "0021 8847 12", bal: "₦2,184,720" },
      { ch: "Mobile", acct: "0021 8847 99", bal: "₦184,500" },
      { ch: "Agency", acct: "0021 9923 01", bal: "₦45,000" },
    ].map((a) => (
      <div key={a.acct} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div>
          <p style={{ fontSize: 12, color: "#1A1A1A", fontWeight: 600, margin: 0 }}>{a.ch}</p>
          <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>{a.acct}</p>
        </div>
        <p style={{ fontSize: 12, color: "#1A1A1A", fontWeight: 600, margin: 0 }}>{a.bal}</p>
      </div>
    ))}
  </div>
);

const RiskMockup = () => {
  const segs = [
    { label: "Pass", pct: 68, c: "#0A0A0A" },
    { label: "Watch List", pct: 18, c: "#525252" },
    { label: "Substandard", pct: 8, c: "#9B9B9B" },
    { label: "Doubtful", pct: 4, c: "#C7C7C2" },
    { label: "Loss", pct: 2, c: "#E5E5E0" },
  ];
  const R = 56, C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div style={mockShell}>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={R} fill="none" stroke="#F5F5F0" strokeWidth="16" />
          {segs.map((s) => {
            const len = (s.pct / 100) * C;
            const el = (
              <circle key={s.label} cx="70" cy="70" r={R} fill="none" stroke={s.c} strokeWidth="16"
                strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset}
                transform="rotate(-90 70 70)" />
            );
            offset += len;
            return el;
          })}
          <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1A1A1A">CAMEL</text>
          <text x="70" y="86" textAnchor="middle" fontSize="10" fill="#9B9B9B">1,284 loans</text>
        </svg>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {segs.map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: s.c }} />
              <span style={{ color: "#1A1A1A", flex: 1 }}>{s.label}</span>
              <span style={{ color: "#6B6B6B", fontWeight: 600 }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CalendarMockup = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const deadlines: Record<number, string> = { 7: "#DC2626", 10: "#DC2626", 14: "#D97706", 21: "#D97706", 28: "#22C55E" };
  return (
    <div style={mockShell}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>May 2026</span>
        <div style={{ display: "flex", gap: 8, fontSize: 10, color: "#9B9B9B" }}>
          <span>● Due 7d</span><span>● Due 14d</span><span>● Filed</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} style={{ fontSize: 10, color: "#9B9B9B", textAlign: "center", padding: "4px 0" }}>{d}</div>
        ))}
        {days.map((d) => (
          <div key={d} style={{
            aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "#F5F5F0", borderRadius: 6, fontSize: 11, color: "#1A1A1A", fontWeight: 500, position: "relative",
          }}>
            {d}
            {deadlines[d] && <span style={{ width: 5, height: 5, borderRadius: "50%", background: deadlines[d], marginTop: 2 }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardHealthMockup = () => (
  <div style={mockShell}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="32" fill="none" stroke="#F5F5F0" strokeWidth="8" />
        <circle cx="40" cy="40" r="32" fill="none" stroke="#0A0A0A" strokeWidth="8"
          strokeDasharray={`${2 * Math.PI * 32 * 0.94} ${2 * Math.PI * 32}`}
          transform="rotate(-90 40 40)" strokeLinecap="round" />
        <text x="40" y="44" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1A1A1A">94</text>
      </svg>
      <div>
        <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0, letterSpacing: "0.06em" }}>HEALTH SCORE</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: "2px 0 0" }}>Bayelsa Microfinance</p>
        <p style={{ fontSize: 11, color: "#6B6B6B", margin: 0 }}>State MFB · CBN License #00284</p>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
      {[
        { lbl: "Ready", val: 12, c: "#0A0A0A" },
        { lbl: "Processing", val: 2, c: "#D97706" },
        { lbl: "Pending", val: 3, c: "#9B9B9B" },
        { lbl: "Failed", val: 0, c: "#DC2626" },
      ].map((s) => (
        <div key={s.lbl} style={{ background: "#F5F5F0", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: s.c, margin: 0 }}>{s.val}</p>
          <p style={{ fontSize: 10, color: "#6B6B6B", margin: 2, letterSpacing: "0.04em" }}>{s.lbl.toUpperCase()}</p>
        </div>
      ))}
    </div>
  </div>
);

const mockShell: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 16,
  border: "1px solid rgba(0,0,0,0.07)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
  padding: 24,
};

/* ───────── Row ───────── */

type FeatureRowProps = {
  title: string;
  description: string;
  bullets: string[];
  mockup: ReactNode;
  index: number;
};

const FeatureRow = ({ title, description, bullets, mockup, index }: FeatureRowProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", marginBottom: 120 }}>
      <motion.div
        style={{ order: isEven ? 1 : 2 }}
        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h3 style={{ fontSize: 32, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 16 }}>{title}</h3>
        <p style={{ fontSize: 15, color: "#6B6B6B", lineHeight: 1.7, marginBottom: 24 }}>{description}</p>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {bullets.map((b) => (
            <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#1A1A1A", lineHeight: 1.5 }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        style={{ order: isEven ? 2 : 1 }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={isInView ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {mockup}
      </motion.div>
    </div>
  );
};

/* ───────── Section ───────── */

const features = [
  {
    title: "16 mandatory returns. One upload.",
    description: "Upload your CBS export and RegCo generates a submission-ready CBN-formatted return in under 5 minutes. All 16 returns across 5 regulators.",
    bullets: [
      "All CBN returns — MFB Regulatory, Prudential, Forex, Monetary Policy",
      "NFIU — AML/CFT, Regulatory Return, International Transfers",
      "SCUML Annual Compliance, NDIC Premium, FIRS VAT/PAYE/WHT/CIT",
    ],
    mockup: <ReportGenMockup />,
  },
  {
    title: "AML flagging on every transaction.",
    description: "Upload transaction data and RegCo instantly applies 6 CBN-compliant AML rules. Flag suspicious activity before it becomes a regulatory problem.",
    bullets: [
      "CTR detection — flags transactions ≥ ₦5,000,000",
      "Structuring detection — flags transactions just below threshold",
      "Velocity analysis — flags accounts above ₦10M in 24 hours",
      "Dormant account and round-figure detection",
    ],
    mockup: <TxMonitorMockup />,
  },
  {
    title: "Every customer. One screen.",
    description: "Search any customer by BVN or account number. See all their accounts across every channel, KYC status, and transaction history — without logging into five systems.",
    bullets: [
      "Search by BVN, account number, name, or phone",
      "All accounts across core banking, mobile, agency",
      "KYC completeness status at a glance",
      "Full transaction history with filters",
    ],
    mockup: <Customer360Mockup />,
  },
  {
    title: "CBN CAMEL classification. Automatic.",
    description: "Upload your loan portfolio and every borrower is classified under CBN's CAMEL framework. Provision amounts calculated at CBN rates automatically.",
    bullets: [
      "Pass, Watch List, Substandard, Doubtful, Loss — instant classification",
      "Provision rates at CBN-prescribed percentages",
      "Customer risk lookup — instant score from any account number",
    ],
    mockup: <RiskMockup />,
  },
  {
    title: "Never miss a deadline.",
    description: "Every CBN, NFIU, SCUML, NDIC and FIRS filing deadline for the year, colour-coded by urgency. Your compliance score updates as you file.",
    bullets: [
      "Red — due within 7 days",
      "Orange — due within 14 days",
      "Green — filed on time",
      "Compliance score recalculates automatically",
    ],
    mockup: <CalendarMockup />,
  },
  {
    title: "Your compliance health. Live.",
    description: "The dashboard shows exactly how many reports you've generated, how many failed, your calendar progress, and your overall compliance health score — updated in real time.",
    bullets: [
      "Live report status — Ready, Processing, Pending, Failed",
      "Monthly filing progress bar",
      "Compliance health score out of 100",
      "Live updates without page refresh",
    ],
    mockup: <DashboardHealthMockup />,
  },
];

const FeaturesSection = () => (
  <section id="features" style={{ background: "#F5F5F0", padding: "120px 0" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <p style={{ ...labelChip, textAlign: "center", marginBottom: 16 }}>FEATURES</p>
      <h2 style={{ fontSize: 44, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-1.2px", textAlign: "center", marginBottom: 16, lineHeight: 1.1 }}>
        Everything a compliance<br />team needs.
      </h2>
      <p style={{ fontSize: 15, color: "#6B6B6B", textAlign: "center", maxWidth: 480, margin: "0 auto 80px", lineHeight: 1.65 }}>
        Built specifically for Nigerian licensed financial institutions. Every feature designed around CBN, NFIU, SCUML, NDIC and FIRS requirements.
      </p>

      {features.map((f, i) => (
        <FeatureRow key={f.title} {...f} index={i} />
      ))}
    </div>
  </section>
);

export default FeaturesSection;
