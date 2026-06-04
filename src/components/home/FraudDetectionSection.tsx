import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAKE_TRANSACTIONS = [
  { id: "tx001", account: "00812****7", amount: "₦5,200,000", type: "DEBIT", flag: "CTR", severity: "critical" },
  { id: "tx002", account: "00934****2", amount: "₦4,850,000", type: "CREDIT", flag: "STRUCT", severity: "high" },
  { id: "tx003", account: "01120****5", amount: "₦890,000", type: "DEBIT", flag: null, severity: null },
  { id: "tx004", account: "00671****8", amount: "₦12,400,000", type: "DEBIT", flag: "VELOC", severity: "critical" },
  { id: "tx005", account: "01038****1", amount: "₦2,100,000", type: "CREDIT", flag: null, severity: null },
  { id: "tx006", account: "00788****4", amount: "₦5,000,000", type: "DEBIT", flag: "ROUND", severity: "medium" },
  { id: "tx007", account: "01205****9", amount: "₦340,000", type: "CREDIT", flag: null, severity: null },
  { id: "tx008", account: "00912****3", amount: "₦7,500,000", type: "DEBIT", flag: "VELOC", severity: "high" },
] as const;

type Tx = (typeof FAKE_TRANSACTIONS)[number] & { id: string };

const STAT_PILLS = [
  { rule: "CTR Threshold", detail: "Transactions ≥ ₦5,000,000 auto-flagged", color: "#FF4444" },
  { rule: "Structuring", detail: "Amounts just below ₦5M threshold detected", color: "#FF8C00" },
  { rule: "Velocity", detail: "> ₦10M within any 24-hour window", color: "#FFB800" },
];

const TxRow = ({ tx }: { tx: Tx }) => {
  const flagged = !!tx.flag;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -36 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 36 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1.2fr 0.8fr 0.8fr",
        gap: 12,
        alignItems: "center",
        padding: "14px 16px",
        borderRadius: 8,
        background: flagged ? "rgba(255,68,68,0.05)" : "transparent",
        borderLeft: flagged ? "2px solid #FF4444" : "2px solid transparent",
        fontFamily: "monospace",
        fontSize: 12,
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.7)" }}>{tx.account}</span>
      <span style={{ color: "#fff", fontWeight: flagged ? 600 : 400 }}>{tx.amount}</span>
      <span style={{ color: "rgba(255,255,255,0.55)" }}>{tx.type}</span>
      <span style={{ textAlign: "right" }}>
        {flagged ? (
          <span
            style={{
              fontSize: 9,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              background: "rgba(255,68,68,0.15)",
              color: "#FF8080",
              border: "1px solid rgba(255,68,68,0.3)",
              borderRadius: 4,
              padding: "3px 8px",
              fontWeight: 700,
            }}
          >
            {tx.flag}
          </span>
        ) : (
          <span style={{ fontSize: 10, color: "rgba(74,222,128,0.7)", fontWeight: 600 }}>CLEAN</span>
        )}
      </span>
    </motion.div>
  );
};

const FraudDetectionSection = () => {
  const [transactions, setTransactions] = useState<Tx[]>(
    FAKE_TRANSACTIONS.slice(0, 5).map((t) => ({ ...t, id: `${t.id}-init` }))
  );
  const [flaggedCount, setFlaggedCount] = useState(12);
  const pointerRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      pointerRef.current = (pointerRef.current + 1) % FAKE_TRANSACTIONS.length;
      const src = FAKE_TRANSACTIONS[pointerRef.current];
      const next: Tx = { ...src, id: `${src.id}-${Date.now()}` };
      setTransactions((prev) => [next, ...prev.slice(0, 4)]);
      if (next.flag) setFlaggedCount((c) => c + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        background: "#0A0A0A",
        padding: "112px 0",
        position: "relative",
        contain: "layout paint",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="fraud-grid"
      >
        {/* LEFT — text */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>
            AML & Fraud Detection
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-1.5px", lineHeight: 1.06, margin: "0 0 20px" }}>
            Catch fraud before it{" "}
            <span style={{ fontStyle: "italic", color: "#FF8080" }}>becomes a fine.</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 460 }}>
            RegCo monitors every transaction against 6 CBN AML rules in real time. Currency Transaction Reports, structuring attempts, velocity breaches, and dormant account anomalies are flagged automatically — before your examiner sees them.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {STAT_PILLS.map((item) => (
              <div
                key={item.rule}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  padding: "12px 16px",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{item.rule}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "2px 0 0" }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/transaction-monitor"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.4)",
              paddingBottom: 4,
            }}
          >
            See it in action →
          </a>
        </div>

        {/* RIGHT — Live transaction monitor */}
        <div
          style={{
            height: 460,
            background: "linear-gradient(180deg, rgba(20,20,28,0.95) 0%, rgba(10,10,15,0.95) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            contain: "layout paint",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", animation: "livePulse 1.6s ease-in-out infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>
                Live Transaction Monitor
              </span>
            </div>
            <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>
              NAKDNX MFB
            </span>
          </div>

          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.2fr 0.8fr 0.8fr",
              gap: 12,
              padding: "12px 16px",
              fontSize: 9,
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 700,
            }}
          >
            <span>ACCOUNT</span>
            <span>AMOUNT</span>
            <span>TYPE</span>
            <span style={{ textAlign: "right" }}>STATUS</span>
          </div>

          {/* Feed */}
          <div style={{ position: "relative", height: 300, overflow: "hidden", flex: 1 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              {transactions.map((tx) => (
                <TxRow key={tx.id} tx={tx} />
              ))}
            </AnimatePresence>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 60,
                background: "linear-gradient(180deg, transparent 0%, rgba(10,10,15,1) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
              Analysing in real time
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF4444" }} />
              <span style={{ fontSize: 11, color: "#FF8080", fontWeight: 700, fontFamily: "monospace" }}>
                {flaggedCount} flagged today
              </span>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .fraud-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
};

export default FraudDetectionSection;
