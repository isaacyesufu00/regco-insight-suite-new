import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface Txn {
  id: number;
  name: string;
  acc: string;
  amount: string;
  flag: string | null;
  severity: "critical" | "high" | "medium" | null;
  time: string;
}

const DEMO_TRANSACTIONS: Txn[] = [
  { id: 1, name: "Emeka Okafor", acc: "0123456789", amount: "₦6,500,000", flag: "CTR", severity: "critical", time: "just now" },
  { id: 2, name: "Yusuf Ibrahim", acc: "0667788990", amount: "₦12,000,000", flag: "VELOCITY", severity: "critical", time: "just now" },
  { id: 3, name: "Blessing Adeyemi", acc: "0987654321", amount: "₦145,000", flag: null, severity: null, time: "8s ago" },
  { id: 4, name: "Fatima Al-Hassan", acc: "0112233445", amount: "₦4,750,000", flag: "STRUCTURING", severity: "high", time: "12s ago" },
  { id: 5, name: "Chukwudi Obi", acc: "0334455667", amount: "₦3,000,000", flag: "ROUND FIGURE", severity: "medium", time: "19s ago" },
  { id: 6, name: "Ngozi Eze", acc: "0556677889", amount: "₦78,500", flag: null, severity: null, time: "24s ago" },
  { id: 7, name: "Taiwo Adesanya", acc: "0778899001", amount: "₦5,100,000", flag: "CTR", severity: "critical", time: "31s ago" },
];

const severityColor = (s: string | null) =>
  s === "critical" ? "#FF4444" : s === "high" ? "#FF8C00" : s === "medium" ? "#FFB800" : "#4ADE80";

const LiveFeedDemo = () => {
  const MAX_VISIBLE = 5;
  const [items, setItems] = useState<Txn[]>(DEMO_TRANSACTIONS.slice(0, MAX_VISIBLE));
  const indexRef = useRef(MAX_VISIBLE - 1);

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % DEMO_TRANSACTIONS.length;
      const src = DEMO_TRANSACTIONS[indexRef.current];
      const newItem: Txn = { ...src, id: Date.now() };
      setItems((prev) => [newItem, ...prev].slice(0, MAX_VISIBLE));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(20,20,28,0.95) 0%, rgba(10,10,15,0.95) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 20,
        maxWidth: 720,
        margin: "0 auto 64px",
        height: 420,
        display: "flex",
        flexDirection: "column",
        contain: "layout paint",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)", height: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", animation: "livePulse 1.6s ease-in-out infinite" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>Live Transaction Feed</span>
        </div>
        <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>Screening in real time</span>
      </div>

      <div style={{ position: "relative", height: 340, overflow: "hidden", marginTop: 8 }}>
        <AnimatePresence initial={false}>
          {items.map((txn) => (
            <motion.div
              key={txn.id}
              layout
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                height: 64,
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: txn.flag ? "rgba(255,68,68,0.04)" : "transparent",
                borderLeft: txn.flag ? `2px solid ${severityColor(txn.severity)}` : "2px solid transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {txn.flag && <AlertTriangle size={14} color={severityColor(txn.severity)} />}
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff" }}>{txn.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>{txn.acc} · {txn.time}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{txn.amount}</span>
                {txn.flag ? (
                  <span style={{ fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase", background: "rgba(255,68,68,0.15)", color: "#FF8080", border: "1px solid rgba(255,68,68,0.3)", borderRadius: 4, padding: "3px 8px", fontWeight: 700 }}>
                    {txn.flag}
                  </span>
                ) : (
                  <span style={{ fontSize: 10, color: "rgba(74,222,128,0.8)", fontWeight: 600 }}>CLEAN ✓</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: "linear-gradient(180deg, transparent 0%, rgba(10,10,15,1) 100%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
};

const RULES = [
  { title: "Currency Transaction Report", rule: "Flags every transaction ≥ ₦5,000,000. CBN-mandated CTR threshold.", icon: "₦" },
  { title: "Structuring Detection", rule: "Flags transactions just below ₦5M threshold — classic smurfing pattern.", icon: "⚖" },
  { title: "Velocity Analysis", rule: "Flags accounts transacting more than ₦10M in any 24-hour window.", icon: "⚡" },
  { title: "Round Figure Analysis", rule: "Flags suspiciously exact round-million transactions unusual in normal commerce.", icon: "⬤" },
  { title: "Dormant Account Alert", rule: "Flags accounts inactive for 90+ days that suddenly receive large transactions.", icon: "💤" },
  { title: "Narration Mismatch", rule: "Flags transactions where the narration contradicts the transaction type.", icon: "📝" },
];

const TransactionFraudSection = () => {
  return (
    <section style={{ background: "#0A0A0A", padding: "120px 0", color: "#fff" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
            NEW — Transaction Fraud Prevention
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 56, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-1.5px", lineHeight: 1.06, margin: "0 0 20px" }}>
            Catch fraud before<br />
            <span style={{ fontStyle: "italic", color: "#FF8080" }}>it becomes a fine.</span>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 640, margin: "0 auto" }}>
            Real-time payment screening across every channel. RegCo applies 6 CBN AML rules the moment a transaction posts — and alerts your compliance officer in under 2 seconds.
          </p>
        </div>

        <LiveFeedDemo />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {RULES.map((r) => (
            <div
              key={r.title}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 12 }}>{r.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{r.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: 0 }}>{r.rule}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransactionFraudSection;
