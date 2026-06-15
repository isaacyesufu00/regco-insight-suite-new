import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { HomepageNavbar, HomepageFooter } from "@/components/regco/HomepageChrome";

const CYCLING_ROLES = [
  "compliance officer.",
  "AML analyst.",
  "CBN filing assistant.",
  "risk manager.",
  "regulatory advisor.",
  "fraud detective.",
];

/* ---------- HERO ---------- */
const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRoleIndex((p) => (p + 1) % CYCLING_ROLES.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      style={{
        background: "#FFFFFF",
        paddingTop: 176,
        paddingBottom: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(44px, 7vw, 80px)",
          fontWeight: 700,
          color: "#0A0A0A",
          letterSpacing: "-2.5px",
          lineHeight: 1.05,
          margin: 0,
          padding: "0 24px",
        }}
      >
        Meet RegCo, your
      </h1>

      <div
        style={{
          height: "clamp(56px, 8.4vw, 92px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          overflow: "hidden",
          marginTop: 8,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={roleIndex}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "block",
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(44px, 7vw, 80px)",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#0A0A0A",
              letterSpacing: "-2.5px",
              lineHeight: 1.05,
              textAlign: "center",
              padding: "0 24px",
              boxSizing: "border-box",
            }}
          >
            {CYCLING_ROLES[roleIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ display: "flex", gap: 12, marginTop: 44, justifyContent: "center", flexWrap: "wrap", padding: "0 24px" }}
      >
        <Link
          to="/book-demo"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            fontWeight: 600,
            color: "#FFFFFF",
            background: "#0A0A0A",
            borderRadius: 8,
            padding: "13px 28px",
            textDecoration: "none",
            letterSpacing: "-0.1px",
          }}
        >
          Request a Demo
        </Link>
        <Link
          to="/product"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            fontWeight: 500,
            color: "#0A0A0A",
            background: "transparent",
            border: "1px solid rgba(0,0,0,0.18)",
            borderRadius: 8,
            padding: "13px 24px",
            textDecoration: "none",
          }}
        >
          See how it works →
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          marginTop: 72,
          width: "100%",
          maxWidth: 980,
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 14,
            boxShadow: "0 24px 80px rgba(0,0,0,0.10)",
            overflow: "hidden",
          }}
        >
          {/* Mock agent UI preview */}
          <div style={{ display: "flex", height: 440 }}>
            <div style={{ width: 200, borderRight: "1px solid rgba(0,0,0,0.08)", padding: 16, display: "flex", flexDirection: "column", gap: 6, background: "#FAFAF8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 800, fontSize: 11 }}>R</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", fontFamily: "var(--font-sans)" }}>RegCo</span>
              </div>
              <div style={{ height: 30, borderRadius: 6, border: "1px solid rgba(0,0,0,0.12)", marginBottom: 10 }} />
              {["Agent", "Live Monitoring", "Reports", "History", "Audit"].map((l, i) => (
                <div key={l} style={{ padding: "6px 8px", fontSize: 12.5, color: i === 0 ? "#0A0A0A" : "rgba(0,0,0,0.55)", fontWeight: i === 0 ? 600 : 400, background: i === 0 ? "rgba(0,0,0,0.05)" : "transparent", borderRadius: 6, fontFamily: "var(--font-sans)" }}>{l}</div>
              ))}
            </div>
            <div style={{ flex: 1, padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 38, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-1.2px", margin: "20px 0 18px" }}>RegCo</h2>
              <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                {["Generate Return", "Screen Customer", "View Alerts"].map((p) => (
                  <span key={p} style={{ fontSize: 11.5, fontWeight: 500, color: "rgba(0,0,0,0.6)", padding: "5px 12px", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 999, fontFamily: "var(--font-sans)" }}>{p}</span>
                ))}
              </div>
              <div style={{ width: "100%", maxWidth: 480, background: "#F8F8F6", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 12, padding: "14px 16px", textAlign: "left" }}>
                <p style={{ fontSize: 12.5, color: "rgba(0,0,0,0.4)", margin: 0, fontFamily: "var(--font-sans)" }}>Ask RegCo Agent anything. Type @ to attach a CBS file.</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
                  <span style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", fontFamily: "var(--font-sans)" }}>📎 Files · Sources</span>
                  <span style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", fontFamily: "var(--font-sans)" }}>↵</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ---------- FELIX-STYLE INSTITUTION SELECTOR ---------- */
const INSTITUTIONS = [
  {
    id: "unit",
    label: "Unit MFBs",
    category: "Filing Automation",
    headline: "File every CBN return.\nIn under 5 minutes.",
    description:
      "Unit MFBs carry the same 16 mandatory regulatory filings as large banks — with a fraction of the compliance staff. RegCo Agent reads your CBS export and generates every return automatically.",
  },
  {
    id: "state",
    label: "State MFBs",
    category: "AML Monitoring",
    headline: "Catch every flag.\nBefore the examiner does.",
    description:
      "State MFBs process thousands of transactions across multiple branches. RegCo screens every one against 6 CBN AML rules and surfaces critical flags within seconds of posting.",
  },
  {
    id: "national",
    label: "National MFBs",
    category: "Governance",
    headline: "Board packs.\nCompliance trail.\nAll automated.",
    description:
      "National MFBs face the same scrutiny as commercial banks. RegCo generates your monthly compliance committee reports, tracks examination findings, and maintains a complete audit trail.",
  },
];

const InstitutionSelector = () => {
  const [active, setActive] = useState(0);
  const inst = INSTITUTIONS[active];
  return (
    <section style={{ background: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div style={{ padding: "64px 48px 0", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 32, alignItems: "baseline", whiteSpace: "nowrap" }}>
          {INSTITUTIONS.map((i, idx) => (
            <button
              key={i.id}
              onClick={() => setActive(idx)}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 700,
                letterSpacing: "-1.5px",
                lineHeight: 1,
                color: idx === active ? "#0A0A0A" : "rgba(0,0,0,0.2)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "color 0.25s ease",
              }}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(0,0,0,0.08)", margin: "40px 0 0" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", minHeight: 480 }}>
        <div
          style={{
            borderRight: "1px solid rgba(0,0,0,0.08)",
            background: "#1a2332",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
            minHeight: 480,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "100%",
                maxWidth: 560,
                background: "#FFFFFF",
                borderRadius: 10,
                boxShadow: "0 12px 48px rgba(0,0,0,0.25)",
                padding: 36,
                fontFamily: "var(--font-sans)",
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>
                {inst.category}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { l: "Returns generated", v: "16/16" },
                  { l: "Avg processing", v: "4 min" },
                  { l: "Accuracy", v: "99.7%" },
                ].map((s) => (
                  <div key={s.l} style={{ background: "#F8F8F6", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: 14 }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", margin: 0, letterSpacing: "-0.5px" }}>{s.v}</p>
                    <p style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", margin: "4px 0 0" }}>{s.l}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, height: 110, background: "linear-gradient(180deg, #F8F8F6 0%, #EFEFE9 100%)", borderRadius: 8, display: "flex", alignItems: "flex-end", padding: 12, gap: 6 }}>
                {[60, 80, 45, 95, 70, 88, 75, 92, 65].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: "#0A0A0A", borderRadius: 2, opacity: 0.6 + i * 0.04 }} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                {inst.category}
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: 700,
                  color: "#0A0A0A",
                  letterSpacing: "-1px",
                  lineHeight: 1.15,
                  marginBottom: 20,
                  whiteSpace: "pre-line",
                }}
              >
                {inst.headline}
              </h2>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "rgba(0,0,0,0.55)", lineHeight: 1.75, marginBottom: 28 }}>
                {inst.description}
              </p>
              <Link
                to="/book-demo"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(0,0,0,0.3)",
                  paddingBottom: 2,
                }}
              >
                Learn more →
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* ---------- HARVEY-STYLE USE CASES ---------- */
const USE_CASES = [
  { number: "01", title: "CBN regulatory returns", body: "All 16 mandatory returns across CBN, NFIU, SCUML, NDIC, and FIRS — generated from a single CBS export." },
  { number: "02", title: "AML transaction monitoring", body: "Six CBN-compliant flagging rules applied to every transaction. CTRs, structuring, velocity, round figures, dormant accounts." },
  { number: "03", title: "Customer due diligence", body: "Every customer across every channel in one search. KYC completeness, account history, and sanctions status — instantly." },
  { number: "04", title: "Sanctions and PEP screening", body: "Five global lists checked simultaneously in under 3 seconds. UN, OFAC, EU, UK HM Treasury, and CBN Watchlist." },
  { number: "05", title: "STR and case management", body: "Investigate flagged transactions, document decisions, and draft NFIU STRs — without leaving the agent interface." },
  { number: "06", title: "Board packs and governance", body: "Monthly compliance committee reports generated automatically. Audit findings tracked with owners and evidence trails." },
];

const UseCaseCard = ({ item, i }: { item: (typeof USE_CASES)[number]; i: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (i % 3) * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: "36px 32px",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        borderRight: i % 3 < 2 ? "1px solid rgba(0,0,0,0.08)" : "none",
      }}
    >
      <p style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(0,0,0,0.3)", marginBottom: 16, margin: "0 0 16px" }}>{item.number}</p>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.3px", lineHeight: 1.25, margin: "0 0 10px" }}>{item.title}</h3>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(0,0,0,0.5)", lineHeight: 1.7, margin: 0 }}>{item.body}</p>
    </motion.div>
  );
};

