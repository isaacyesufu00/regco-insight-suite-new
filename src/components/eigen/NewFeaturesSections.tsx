import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Search, CreditCard, Shield, Activity, AlertTriangle, CheckCircle } from "lucide-react";

/* ============ SECTION A — CUSTOMER 360 ============ */
export const Customer360Section = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const textX = useTransform(scrollYProgress, [0, 0.4], [-60, 0]);
  const mockupY = useTransform(scrollYProgress, [0, 0.4], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const features = [
    { icon: Search, text: "Search any customer by BVN, account number, name, or phone — results in under a second" },
    { icon: CreditCard, text: "See every account across every channel — core banking, mobile, agency, cards — in one view" },
    { icon: Shield, text: "Instant KYC completeness check — know exactly what documents are missing" },
    { icon: Activity, text: "Full transaction history across all channels with date, amount, and channel filters" },
    { icon: AlertTriangle, text: "All AML alerts linked to that customer surfaced immediately — no manual searching" },
  ];

  const metrics = [
    { label: "Accounts", value: "3", alert: false },
    { label: "Transactions", value: "47", alert: false },
    { label: "AML Alerts", value: "1", alert: true },
    { label: "KYC Missing", value: "2", alert: true },
  ];

  const accounts = [
    { acc: "0123456789", type: "Savings", channel: "Core Banking", balance: "₦2,340,000", status: "active" },
    { acc: "9876543210", type: "Current", channel: "Mobile App", balance: "₦450,000", status: "active" },
    { acc: "5544332211", type: "Agent", channel: "Agency Banking", balance: "₦88,500", status: "dormant" },
  ];

  return (
    <section ref={sectionRef} style={{ background: "#FFFFFF", padding: "112px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <motion.div style={{ x: textX, opacity }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>NEW — CUSTOMER INTELLIGENCE</p>
          <h2 style={{ fontSize: 44, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-1.5px", lineHeight: 1.08, marginBottom: 20 }}>
            Every customer.<br />One screen.<br />Every channel.
          </h2>
          <p style={{ fontSize: 16, color: "#6B6B6B", lineHeight: 1.75, marginBottom: 28, maxWidth: 420 }}>
            Your customers interact with your bank across core banking, mobile app, agency banking, and cards. Until now, investigating any one customer meant logging into five different systems and stitching everything together in Excel. Customer 360 ends that.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <item.icon size={13} color="#FFFFFF" />
                </div>
                <p style={{ fontSize: 14, color: "#525252", lineHeight: 1.6, margin: 0 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
          <a href="/book-demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0A0A0A", color: "#FFFFFF", borderRadius: 8, padding: "11px 22px", fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.02em" }}>
            See Customer 360 in action →
          </a>
        </motion.div>

        <motion.div style={{ y: mockupY, opacity }}>
          <div style={{ background: "#F5F5F0", borderRadius: 20, padding: 8, boxShadow: "0 32px 80px rgba(0,0,0,0.12)" }}>
            <div style={{ background: "#FFFFFF", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: 20, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F5F5F0", borderRadius: 10, padding: "10px 14px" }}>
                  <Search size={14} color="#9B9B9B" />
                  <span style={{ fontSize: 13, color: "#9B9B9B" }}>Search by BVN, account number, or name...</span>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ background: "#0A0A0A", borderRadius: 10, padding: "16px 20px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>A</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Adebayo Williams</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>BVN: 22345678901 · Retail</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(252,198,0,0.2)", color: "#FCD34D", borderRadius: 999, padding: "3px 10px" }}>KYC INCOMPLETE</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
                  {metrics.map(m => (
                    <div key={m.label} style={{ background: m.alert ? "#FEF2F2" : "#F5F5F0", borderRadius: 8, padding: 10, textAlign: "center", border: m.alert ? "1px solid rgba(220,38,38,0.15)" : "none" }}>
                      <p style={{ fontSize: 18, fontWeight: 800, color: m.alert ? "#DC2626" : "#0A0A0A", margin: "0 0 2px" }}>{m.value}</p>
                      <p style={{ fontSize: 10, color: "#9B9B9B", margin: 0 }}>{m.label}</p>
                    </div>
                  ))}
                </div>
                {accounts.map(acc => (
                  <div key={acc.acc} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", margin: 0, fontFamily: "monospace" }}>{acc.acc}</p>
                      <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>{acc.type} · {acc.channel}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", margin: "0 0 2px" }}>{acc.balance}</p>
                      <span style={{ fontSize: 10, fontWeight: 600, color: acc.status === "active" ? "#16A34A" : "#9B9B9B", background: acc.status === "active" ? "#F0FDF4" : "#F5F5F5", borderRadius: 999, padding: "1px 6px" }}>
                        {acc.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ============ SECTION B — TRANSACTION FRAUD PREVENTION ============ */
type Txn = { name: string; account: string; amount: string; flag: string | null; severity: "critical" | "high" | "medium" | null; time: string; clean: boolean };

const demoTxns: Txn[] = [
  { name: "Emeka Okafor", account: "0123456789", amount: "₦6,500,000", flag: "CTR", severity: "critical", time: "just now", clean: false },
  { name: "Blessing Adeyemi", account: "0987654321", amount: "₦145,000", flag: null, severity: null, time: "8s ago", clean: true },
  { name: "Fatima Al-Hassan", account: "0112233445", amount: "₦4,750,000", flag: "STRUCTURING", severity: "high", time: "12s ago", clean: false },
  { name: "Chukwudi Obi", account: "0556677889", amount: "₦3,000,000", flag: "ROUND FIGURE", severity: "medium", time: "18s ago", clean: false },
  { name: "Ngozi Eze", account: "0443322110", amount: "₦78,500", flag: null, severity: null, time: "24s ago", clean: true },
  { name: "Yusuf Ibrahim", account: "0667788990", amount: "₦12,000,000", flag: "VELOCITY", severity: "critical", time: "31s ago", clean: false },
];

const FEED_CAP = 5;
const LiveFeedDemo = () => {
  const [displayedTxns, setDisplayedTxns] = useState<(Txn & { uid: string })[]>(
    demoTxns.slice(0, FEED_CAP).map((t, i) => ({ ...t, uid: `init-${i}` }))
  );
  useEffect(() => {
    let pointer = FEED_CAP % demoTxns.length;
    const interval = setInterval(() => {
      const next = { ...demoTxns[pointer], time: "just now", uid: `${Date.now()}-${pointer}` };
      pointer = (pointer + 1) % demoTxns.length;
      setDisplayedTxns(prev => [next, ...prev].slice(0, FEED_CAP));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden",
      maxWidth: 760, margin: "0 auto 72px",
      height: 344, display: "flex", flexDirection: "column", flexShrink: 0, position: "relative",
    }}>
      <div style={{ padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, height: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>Live Transaction Feed</span>
        </div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Screening in real time</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <AnimatePresence initial={false}>
          {displayedTxns.map((txn, i) => (
            <motion.div
              key={txn.uid}
              initial={{ opacity: 0, y: -52, height: 0 }}
              animate={{ opacity: Math.max(0.25, 1 - i * 0.18), y: 0, height: 52 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], height: { duration: 0.28 } }}
              style={{
                padding: "0 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
                borderLeft: `3px solid ${!txn.clean ? (txn.severity === "critical" ? "#DC2626" : txn.severity === "high" ? "#D97706" : "#2563EB") : "transparent"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {!txn.clean && <AlertTriangle size={14} color={txn.severity === "critical" ? "#FCA5A5" : "#FCD34D"} />}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF", margin: 0 }}>{txn.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>{txn.account} · {txn.time}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>{txn.amount}</p>
                {txn.clean ? (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#4ADE80" }}>CLEAN ✓</span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 700, background: txn.severity === "critical" ? "rgba(220,38,38,0.2)" : txn.severity === "high" ? "rgba(217,119,6,0.2)" : "rgba(37,99,235,0.2)", color: txn.severity === "critical" ? "#FCA5A5" : txn.severity === "high" ? "#FCD34D" : "#93C5FD", borderRadius: 999, padding: "3px 8px" }}>
                    {txn.flag}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.97) 100%)",
          pointerEvents: "none", zIndex: 2,
        }} />
      </div>
    </div>
  );
};

export const FraudPreventionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const rules = [
    { title: "Currency Transaction Report", rule: "Flags every transaction ≥ ₦5,000,000. CBN-mandated CTR threshold.", icon: "₦" },
    { title: "Structuring Detection", rule: "Flags transactions just below ₦5M threshold — classic smurfing pattern.", icon: "⚖" },
    { title: "Velocity Analysis", rule: "Flags accounts transacting more than ₦10M in any 24-hour window.", icon: "⚡" },
    { title: "Round Figure Analysis", rule: "Flags suspiciously exact round-million transactions unusual in normal commerce.", icon: "⬤" },
    { title: "Dormant Account Alert", rule: "Flags accounts inactive for 90+ days that suddenly receive large transactions.", icon: "💤" },
    { title: "Narration Mismatch", rule: "Flags transactions where the narration contradicts the transaction type.", icon: "📝" },
  ];

  return (
    <section ref={sectionRef} style={{ background: "#0A0A0A", padding: "112px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 40px" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>NEW — TRANSACTION FRAUD PREVENTION</p>
          <h2 style={{ fontSize: 52, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-1.8px", lineHeight: 1.06, marginBottom: 16 }}>
            Catch fraud before<br />it becomes a fine.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>
            Real-time payment screening across every channel. RegCo applies 6 CBN AML rules the moment a transaction posts — and alerts your compliance officer in under 2 seconds.
          </p>
        </motion.div>

        <LiveFeedDemo />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, maxWidth: 900, margin: "0 auto" }}>
          {rules.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", padding: "20px 22px" }}
            >
              <p style={{ fontSize: 20, marginBottom: 10 }}>{rule.icon}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", margin: "0 0 6px" }}>{rule.title}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6 }}>{rule.rule}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============ SECTION C — SANCTIONS & RISK SCREENING ============ */
export const ScreeningSection = () => {
  const lists = [
    "UN Security Council Consolidated List",
    "OFAC SDN List — US Treasury",
    "EU Consolidated Sanctions",
    "UK HM Treasury Sanctions",
    "CBN Terrorism Watchlist",
  ];

  return (
    <section style={{ background: "#F5F5F0", padding: "112px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 40px" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>NEW — RISK SCREENING</p>
          <h2 style={{ fontSize: 48, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-1.5px", lineHeight: 1.08, marginBottom: 16 }}>
            Know who you're<br />doing business with.
          </h2>
          <p style={{ fontSize: 17, color: "#6B6B6B", maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>
            Before onboarding a customer or approving a transaction, screen them against global sanctions lists, PEP databases, and adverse media — in under a second.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "#0A0A0A", borderRadius: 20, padding: 40, gridColumn: "span 3" }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>SANCTIONS SCREENING</p>
            <h3 style={{ fontSize: 32, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.8px", lineHeight: 1.1, marginBottom: 16 }}>
              Five global sanctions lists.<br />Checked instantly.
            </h3>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>
              RegCo checks every customer against the UN Security Council list, OFAC SDN list, EU Consolidated Sanctions, UK HM Treasury, and the regulated CBN watchlist — automatically, every time.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lists.map((list, i) => (
                <motion.div
                  key={list}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <CheckCircle size={14} color="#4ADE80" />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{list}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "#FFFFFF", borderRadius: 20, padding: 40, border: "1px solid rgba(0,0,0,0.07)", gridColumn: "span 2" }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>PEP IDENTIFICATION</p>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 14 }}>
              Politically Exposed Persons — identified automatically.
            </h3>
            <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7, marginBottom: 24 }}>
              CBN requires Enhanced Due Diligence for PEPs. RegCo identifies politicians, government officials, and their associates from our regulated PEP database — so you know before you onboard.
            </p>
            <div style={{ background: "#FFFBEB", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#D97706", margin: "0 0 4px" }}>PEP MATCH EXAMPLE</p>
              <p style={{ fontSize: 13, color: "#1A1A1A", margin: 0, fontFamily: "monospace" }}>
                "Adamu Musa" → Matches: State Governor, Kano State<br />
                <span style={{ color: "#D97706" }}>Action required: Enhanced Due Diligence</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "#FFFFFF", borderRadius: 20, padding: 40, border: "1px solid rgba(0,0,0,0.07)" }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>ADVERSE MEDIA</p>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 14 }}>
              Crime records and adverse news — checked at onboarding.
            </h3>
            <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7 }}>
              Screen customers against regulated crime records and adverse media databases. Know if a new customer has a history of fraud, financial crime, or regulatory violations before they become your problem.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
