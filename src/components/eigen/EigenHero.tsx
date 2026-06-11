import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const trustedNames = [
  "Central Bank of Nigeria", "NFIU", "SCUML", "NDIC", "FIRS",
  "Nakdnx MFB", "FlexCube", "Ncube", "Finacle",
];

const FONT_SERIF = "'Instrument Serif', Georgia, serif";
const FONT_BODY = "Inter, -apple-system, system-ui, sans-serif";

const RegionCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotate: -2 }}
    animate={{ opacity: 1, y: 0, rotate: -2 }}
    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    style={{
      position: "absolute",
      left: -40,
      top: 120,
      width: 260,
      background: "#d3e3fc",
      borderRadius: 24,
      padding: "22px 24px",
      boxShadow: "rgba(4,23,43,0.05) 0px 0px 0px 1px, rgba(0,0,0,0.10) 0px 20px 30px -10px",
      fontFamily: FONT_BODY,
      zIndex: 3,
    }}
  >
    <div style={{ fontSize: 17, fontWeight: 500, color: "#17191c", marginBottom: 16 }}>Institutions</div>
    {[
      ["Commercial banks", "24"],
      ["Microfinance banks", "873"],
      ["Merchant banks", "6"],
      ["Mortgage banks", "34"],
      ["PSBs / Fintechs", "210"],
    ].map(([label, val]) => (
      <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 14, color: "#17191c" }}>
        <span style={{ color: "#4c4c4c" }}>{label}</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{val}</span>
      </div>
    ))}
  </motion.div>
);

const RegistrationsCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotate: 2 }}
    animate={{ opacity: 1, y: 0, rotate: 2 }}
    transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
    style={{
      position: "absolute",
      right: -30,
      top: 180,
      width: 260,
      background: "#fbe1d1",
      borderRadius: 24,
      padding: "22px 24px",
      boxShadow: "rgba(4,23,43,0.05) 0px 0px 0px 1px, rgba(0,0,0,0.10) 0px 20px 30px -10px",
      fontFamily: FONT_BODY,
      zIndex: 3,
    }}
  >
    <div style={{ fontSize: 15, fontWeight: 500, color: "#5d2a1a", marginBottom: 18 }}>Returns filed</div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 36, color: "#17191c", lineHeight: 1 }}>2.4k</div>
        <div style={{ fontSize: 12, color: "#5d2a1a", marginTop: 8 }}>↑ 5.5% vs last quarter</div>
      </div>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(93,42,26,0.15)" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r="28"
          fill="none"
          stroke="#5d2a1a"
          strokeWidth="6"
          strokeDasharray={`${0.94 * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="40" textAnchor="middle" fontSize="13" fontFamily={FONT_SERIF} fill="#17191c">94%</text>
      </svg>
    </div>
  </motion.div>
);

const ActivationCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotate: -1 }}
    animate={{ opacity: 1, y: 0, rotate: -1 }}
    transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
    style={{
      position: "absolute",
      left: 40,
      bottom: -40,
      width: 280,
      background: "#ffffff",
      borderRadius: 24,
      padding: "22px 24px",
      boxShadow: "rgba(4,23,43,0.05) 0px 0px 0px 1px, rgba(0,0,0,0.10) 0px 20px 30px -10px",
      fontFamily: FONT_BODY,
      zIndex: 3,
    }}
  >
    <div style={{ fontSize: 15, fontWeight: 500, color: "#17191c", marginBottom: 14 }}>Compliance score</div>
    <svg width="100%" height="60" viewBox="0 0 240 60" preserveAspectRatio="none">
      <path d="M0,45 C30,42 50,38 80,32 C110,26 140,28 170,18 C200,10 220,8 240,5" fill="none" stroke="#17191c" strokeWidth="1.5" />
      <circle cx="240" cy="5" r="3" fill="#17191c" />
    </svg>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 12 }}>
      <span style={{ fontFamily: FONT_SERIF, fontSize: 30, color: "#17191c" }}>94.2%</span>
      <span style={{ fontSize: 12, color: "#777b86" }}>vs 81% baseline</span>
    </div>
  </motion.div>
);

const AskAnythingCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
    style={{
      position: "absolute",
      right: 20,
      bottom: -30,
      width: 360,
      background: "#ffffff",
      borderRadius: 20,
      padding: "16px 18px",
      boxShadow: "rgba(4,23,43,0.05) 0px 0px 0px 1px, rgba(0,0,0,0.10) 0px 20px 30px -10px",
      fontFamily: FONT_BODY,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 3,
    }}
  >
    <div>
      <div style={{ fontSize: 15, color: "#17191c", marginBottom: 6 }}>Ask anything…</div>
      <div style={{ fontSize: 12, color: "#a3a6af" }}>"Show me NPL ratio trend"</div>
    </div>
    <div
      style={{
        width: 36, height: 36, borderRadius: 9999, background: "#17191c",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14,
      }}
    >↑</div>
  </motion.div>
);

const EigenHero = () => (
  <section
    id="product"
    style={{
      position: "relative",
      background: "#ffffff",
      paddingTop: 140,
      paddingBottom: 80,
      overflow: "hidden",
      fontFamily: FONT_BODY,
    }}
  >
    {/* Peach radial glow */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(251,225,209,0.85) 0%, rgba(211,227,252,0.35) 45%, rgba(255,255,255,0) 75%)",
        pointerEvents: "none",
      }}
    />

    <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
      <div style={{ position: "relative", textAlign: "center", paddingTop: 60, paddingBottom: 220 }}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: FONT_SERIF,
            fontSize: "clamp(48px, 8vw, 104px)",
            fontWeight: 400,
            color: "#17191c",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: 0,
            maxWidth: 1100,
            marginInline: "auto",
          }}
        >
          Compliance reporting for{" "}
          <span style={{ fontStyle: "italic" }}>Nigerian banks</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: 32,
            fontSize: 18,
            color: "#4c4c4c",
            lineHeight: 1.45,
            maxWidth: 620,
            marginInline: "auto",
          }}
        >
          RegCo is an end-to-end compliance platform built on governed data — generate all 16 mandatory CBN, NFIU, SCUML, NDIC and FIRS returns from one dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginTop: 40 }}
        >
          <Link
            to="/login"
            style={{
              background: "#17191c",
              color: "#fff",
              borderRadius: 9999,
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Get started
          </Link>
          <Link
            to="/book-demo"
            style={{
              color: "#17191c",
              fontSize: 15,
              textDecoration: "none",
              fontWeight: 450,
            }}
          >
            Book a demo
          </Link>
        </motion.div>

        {/* Floating cards */}
        <RegionCard />
        <RegistrationsCard />
        <ActivationCard />
        <AskAnythingCard />
      </div>

      {/* Trusted-by ticker */}
      <div
        style={{
          marginTop: 80,
          borderTop: "1px solid rgba(23,25,28,0.08)",
          borderBottom: "1px solid rgba(23,25,28,0.08)",
          padding: "24px 0",
          display: "flex",
          alignItems: "center",
          gap: 48,
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a3a6af", flexShrink: 0 }}>
          Trusted by
        </span>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: 56, whiteSpace: "nowrap" }}
        >
          {[...trustedNames, ...trustedNames].map((n, i) => (
            <span key={i} style={{ fontSize: 15, color: "#777b86", fontFamily: FONT_SERIF }}>{n}</span>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default EigenHero;