const UseCasesSection = () => (
  <section style={{ background: "#FFFFFF", padding: "120px 0", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 700,
          color: "#0A0A0A",
          letterSpacing: "-1.5px",
          lineHeight: 1.1,
          marginBottom: 56,
          maxWidth: 720,
        }}
      >
        Nigeria's leading compliance teams use RegCo for
      </motion.h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {USE_CASES.map((item, i) => (
          <UseCaseCard key={item.number} item={item} i={i} />
        ))}
      </div>
    </div>
  </section>
);

/* ---------- MISSION (Green) ---------- */
const MissionSection = () => (
  <section style={{ background: "#1B4332", padding: "120px 48px" }}>
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 24px" }}>
        A letter from the founders
      </p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(24px, 3.5vw, 38px)",
          fontWeight: 600,
          color: "#FFFFFF",
          letterSpacing: "-0.8px",
          lineHeight: 1.35,
          margin: 0,
        }}
      >
        Nigerian banks lose more time to regulatory filing than to building relationships with their customers. We built RegCo so that compliance becomes a conversation, not a project — and so that every licensed institution, no matter how small, has the tools to meet the CBN's standards without breaking under the weight of them.
      </motion.h2>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.65)", margin: "40px 0 0" }}>
        — Isaac & the RegCo team
      </p>
    </div>
  </section>
);

