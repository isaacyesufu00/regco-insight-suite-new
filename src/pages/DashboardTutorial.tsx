import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/* ─── helper: map a step index (0-11) to a scroll range ─── */
const stepRange = (i: number): [number, number] => [i / 12, (i + 1) / 12];

/* ─── tiny mock components for the right-side panels ─── */
const MockStatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", flex: 1, minWidth: 100 }}>
    <p style={{ fontSize: 11, color: "#86868B" }}>{label}</p>
    <p style={{ fontSize: 22, fontWeight: 700, color }}>{value}</p>
  </div>
);

const MockTableRow = ({ name, status, color }: { name: string; status: string; color: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
    <span style={{ fontSize: 13, color: "#1D1D1F" }}>{name}</span>
    <span style={{ fontSize: 11, fontWeight: 600, color, background: `${color}15`, padding: "3px 10px", borderRadius: 20 }}>{status}</span>
  </div>
);

const ValidationRow = ({ label, passed, error, delay }: { label: string; passed: boolean; error?: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
  >
    <span style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: passed ? "#34C75920" : "#FF3B3020", fontSize: 12, color: passed ? "#34C759" : "#FF3B30" }}>
      {passed ? "✓" : "✕"}
    </span>
    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", flex: 1 }}>{label}</span>
    <span style={{ fontSize: 11, color: passed ? "#34C759" : "#FF3B30" }}>{passed ? "Passed" : "Failed"}</span>
  </motion.div>
);

/* ─── Step wrapper ─── */
function TutorialStep({ index, scrollYProgress, children }: { index: number; scrollYProgress: any; children: React.ReactNode }) {
  const [start, end] = stepRange(index);
  const fadeIn = start + 0.02;
  const fadeOut = end - 0.02;
  const opacity = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [1.03, 1, 1, 0.97]);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        scale,
        pointerEvents: "none",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1100, padding: "0 40px", pointerEvents: "auto" }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Reusable left-right layout ─── */
function StepLayout({ step, heading, body, children }: { step: string; heading: string; body: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 60, alignItems: "center" }} className="flex-col md:flex-row">
      <div style={{ flex: "0 0 40%", minWidth: 0 }}>
        <p style={{ fontSize: 12, color: "#0066CC", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{step}</p>
        <h2 style={{ fontSize: 44, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.5px" }}>{heading}</h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 380 }}>{body}</p>
      </div>
      <div style={{ flex: "0 0 55%" }} className="w-full md:w-auto">
        {children}
      </div>
    </div>
  );
}

/* ─── Mockup card wrapper ─── */
function MockupCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#F5F5F7",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 0 80px rgba(0,102,204,0.12)",
      padding: 20,
    }}>
      {children}
    </div>
  );
}

