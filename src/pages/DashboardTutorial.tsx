import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type StepId =
  | "welcome" | "create-report" | "cbs-upload" | "validation" | "report-ready"
  | "transactions" | "customer-360" | "screening" | "board-pack" | "calendar" | "done";

interface Step { id: StepId; title: string; description: string; }

const tutorialSteps: Step[] = [
  { id: "welcome", title: "Welcome to RegCo", description: "RegCo automates every mandatory regulatory return for your institution — CBN, NFIU, SCUML, NDIC, and FIRS. This walkthrough shows you how to use every feature. It takes 3 minutes." },
  { id: "create-report", title: "Generate a regulatory return", description: "Click \"Create Report\" in the sidebar. Select your regulator (CBN, NFIU, etc.), choose the return type, set the period, upload your CBS Excel export, and download your formatted return in under 5 minutes." },
  { id: "cbs-upload", title: "Upload your CBS data", description: "Export your GL trial balance from FlexCube, Ncube, Finacle, or any CBS as Excel. Drag and drop it into the upload zone. RegCo reads the file automatically — no template required." },
  { id: "validation", title: "RegCo validates your figures", description: "Before generating, RegCo checks your balance sheet reconciles, CAR meets the 10% CBN minimum, liquidity ratio is above 20%, and NPL ratio is within threshold. If anything fails, you see exactly what to fix." },
  { id: "report-ready", title: "Download your return", description: "When status shows Ready, click Download. The file opens in any text editor or Word. Review it, then submit to your regulator. Your report appears in My Reports and updates your compliance score." },
  { id: "transactions", title: "Monitor transactions for AML flags", description: "Go to Transactions. Upload your monthly transaction data. RegCo applies 6 CBN AML rules and flags suspicious transactions instantly. Critical flags appear in red. Use the STR Queue to file Suspicious Transaction Reports." },
  { id: "customer-360", title: "Customer 360 — every customer in one search", description: "Go to Customer 360. Search any customer by BVN, account number, or name. See all their accounts across every channel, their KYC status, transaction history, and any AML alerts — in under 10 seconds." },
  { id: "screening", title: "Screen customers against sanctions lists", description: "Go to Risk Screening. Type any name. RegCo checks it against the UN Security Council, OFAC SDN, EU Consolidated, UK HM Treasury, and CBN Watchlist simultaneously. PEPs are identified automatically." },
  { id: "board-pack", title: "Generate your monthly board pack", description: "Go to Board Pack. Select the month. Click Generate. RegCo pulls all your regulatory filings, AML activity, KYC metrics, and screening results into a formatted compliance committee report in 30 seconds." },
  { id: "calendar", title: "Track every filing deadline", description: "The Compliance Calendar shows every CBN, NFIU, SCUML, NDIC and FIRS deadline for the year. Red = due within 7 days. Orange = due within 14 days. Green = filed on time. Your compliance score updates automatically." },
  { id: "done", title: "You're ready to file", description: "Your dashboard is set up. Generate your first CBN return now — it takes under 5 minutes. If you need help at any time, return to this tutorial from the sidebar or contact support at support@regco.com.ng" },
];

const browserUrl = (id: StepId) => {
  const path: Record<StepId, string> = {
    welcome: "dashboard", "create-report": "dashboard/new-report", "cbs-upload": "dashboard/new-report",
    validation: "dashboard/new-report", "report-ready": "dashboard/reports",
    transactions: "dashboard/transactions", "customer-360": "dashboard/customers",
    screening: "dashboard/screening", "board-pack": "dashboard/board-pack",
    calendar: "dashboard/calendar", done: "dashboard",
  };
  return `regco-insight-suite.vercel.app/${path[id]}`;
};