/* ---------- FINAL CTA ---------- */
const FinalCTASection = () => (
  <section
    style={{
      background: "#FFFFFF",
      padding: "180px 48px 160px",
      textAlign: "center",
      borderTop: "1px solid rgba(0,0,0,0.08)",
    }}
  >
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(48px, 7vw, 88px)",
        fontWeight: 700,
        color: "#1B4332",
        letterSpacing: "-3px",
        lineHeight: 1.04,
        marginBottom: 48,
      }}
    >
      Start RegCo today.
    </motion.h2>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Link
        to="/book-demo"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#1B4332",
          color: "#FFFFFF",
          fontFamily: "var(--font-sans)",
          fontSize: 16,
          fontWeight: 600,
          padding: "16px 36px",
          borderRadius: 8,
          textDecoration: "none",
          letterSpacing: "-0.1px",
        }}
      >
        Request Access
      </Link>
    </motion.div>
  </section>
);

/* ---------- PAGE ---------- */
const Index = () => (
  <div style={{ background: "#FFFFFF", fontFamily: "var(--font-sans)" }}>
    <HomepageNavbar />
    <HeroSection />
    <InstitutionSelector />
    <UseCasesSection />
    <MissionSection />
    <FinalCTASection />
    <HomepageFooter />
  </div>
);

export default Index;