export default function DashboardTutorial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scrollYProgress } = useScroll({ target: containerRef });

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const completeTutorial = async () => {
    if (user) {
      await supabase.from("profiles").update({ tutorial_completed: true }).eq("id", user.id);
    }
  };

  const scrollToStep = (step: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    const target = (step / 12) * totalHeight;
    window.scrollTo({ top: containerRef.current.offsetTop + target, behavior: "smooth" });
  };

  const handleFinish = async (path: string) => {
    await completeTutorial();
    navigate(path);
  };

  return (
    <div ref={containerRef} style={{ height: "1200vh", background: "#000", position: "relative" }}>
      {/* Sticky viewport */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* ─── Exit button ─── */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{ position: "absolute", top: 20, right: 28, zIndex: 50, fontSize: 13, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          Exit Tutorial ×
        </button>

        {/* ─── Progress line (right edge) ─── */}
        <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", height: "60vh", width: 2, zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: 11, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, whiteSpace: "nowrap" }}>Tutorial</p>
          <div style={{ flex: 1, width: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
            <motion.div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: progressHeight, background: "#0066CC", borderRadius: 2 }} />
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                top: `${(i / 11) * 100}%`,
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
              }} />
            ))}
          </div>
          <motion.p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
            {/* Step counter rendered via scroll */}
            12 steps
          </motion.p>
        </div>

        {/* ─── Nav buttons (left edge) ─── */}
        <div style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 50 }}>
          <button
            onClick={() => {
              const curr = Math.round((window.scrollY / (containerRef.current!.scrollHeight - window.innerHeight)) * 12);
              scrollToStep(Math.max(0, curr - 1));
            }}
            style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ChevronUp size={18} color="rgba(255,255,255,0.6)" />
          </button>
          <button
            onClick={() => {
              const curr = Math.round((window.scrollY / (containerRef.current!.scrollHeight - window.innerHeight)) * 12);
              scrollToStep(Math.min(11, curr + 1));
            }}
            style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ChevronDown size={18} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        {/* ═══════════ STEP 1 — Welcome ═══════════ */}
        <TutorialStep index={0} scrollYProgress={scrollYProgress}>
          <div style={{ textAlign: "center" }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>RegCo</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ fontSize: 56, fontWeight: 700, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1.1, margin: "16px 0" }}>Your compliance, automated.</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} style={{ fontSize: 19, color: "rgba(255,255,255,0.55)", maxWidth: 480, margin: "0 auto" }}>This 5-minute tutorial walks you through generating your first CBN return.</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 40 }}>
              <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>Scroll to begin ↓</motion.span>
            </motion.p>
          </div>
        </TutorialStep>

        {/* ═══════════ STEP 2 — Dashboard Overview ═══════════ */}
        <TutorialStep index={1} scrollYProgress={scrollYProgress}>
          <StepLayout step="Step 01" heading="Your compliance home." body="When you first sign in you land on the Dashboard. This shows your compliance health at a glance — pending reports, upcoming deadlines, and recent activity.">
            <MockupCard>
              <div style={{ background: "#1D1D1F", borderRadius: 12, padding: "13px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2D2D2F", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15 }}>✦</div>
                <div><p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Institution</p><p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Nakdnx MFB</p></div>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <MockStatCard label="Pending" value="3" color="#FF9F0A" />
                <MockStatCard label="Processing" value="1" color="#0066CC" />
                <MockStatCard label="Ready" value="8" color="#34C759" />
                <MockStatCard label="Failed" value="0" color="#FF3B30" />
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1D1D1F", marginBottom: 10 }}>Recent Reports</p>
                <MockTableRow name="CBN Monetary Policy Return" status="Ready" color="#34C759" />
                <MockTableRow name="AML/CFT Report" status="Processing" color="#0066CC" />
                <MockTableRow name="NDIC Premium Return" status="Pending" color="#FF9F0A" />
              </div>
            </MockupCard>
          </StepLayout>
        </TutorialStep>

        {/* ═══════════ STEP 3 — Selecting Report Type ═══════════ */}
        <TutorialStep index={2} scrollYProgress={scrollYProgress}>
          <StepLayout step="Step 02" heading="Choose what to file." body="Click Create Report in the sidebar. You will see all 16 return types grouped by regulator — CBN, NFIU, SCUML, NDIC, and FIRS. Select the return your institution needs to file this month.">
            <MockupCard>
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {["CBN", "NFIU", "SCUML", "NDIC", "FIRS"].map((tab, i) => (
                  <motion.div
                    key={tab}
                    animate={i === 0 ? { scale: [1, 0.95, 1] } : {}}
                    transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 4 }}
                    style={{
                      padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: i === 0 ? "#1D1D1F" : "#E8E8ED",
                      color: i === 0 ? "#fff" : "#86868B",
                    }}
                  >{tab}</motion.div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {["MFB Regulatory Return", "Monetary Policy Return", "Forex Return", "Credit Bureau Report"].map((name, i) => (
                  <motion.div
                    key={name}
                    animate={i === 0 ? { boxShadow: ["0 0 0 0px rgba(0,102,204,0)", "0 0 0 3px rgba(0,102,204,0.4)", "0 0 0 0px rgba(0,102,204,0)"] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid rgba(0,0,0,0.08)" }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1D1D1F" }}>{name}</p>
                    <p style={{ fontSize: 11, color: "#86868B", marginTop: 4 }}>CBN</p>
                  </motion.div>
                ))}
              </div>
            </MockupCard>
          </StepLayout>
        </TutorialStep>

        {/* ═══════════ STEP 4 — Downloading Template ═══════════ */}
        <TutorialStep index={3} scrollYProgress={scrollYProgress}>
          <StepLayout step="Step 03" heading="Get the right template." body="Every report type has a downloadable CSV template with the exact column names RegCo expects. Click Download Template and open it in Excel. You will fill in the Amount column with figures from your CBS system.">
            <MockupCard>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>MFB Regulatory Return</p>
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ fontSize: 13, color: "#0066CC", cursor: "pointer", fontWeight: 500 }}
                  >⬇ Download Template</motion.span>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", borderBottom: "2px solid #E8E8ED" }}>
                  <div style={{ padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "#1D1D1F", background: "#F5F5F7" }}>Line Item</div>
                  <div style={{ padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "#1D1D1F", background: "#F5F5F7" }}>Amount</div>
                </div>
                {["Total Assets", "Total Liabilities", "Total Deposits", "Net Loans", "Shareholders' Funds"].map(item => (
                  <div key={item} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", borderBottom: "1px solid #F0F0F2" }}>
                    <div style={{ padding: "7px 12px", fontSize: 12, color: "#1D1D1F" }}>{item}</div>
                    <div style={{ padding: "7px 12px", fontSize: 12, color: "#86868B" }}>—</div>
                  </div>
                ))}
              </div>
            </MockupCard>
          </StepLayout>
        </TutorialStep>

        {/* ═══════════ STEP 5 — Preparing CBS Data ═══════════ */}
        <TutorialStep index={4} scrollYProgress={scrollYProgress}>
          <StepLayout step="Step 04" heading="Prepare your CBS export." body="Open the downloaded template in Excel. In column B enter the figures from your core banking system. You only need the totals — not every transaction. Save the file when done.">
            <MockupCard>
              <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", borderBottom: "2px solid #E8E8ED" }}>
                  <div style={{ padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "#1D1D1F", background: "#F5F5F7" }}>Line Item</div>
                  <div style={{ padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "#1D1D1F", background: "#F5F5F7" }}>Amount (₦)</div>
                </div>
                {[
                  ["Total Assets", "245,000,000"],
                  ["Total Liabilities", "380,000,000"],
                  ["Total Deposits", "1,680,000,000"],
                  ["Net Loans", "890,000,000"],
                  ["Shareholders' Funds", "125,000,000"],
                ].map(([item, val]) => (
                  <div key={item} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", borderBottom: "1px solid #F0F0F2" }}>
                    <div style={{ padding: "7px 12px", fontSize: 12, color: "#1D1D1F" }}>{item}</div>
                    <div style={{ padding: "7px 12px", fontSize: 12, color: "#1D1D1F", fontFamily: "monospace" }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#34C75920", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#34C759" }}>✓</span>
                <span style={{ fontSize: 13, color: "#34C759", fontWeight: 500 }}>Balance Sheet Reconciled — ₦0 difference</span>
              </div>
            </MockupCard>
          </StepLayout>
        </TutorialStep>

        {/* ═══════════ STEP 6 — Uploading File ═══════════ */}
        <TutorialStep index={5} scrollYProgress={scrollYProgress}>
          <StepLayout step="Step 05" heading="Upload to RegCo." body="Drag your completed CBS file onto the upload zone or click to browse. RegCo accepts any Excel or CSV format. If your column names are slightly different from the template that is fine — our smart mapping engine recognises them automatically.">
            <MockupCard>
              <motion.div
                animate={{ borderColor: ["rgba(0,0,0,0.1)", "#0066CC", "rgba(0,0,0,0.1)"] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  border: "2px dashed rgba(0,0,0,0.1)",
                  borderRadius: 16,
                  padding: 40,
                  textAlign: "center",
                  background: "rgba(0,102,204,0.02)",
                }}
              >
                <p style={{ fontSize: 32, marginBottom: 8 }}>📄</p>
                <p style={{ fontSize: 14, color: "#1D1D1F", fontWeight: 500 }}>mfb_return_q1_2026.xlsx</p>
                <p style={{ fontSize: 12, color: "#86868B", marginTop: 4 }}>48 KB · Uploaded</p>
              </motion.div>
              <motion.button
                animate={{ boxShadow: ["0 0 0px rgba(0,102,204,0)", "0 0 20px rgba(0,102,204,0.5)", "0 0 0px rgba(0,102,204,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: "14px 0",
                  background: "#0066CC",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >Generate Report</motion.button>
            </MockupCard>
          </StepLayout>
        </TutorialStep>

        {/* ═══════════ STEP 7 — Validation ═══════════ */}
        <TutorialStep index={6} scrollYProgress={scrollYProgress}>
          <StepLayout step="Step 06" heading="RegCo checks everything first." body="Before generating a single line of your return, RegCo runs 5 validation checks. If any check fails you receive a specific error message telling you exactly what to fix.">
            <MockupCard>
              <div style={{ background: "#1D1D1F", borderRadius: 14, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 14 }}>Validation Checks</p>
                <ValidationRow label="Balance Sheet Reconciliation" passed={true} delay={0} />
                <ValidationRow label="Loan Portfolio Integrity" passed={true} delay={0.3} />
                <ValidationRow label="Deposit Categorisation" passed={true} delay={0.6} />
                <ValidationRow label="Capital Adequacy Ratio" passed={true} delay={0.9} />
                <ValidationRow label="Liquidity Ratio" passed={true} delay={1.2} />
              </div>
            </MockupCard>
          </StepLayout>
        </TutorialStep>

        {/* ═══════════ STEP 8 — Processing ═══════════ */}
        <TutorialStep index={7} scrollYProgress={scrollYProgress}>
          <StepLayout step="Step 07" heading="Generating your return." body="Once validation passes, RegCo's AI engine generates your complete CBN-formatted return. This takes between 2 and 5 minutes. You will receive an email when it is ready.">
            <MockupCard>
              <div style={{ textAlign: "center", padding: 30 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ width: 40, height: 40, border: "3px solid #E8E8ED", borderTopColor: "#0066CC", borderRadius: "50%", margin: "0 auto 16px" }}
                />
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>Generating Report...</p>
                <p style={{ fontSize: 12, color: "#86868B", marginTop: 6 }}>Checking for updates every 8 seconds</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
                  {[
                    { label: "CAR", value: "18.4%" },
                    { label: "Liquidity", value: "31.2%" },
                    { label: "NPL", value: "8.2%" },
                  ].map(m => (
                    <div key={m.label} style={{ background: "#F5F5F7", borderRadius: 10, padding: "8px 16px" }}>
                      <p style={{ fontSize: 10, color: "#86868B" }}>{m.label}</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F" }}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </MockupCard>
          </StepLayout>
        </TutorialStep>

        {/* ═══════════ STEP 9 — Downloading Report ═══════════ */}
        <TutorialStep index={8} scrollYProgress={scrollYProgress}>
          <StepLayout step="Step 08" heading="Download and review." body="When your report is ready click Download Report. Open the file and review every figure carefully before submitting to the CBN portal. RegCo formats the return exactly to CBN specifications.">
            <MockupCard>
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#34C759" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>Report Ready</span>
                </div>
                <p style={{ fontSize: 13, color: "#86868B", marginBottom: 4 }}>CBN MFB Regulatory Return</p>
                <p style={{ fontSize: 12, color: "#86868B" }}>Nakdnx MFB · Q1 2026</p>
                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  {["PDF", "XLSX", "DOCX"].map(f => (
                    <div key={f} style={{ padding: "8px 16px", background: "#F5F5F7", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#1D1D1F" }}>
                      ⬇ {f}
                    </div>
                  ))}
                </div>
              </div>
            </MockupCard>
          </StepLayout>
        </TutorialStep>

        {/* ═══════════ STEP 10 — Transaction Monitoring ═══════════ */}
        <TutorialStep index={9} scrollYProgress={scrollYProgress}>
          <StepLayout step="Step 09" heading="Flag suspicious transactions." body="Upload your monthly transaction extract to Transaction Monitor. RegCo applies 5 AML detection rules. Review each flag and mark transactions for STR reporting.">
            <MockupCard>
              <div style={{ background: "#1D1D1F", borderRadius: 14, padding: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Flagged Transactions</p>
                {[
                  { severity: "Critical", amount: "₦8,500,000", rule: "CTR Threshold", color: "#FF3B30" },
                  { severity: "High", amount: "₦4,200,000", rule: "Structuring", color: "#FF9F0A" },
                  { severity: "Medium", amount: "₦2,100,000", rule: "High Velocity", color: "#FFD60A" },
                ].map((tx, i) => (
                  <motion.div
                    key={tx.rule}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.3 }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: tx.color, background: `${tx.color}20`, padding: "2px 8px", borderRadius: 6 }}>{tx.severity}</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{tx.amount}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{tx.rule}</span>
                  </motion.div>
                ))}
                <motion.button
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ marginTop: 12, padding: "8px 16px", background: "#FF3B30", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >Report STR</motion.button>
              </div>
            </MockupCard>
          </StepLayout>
        </TutorialStep>

        {/* ═══════════ STEP 11 — Loan Portfolio Risk ═══════════ */}
        <TutorialStep index={10} scrollYProgress={scrollYProgress}>
          <StepLayout step="Step 10" heading="Classify your loan book." body="Upload your loan portfolio extract to Risk Analysis. RegCo classifies every borrower using the CBN CAMEL framework and calculates the required provision for each.">
            <MockupCard>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {[
                    { pct: 45, color: "#34C759", offset: 0 },
                    { pct: 20, color: "#FF9F0A", offset: 45 },
                    { pct: 15, color: "#FFD60A", offset: 65 },
                    { pct: 12, color: "#FF6B35", offset: 80 },
                    { pct: 8, color: "#FF3B30", offset: 92 },
                  ].map(s => (
                    <circle
                      key={s.offset}
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke={s.color}
                      strokeWidth="16"
                      strokeDasharray={`${s.pct * 3.14} ${314 - s.pct * 3.14}`}
                      strokeDashoffset={`${-s.offset * 3.14}`}
                      style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                    />
                  ))}
                </svg>
                <div>
                  {[
                    { label: "Pass", pct: "45%", color: "#34C759" },
                    { label: "Watch List", pct: "20%", color: "#FF9F0A" },
                    { label: "Substandard", pct: "15%", color: "#FFD60A" },
                    { label: "Doubtful", pct: "12%", color: "#FF6B35" },
                    { label: "Loss", pct: "8%", color: "#FF3B30" },
                  ].map(c => (
                    <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                      <span style={{ fontSize: 12, color: "#1D1D1F" }}>{c.label}</span>
                      <span style={{ fontSize: 12, color: "#86868B", marginLeft: "auto" }}>{c.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </MockupCard>
          </StepLayout>
        </TutorialStep>

        {/* ═══════════ STEP 12 — Completion ═══════════ */}
        <TutorialStep index={11} scrollYProgress={scrollYProgress}>
          <div style={{ textAlign: "center" }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 32, color: "#fff", fontWeight: 600 }}>RegCo</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ fontSize: 64, fontWeight: 700, color: "#fff", letterSpacing: "-2px", margin: "16px 0" }}>You are ready.</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} style={{ fontSize: 21, color: "rgba(255,255,255,0.55)", marginBottom: 40 }}>Your first CBN return is one upload away.</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => handleFinish("/dashboard/new-report")}
                style={{ padding: "14px 28px", background: "#fff", color: "#1D1D1F", border: "none", borderRadius: 980, fontSize: 17, fontWeight: 600, cursor: "pointer" }}
              >Create My First Report</button>
              <button
                onClick={() => handleFinish("/dashboard")}
                style={{ padding: "14px 28px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 980, fontSize: 17, fontWeight: 600, cursor: "pointer" }}
              >Go to Dashboard</button>
            </motion.div>
          </div>
        </TutorialStep>
      </div>
    </div>
  );
}
