import { useEffect, useRef, useState, ReactNode } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { AlertTriangle, Search, Download, CheckCircle2 } from "lucide-react";

/* ============================================================
   SHARED HELPERS
   ============================================================ */

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 52,
        left: 0,
        right: 0,
        height: 2,
        background: "#0A0A0A",
        zIndex: 100,
        scaleX: scrollYProgress,
        transformOrigin: "left",
      }}
    />
  );
};

export const SectionReveal = ({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(8% 0% 0% 0%)", opacity: 0 }}
      animate={isInView ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

export const ParallaxVisual = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};

export const CharReveal = ({
  text,
  style,
}: {
  text: string;
  style?: React.CSSProperties;
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <h2 ref={ref} style={style}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: i * 0.018,
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </motion.span>
      ))}
    </h2>
  );
};

/* ============================================================
   FEATURE ROW — Medusa alternating grid
   ============================================================ */

type FeatureRowProps = {
  id?: string;
  background: string;
  category: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  visual: ReactNode;
  visualLeft?: boolean;
};

const FeatureRow = ({
  id,
  background,
  category,
  heading,
  body,
  ctaLabel,
  ctaHref,
  visual,
  visualLeft = false,
}: FeatureRowProps) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const TextCol = (
    <motion.div
      initial={{ opacity: 0, x: visualLeft ? 32 : -32 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ padding: "80px 80px", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#9B9B9B",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        {category}
      </p>
      <CharReveal
        text={heading}
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: "#0A0A0A",
          letterSpacing: "-1.5px",
          lineHeight: 1.08,
          margin: 0,
          marginBottom: 20,
        }}
      />
      <p
        style={{
          fontSize: 16,
          color: "#525252",
          lineHeight: 1.75,
          marginBottom: 28,
        }}
      >
        {body}
      </p>
      <a
        href={ctaHref}
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#0A0A0A",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {ctaLabel} →
      </a>
    </motion.div>
  );

  const VisualCol = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: "60px 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 480,
      }}
    >
      <ParallaxVisual>{visual}</ParallaxVisual>
    </motion.div>
  );

  return (
    <section
      ref={ref}
      id={id}
      style={{
        background,
        borderTop: "1px solid rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {visualLeft ? VisualCol : TextCol}
        <div style={{ background: "rgba(0,0,0,0.06)" }} />
        {visualLeft ? TextCol : VisualCol}
      </div>
    </section>
  );
};

/* ============================================================
   VISUAL 1 — REPORT GENERATION (stacked regulator cards)
   ============================================================ */

const ReportStackVisual = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const regs = ["CBN", "NFIU", "SCUML", "NDIC", "FIRS"];

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: 360,
        height: 360,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 240,
          height: 280,
        }}
      >
        {regs.map((reg, i) => {
          const isTop = i === 0;
          return (
            <motion.div
              key={reg}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: i * 14 } : {}}
              transition={{
                delay: 0.1 + (regs.length - i) * 0.08,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "absolute",
                top: 0,
                left: i * 8,
                right: -i * 8,
                height: 76,
                background: isTop ? "#DBEAFE" : "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 12,
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                padding: "18px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: regs.length - i,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#9B9B9B",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  Regulator
                </p>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#0A0A0A",
                    margin: "2px 0 0",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {reg}
                </p>
              </div>
              {isTop && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#0A0A0A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle2 size={14} color="#FFFFFF" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
   VISUAL 2 — LIVE TRANSACTION FEED (FIXED HEIGHT, no shift)
   ============================================================ */

const DEMO_TXNS = [
  { name: "Emeka Okafor", acc: "0123456789", amount: "₦6,500,000", flag: "CTR", severity: "critical", time: "just now" },
  { name: "Yusuf Ibrahim", acc: "0667788990", amount: "₦12,000,000", flag: "VELOCITY", severity: "critical", time: "just now" },
  { name: "Blessing Adeyemi", acc: "0987654321", amount: "₦145,000", flag: null, severity: null, time: "8s ago" },
  { name: "Fatima Al-Hassan", acc: "0112233445", amount: "₦4,750,000", flag: "STRUCTURING", severity: "high", time: "12s ago" },
  { name: "Chukwudi Obi", acc: "0334455667", amount: "₦3,000,000", flag: "ROUND FIGURE", severity: "medium", time: "19s ago" },
  { name: "Ngozi Eze", acc: "0556677889", amount: "₦78,500", flag: null, severity: null, time: "24s ago" },
  { name: "Taiwo Adesanya", acc: "0778899001", amount: "₦5,100,000", flag: "CTR", severity: "critical", time: "31s ago" },
] as const;

type FeedItem = (typeof DEMO_TXNS)[number] & { id: number };

export const LiveFeedDemo = () => {
  const MAX_VISIBLE = 5;
  const [items, setItems] = useState<FeedItem[]>(() =>
    DEMO_TXNS.slice(0, MAX_VISIBLE).map((t, i) => ({ ...t, id: i }))
  );

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % DEMO_TXNS.length;
      setItems((prev) => {
        const next: FeedItem = { ...DEMO_TXNS[i], id: Date.now() };
        return [next, ...prev].slice(0, MAX_VISIBLE);
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        background: "#0A0A0A",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        height: 340,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80" }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>
            Live Transaction Feed
          </span>
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          Screening in real time
        </span>
      </div>

      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <AnimatePresence initial={false}>
          {items.map((txn, index) => (
            <motion.div
              key={txn.id}
              layout="position"
              initial={{ opacity: 0, y: -48 }}
              animate={{ opacity: Math.max(0, 1 - index * 0.18), y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: "13px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderLeft: `3px solid ${
                  txn.severity === "critical"
                    ? "#DC2626"
                    : txn.severity === "high"
                    ? "#D97706"
                    : txn.severity === "medium"
                    ? "#2563EB"
                    : "transparent"
                }`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {txn.flag && (
                  <AlertTriangle
                    size={14}
                    color={txn.severity === "critical" ? "#FCA5A5" : "#FCD34D"}
                  />
                )}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF", margin: 0 }}>
                    {txn.name}
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                    {txn.acc} · {txn.time}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
                  {txn.amount}
                </span>
                {txn.flag ? (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 4,
                      padding: "3px 7px",
                      background:
                        txn.severity === "critical"
                          ? "rgba(220,38,38,0.25)"
                          : txn.severity === "high"
                          ? "rgba(217,119,6,0.25)"
                          : "rgba(37,99,235,0.25)",
                      color:
                        txn.severity === "critical"
                          ? "#FCA5A5"
                          : txn.severity === "high"
                          ? "#FCD34D"
                          : "#93C5FD",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {txn.flag}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#4ADE80" }}>
                    CLEAN ✓
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background:
              "linear-gradient(to bottom, transparent, rgba(10,10,10,0.95))",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

/* ============================================================
   VISUAL 3 — CUSTOMER 360 (search + typing BVN + profile)
   ============================================================ */

const Customer360Visual = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const BVN_TEXT = "22345678901";
  const [typed, setTyped] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const type = () => {
      if (i <= BVN_TEXT.length) {
        setTyped(BVN_TEXT.slice(0, i));
        i++;
        setTimeout(type, 80);
      } else {
        setTimeout(() => setShowProfile(true), 400);
      }
    };
    const initial = setTimeout(type, 600);
    return () => clearTimeout(initial);
  }, [isInView]);

  const accounts = [
    { type: "Savings", channel: "Core Banking", amt: "₦2,340,000", active: true },
    { type: "Current", channel: "Mobile App", amt: "₦450,000", active: true },
    { type: "Agent", channel: "Agency Banking", amt: "₦88,500", active: false },
  ];

  return (
    <div ref={ref} style={{ width: "100%", maxWidth: 460 }}>
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 12,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
          marginBottom: 18,
        }}
      >
        <Search size={16} color="#9B9B9B" />
        <span style={{ fontSize: 14, color: "#0A0A0A", fontFamily: "monospace" }}>
          {typed}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            style={{ display: "inline-block", marginLeft: 2 }}
          >
            |
          </motion.span>
        </span>
      </div>

      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 14,
              padding: 20,
              boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#DBEAFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#1E40AF",
                }}
              >
                A
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>
                  Adebayo Williams
                </p>
                <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>
                  BVN: {BVN_TEXT}
                </p>
              </div>
            </div>
            {accounts.map((a, i) => (
              <motion.div
                key={a.type}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  marginBottom: 6,
                  background: "#FAFAFA",
                  borderLeft: `3px solid ${a.active ? "#0A0A0A" : "#E5E7EB"}`,
                  borderRadius: 6,
                }}
              >
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>
                    {a.type}
                  </p>
                  <p style={{ fontSize: 10, color: "#9B9B9B", margin: 0 }}>{a.channel}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>
                  {a.amt}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================
   VISUAL 4 — SANCTIONS SCREENING
   ============================================================ */

const ScreeningVisual = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const lists = [
    "UN Security Council",
    "OFAC SDN List",
    "EU Consolidated",
    "UK HM Treasury",
    "CBN Watchlist",
  ];

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        maxWidth: 460,
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          background: "#F5F5F0",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: 10,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Search size={14} color="#9B9B9B" />
        <span style={{ fontSize: 13, color: "#0A0A0A", fontWeight: 600 }}>Adamu Musa</span>
      </div>

      {lists.map((list, i) => (
        <div
          key={list}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: i < lists.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: "#525252", flex: 1 }}>{list}</span>
          <div
            style={{
              width: 100,
              height: 4,
              borderRadius: 999,
              background: "rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{
                delay: 0.3 + i * 0.15,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ height: "100%", background: "#16A34A", borderRadius: 999 }}
            />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 + i * 0.15 }}
            style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", minWidth: 50 }}
          >
            ✓ Clear
          </motion.span>
        </div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.6, duration: 0.5 }}
        style={{
          marginTop: 18,
          padding: "12px 16px",
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          borderRadius: 8,
          textAlign: "center",
          fontSize: 13,
          fontWeight: 700,
          color: "#15803D",
        }}
      >
        CLEAR — No matches found
      </motion.div>
    </div>
  );
};

/* ============================================================
   VISUAL 5 — REGULATORY INTEL (news feed, fixed height)
   ============================================================ */

const NEWS_ITEMS = [
  { src: "CBN", title: "Monetary policy rate raised by 50 basis points", time: "12m ago" },
  { src: "NDIC", title: "Revised deposit insurance coverage limits announced", time: "2h ago" },
  { src: "NAIRAMETRICS", title: "NFIU issues advisory on virtual asset service providers", time: "5h ago" },
  { src: "BUSINESSDAY", title: "CBN circular on AML/CFT compliance for microfinance banks", time: "1d ago" },
  { src: "PUNCH", title: "SCUML updates DNFBP registration framework for 2026", time: "2d ago" },
  { src: "VANGUARD", title: "New FX guidelines for international transfers published", time: "3d ago" },
];

const RegulatoryIntelVisual = () => {
  const MAX = 4;
  const [items, setItems] = useState(() =>
    NEWS_ITEMS.slice(0, MAX).map((n, i) => ({ ...n, id: i }))
  );

  useEffect(() => {
    let i = MAX - 1;
    const interval = setInterval(() => {
      i = (i + 1) % NEWS_ITEMS.length;
      setItems((prev) => [{ ...NEWS_ITEMS[i], id: Date.now() }, ...prev].slice(0, MAX));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          background: "#0A0A0A",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          height: 300,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80" }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}>
            Regulatory Intelligence — Live
          </span>
        </div>
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <AnimatePresence initial={false}>
            {items.map((n, index) => (
              <motion.div
                key={n.id}
                layout="position"
                initial={{ opacity: 0, y: -32 }}
                animate={{ opacity: Math.max(0, 1 - index * 0.2), y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  padding: "12px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#93C5FD",
                      letterSpacing: "0.08em",
                      background: "rgba(59,130,246,0.15)",
                      padding: "2px 6px",
                      borderRadius: 3,
                    }}
                  >
                    {n.src}
                  </span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                    {n.time}
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: "#FFFFFF", margin: 0, lineHeight: 1.45 }}>
                  {n.title}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background: "linear-gradient(to bottom, transparent, rgba(10,10,10,0.95))",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 12,
          padding: "14px 18px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A" }}>
            May 2026 Tasks
          </span>
          <span style={{ fontSize: 11, color: "#9B9B9B" }}>8 / 12 completed</span>
        </div>
        <div
          style={{
            height: 6,
            background: "rgba(0,0,0,0.06)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "66.66%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", background: "#0A0A0A", borderRadius: 999 }}
          />
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   VISUAL 6 — BOARD PACK (cards converging into document)
   ============================================================ */

const BoardPackVisual = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const cards = [
    { label: "Returns Filed", value: "8 ✓" },
    { label: "AML Flags", value: "4 (1 crit)" },
    { label: "KYC Rate", value: "87%" },
    { label: "Screened", value: "23" },
  ];

  return (
    <div ref={ref} style={{ width: "100%", maxWidth: 460, position: "relative" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{
              delay: 0.1 + i * 0.1,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 10,
              padding: "14px 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <p style={{ fontSize: 10, color: "#9B9B9B", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {c.label}
            </p>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#0A0A0A", margin: "4px 0 0" }}>
              {c.value}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            background: "#0A0A0A",
            padding: "16px 20px",
            color: "#FFFFFF",
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              margin: 0,
            }}
          >
            COMPLIANCE COMMITTEE REPORT
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, margin: "4px 0 0" }}>May 2026</p>
        </div>
        <div style={{ padding: "10px 0" }}>
          {cards.map((c, i) => (
            <div
              key={c.label}
              style={{
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                borderBottom: i < cards.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
              }}
            >
              <span style={{ fontSize: 12, color: "#525252" }}>{c.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>
                {c.value}
              </span>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 20px", display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              background: "#0A0A0A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 6,
              padding: "8px 14px",
              fontSize: 11,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <Download size={11} /> Download
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ============================================================
   VISUAL 7 — AUDIT TRACKER
   ============================================================ */

const AuditTrackerVisual = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const issues = [
    { ref: "CBN-2026-001", title: "BVN linkage gap", owner: "AO", due: "Jun 15", status: "open", color: "#DC2626", badge: "OPEN" },
    { ref: "CBN-2026-002", title: "KYC documentation refresh", owner: "TI", due: "Jul 02", status: "progress", color: "#D97706", badge: "IN PROGRESS" },
    { ref: "CBN-2026-003", title: "AML training records", owner: "BO", due: "May 28", status: "closed", color: "#9B9B9B", badge: "CLOSED" },
  ];

  return (
    <div ref={ref} style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", gap: 12 }}>
      {issues.map((iss, i) => (
        <motion.div
          key={iss.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3, boxShadow: "0 14px 30px rgba(0,0,0,0.1)" }}
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 12,
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
          }}
        >
          {iss.status === "open" ? (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{ width: 10, height: 10, borderRadius: "50%", background: iss.color, flexShrink: 0 }}
            />
          ) : (
            <div
              style={{ width: 10, height: 10, borderRadius: "50%", background: iss.color, flexShrink: 0 }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 10, fontFamily: "monospace", color: "#9B9B9B", margin: 0 }}>
              {iss.ref}
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#0A0A0A",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {iss.title}
            </p>
            {iss.status === "progress" && (
              <div style={{ height: 3, background: "rgba(0,0,0,0.06)", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "55%" } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  style={{ height: "100%", background: iss.color, borderRadius: 999 }}
                />
              </div>
            )}
          </div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#F5F5F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              color: "#0A0A0A",
              flexShrink: 0,
            }}
          >
            {iss.owner}
          </div>
          <div style={{ fontSize: 11, color: "#9B9B9B", whiteSpace: "nowrap" }}>{iss.due}</div>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              padding: "3px 7px",
              borderRadius: 4,
              background:
                iss.status === "open"
                  ? "rgba(220,38,38,0.1)"
                  : iss.status === "progress"
                  ? "rgba(217,119,6,0.1)"
                  : "rgba(0,0,0,0.05)",
              color: iss.color,
              whiteSpace: "nowrap",
            }}
          >
            {iss.badge}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

/* ============================================================
   EXPORTED MEDUSA GRID
   ============================================================ */

export const MedusaFeatureGrid = () => (
  <div id="features">
    <FeatureRow
      id="reports"
      background="#FFFFFF"
      category="REGULATORY RETURNS"
      heading="16 mandatory returns. One upload."
      body="Upload your CBS export once. RegCo reads it, validates your balance sheet, checks your Capital Adequacy Ratio, Liquidity Ratio, and NPL ratio against CBN thresholds — and generates a submission-ready return in under 5 minutes. All 16 returns across CBN, NFIU, SCUML, NDIC, and FIRS."
      ctaLabel="See all 16 returns"
      ctaHref="#reports"
      visual={<ReportStackVisual />}
    />
    <FeatureRow
      id="fraud-prevention"
      background="#F5F5F0"
      category="TRANSACTION FRAUD PREVENTION"
      heading="Catch fraud before it becomes a fine."
      body="RegCo applies 6 CBN AML rules the moment a transaction posts. Currency Transaction Reports, structuring patterns, velocity anomalies, round-figure transactions, dormant account reactivation, and narration mismatch — all detected in under 2 seconds."
      ctaLabel="See how it works"
      ctaHref="#fraud-prevention"
      visual={<LiveFeedDemo />}
      visualLeft
    />
    <FeatureRow
      background="#FFFFFF"
      category="CUSTOMER INTELLIGENCE"
      heading="Every account. Every channel. One search."
      body="Type any BVN, account number, or customer name. See every account they hold across core banking, mobile, agency, and cards — their KYC completeness, full transaction history, and all AML alerts — in under 10 seconds. No more logging into 5 systems."
      ctaLabel="See Customer 360"
      ctaHref="/book-demo"
      visual={<Customer360Visual />}
    />
    <FeatureRow
      background="#F5F5F0"
      category="RISK SCREENING"
      heading="Five global sanctions lists. Checked in 3 seconds."
      body="Before onboarding any customer, RegCo screens them against the UN Security Council list, OFAC SDN, EU Consolidated Sanctions, UK HM Treasury, and the CBN Terrorism Watchlist — simultaneously. Politically Exposed Persons are identified automatically from our Nigerian PEP database."
      ctaLabel="See how screening works"
      ctaHref="/book-demo"
      visual={<ScreeningVisual />}
      visualLeft
    />
    <FeatureRow
      background="#FFFFFF"
      category="REGULATORY INTELLIGENCE"
      heading="CBN circulars. Live news. Monthly tasks."
      body="Your compliance inbox is replaced by a live intelligence feed. CBN circulars, NDIC updates, and Nigerian banking news from Nairametrics, BusinessDay, Punch, Vanguard, and The Guardian — refreshed every 3 hours. Plus a pre-populated monthly compliance checklist that resets automatically."
      ctaLabel="See Regulatory Intelligence"
      ctaHref="/book-demo"
      visual={<RegulatoryIntelVisual />}
    />
    <FeatureRow
      background="#F5F5F0"
      category="COMPLIANCE REPORTING"
      heading="Your monthly board pack. 30 seconds."
      body="Compliance officers spend 2-3 days every month manually building committee reports. RegCo pulls your regulatory filings, AML activity, KYC metrics, screening results, and task completion — and generates a formatted compliance committee report automatically. What used to take days takes 30 seconds."
      ctaLabel="See Board Pack"
      ctaHref="/book-demo"
      visual={<BoardPackVisual />}
      visualLeft
    />
    <FeatureRow
      background="#FFFFFF"
      category="AUDIT MANAGEMENT"
      heading="Never lose track of an examination finding."
      body="After a CBN examination, log every finding with an owner, a due date, and a remediation plan. Overdue issues are automatically flagged. When an issue is closed, you document the evidence. When CBN examiners return, you have a complete, timestamped trail."
      ctaLabel="See Audit Tracker"
      ctaHref="/book-demo"
      visual={<AuditTrackerVisual />}
    />
  </div>
);