// Mockup content per step
const TutorialMockup = ({ id }: { id: StepId }) => {
  const inner: React.CSSProperties = { padding: 18, height: "100%", overflow: "hidden" };
  const labelRow: React.CSSProperties = { fontSize: 9, color: "#9B9B9B", display: "flex", justifyContent: "space-between", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" };
  const row = (l: string, r: React.ReactNode, bold = false) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 6px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      <span style={{ fontSize: 11.5, color: "#1A1A1A", fontWeight: bold ? 600 : 400 }}>{l}</span>
      <span style={{ fontSize: 11, color: "#0A0A0A", fontWeight: 600 }}>{r}</span>
    </div>
  );

  if (id === "welcome") return (
    <div style={inner}>
      <div style={{ background: "#F5F5F0", borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <p style={{ fontSize: 10, color: "#9B9B9B", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Institution</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", margin: "2px 0 0" }}>Nakdnx Microfinance Bank</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
        {[{ l: "Pending", v: "3" }, { l: "Processing", v: "1" }, { l: "Ready", v: "8" }, { l: "Score", v: "92" }].map((s) => (
          <div key={s.l} style={{ background: "#F5F5F0", borderRadius: 8, padding: "8px 10px" }}>
            <p style={{ fontSize: 9, color: "#9B9B9B", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: "1px 0 0" }}>{s.v}</p>
          </div>
        ))}
      </div>
      <div style={labelRow}><span>Recent reports</span><span>Status</span></div>
      {row("CBN Monetary Policy Return", "Ready")}
      {row("AML/CFT Report", "Processing")}
      {row("NDIC Premium Return", "Pending")}
    </div>
  );

  if (id === "create-report") return (
    <div style={inner}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["CBN", "NFIU", "SCUML", "NDIC", "FIRS"].map((t, i) => (
          <span key={t} style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: i === 0 ? "#0A0A0A" : "rgba(0,0,0,0.05)", color: i === 0 ? "#fff" : "#6B6B6B" }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {["MFB Regulatory Return", "Monetary Policy Return", "Forex Return", "Prudential Return"].map((t, i) => (
          <div key={t} style={{ background: i === 0 ? "#F5F5F0" : "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: "12px 12px" }}>
            <p style={{ fontSize: 9, color: "#9B9B9B", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>CBN</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: "3px 0 0" }}>{t}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (id === "cbs-upload") return (
    <div style={inner}>
      <div style={{ border: "2px dashed rgba(0,0,0,0.18)", borderRadius: 12, padding: "32px 20px", textAlign: "center", background: "#F5F5F0", marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0A0A0A", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 10 }}>↑</div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>Drop your CBS export here</p>
        <p style={{ fontSize: 11, color: "#9B9B9B", margin: "3px 0 0" }}>.xlsx, .csv up to 50MB</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8 }}>
        <span style={{ fontSize: 12, color: "#0A0A0A", fontWeight: 600 }}>GL_Summary.xlsx detected</span>
        <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>✓ Ready</span>
      </div>
    </div>
  );

  if (id === "validation") return (
    <div style={inner}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>Validation Results</span>
        <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>All passed ✓</span>
      </div>
      {[
        ["Balance Sheet", "Reconciled"],
        ["Capital Adequacy", "14.4% (min 10%)"],
        ["Liquidity Ratio", "55.3% (min 20%)"],
        ["NPL Ratio", "4.0% (max 5%)"],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: 12, color: "#1A1A1A" }}>✓ {k}</span>
          <span style={{ fontSize: 11, color: "#0A0A0A", fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>
  );

  if (id === "report-ready") return (
    <div style={inner}>
      <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 12, padding: 16, marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", margin: "4px 0 0" }}>MFB Regulatory Return — Ready</p>
        <p style={{ fontSize: 11, color: "#6B6B6B", margin: "4px 0 0" }}>Generated in 4m 32s · 8 sections complete</p>
      </div>
      <button style={{ width: "100%", padding: "12px", background: "#0A0A0A", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer" }}>DOWNLOAD REPORT →</button>
    </div>
  );

  if (id === "transactions") return (
    <div style={inner}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>AML Flags</span>
        <span style={{ fontSize: 11, color: "#DC2626", fontWeight: 700 }}>3 flagged</span>
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
          <span style={{ fontSize: 9.5, fontWeight: 700, background: r.bg, color: r.c, borderRadius: 999, padding: "3px 8px", letterSpacing: "0.04em" }}>{r.s}</span>
        </div>
      ))}
    </div>
  );

  if (id === "customer-360") return (
    <div style={inner}>
      <div style={{ background: "#F5F5F0", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 11, color: "#9B9B9B" }}>🔍 Search by BVN, account or name</div>
      <div style={{ background: "#F5F5F0", borderRadius: 10, padding: 14, marginBottom: 10 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>Adebayo Williams</p>
        <p style={{ fontSize: 11, color: "#6B6B6B", margin: "2px 0 0" }}>BVN 22154689012 · KYC Tier 2</p>
      </div>
      {row("Savings · 0011223344", "₦248,500")}
      {row("Current · 0099887766", "₦1,820,000")}
      {row("Loan · 0055667788", "-₦450,000")}
    </div>
  );

  if (id === "screening") return (
    <div style={inner}>
      <div style={{ background: "#F5F5F0", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
        <p style={{ fontSize: 10, color: "#9B9B9B", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Search</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: "2px 0 0" }}>Olufemi Adeyemi</p>
      </div>
      <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", margin: 0 }}>CLEAR — No sanctions matches</p>
        <p style={{ fontSize: 11, color: "#6B6B6B", margin: "4px 0 0" }}>Checked: UN · OFAC · EU · UK HMT · CBN</p>
      </div>
    </div>
  );

  if (id === "board-pack") return (
    <div style={inner}>
      <div style={{ background: "#F5F5F0", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
        <p style={{ fontSize: 10, color: "#9B9B9B", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Reporting Month</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: "2px 0 0" }}>May 2026</p>
      </div>
      <div style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>May 2026 — Ready</p>
          <p style={{ fontSize: 11, color: "#9B9B9B", margin: "2px 0 0" }}>Generated 2 days ago</p>
        </div>
        <button style={{ padding: "8px 14px", background: "#0A0A0A", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Download</button>
      </div>
    </div>
  );

  if (id === "calendar") return (
    <div style={inner}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>May 2026</span>
        <span style={{ fontSize: 11, color: "#D97706", fontWeight: 600 }}>3 deadlines</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ fontSize: 9, color: "#9B9B9B", textAlign: "center", padding: 3 }}>{d}</div>
        ))}
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
          const dot: Record<number, string> = { 7: "#DC2626", 10: "#DC2626", 14: "#D97706", 21: "#D97706", 28: "#22C55E" };
          return (
            <div key={d} style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F5F5F0", borderRadius: 4, fontSize: 10, color: "#1A1A1A" }}>
              {d}
              {dot[d] && <span style={{ width: 4, height: 4, borderRadius: "50%", background: dot[d], marginTop: 1 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );

  // done
  return (
    <div style={{ ...inner, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <p style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>All set</p>
      <p style={{ fontSize: 12, color: "#6B6B6B", margin: "6px 0 0" }}>Go to your dashboard to file your first return.</p>
    </div>
  );
};

export default function DashboardTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const total = tutorialSteps.length;
  const step = tutorialSteps[currentStep];

  const finish = async () => {
    if (user) {
      await supabase.from("profiles").update({ tutorial_completed: true }).eq("id", user.id);
    }
    navigate("/dashboard");
  };

  const goNext = () => {
    if (currentStep === total - 1) { void finish(); return; }
    setCurrentStep((p) => p + 1);
  };
  const goBack = () => { if (currentStep > 0) setCurrentStep((p) => p - 1); };
  const nextLabel = currentStep === total - 1
    ? "Go to Dashboard"
    : `Next: ${tutorialSteps[currentStep + 1]?.title?.split(" ").slice(0, 3).join(" ")} →`;

  return (
    <div style={{ minHeight: "calc(100vh - 80px)", background: "#F7F7F5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: 760, background: "#FFFFFF", borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 24px 80px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {/* Mockup area */}
        <div style={{ height: 380, background: "#FAFAF7", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: 28 }}>
          <div style={{ height: "100%", background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: 32, background: "#F5F5F0", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", padding: "0 12px", gap: 6, flexShrink: 0 }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
              ))}
              <div style={{ flex: 1, height: 18, background: "#EAEAE4", borderRadius: 4, marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 9.5, color: "#9B9B9B" }}>{browserUrl(step.id)}</span>
              </div>
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <TutorialMockup id={step.id} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div style={{ padding: "28px 32px 24px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id + "-text"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", margin: 0, letterSpacing: "-0.4px" }}>{step.title}</h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#525252", margin: "8px 0 0" }}>{step.description}</p>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, gap: 16 }}>
            <button onClick={finish} style={{ background: "none", border: "none", color: "#9B9B9B", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
              Skip
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {tutorialSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  aria-label={`Go to step ${i + 1}`}
                  style={{
                    width: i === currentStep ? 20 : 7,
                    height: 7,
                    borderRadius: 999,
                    background: i === currentStep ? "#0A0A0A" : i < currentStep ? "rgba(10,10,10,0.45)" : "rgba(0,0,0,0.15)",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {currentStep > 0 && (
                <button
                  onClick={goBack}
                  style={{ background: "transparent", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 500, color: "#0A0A0A", cursor: "pointer" }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={goNext}
                style={{ background: "#0A0A0A", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}
              >
                {nextLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 18, fontSize: 12, color: "#9B9B9B" }}>
        Step {currentStep + 1} of {total}
      </p>
    </div>
  );
}
