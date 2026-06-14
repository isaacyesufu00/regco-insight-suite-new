import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { HomepageNavbar, HomepageFooter } from "@/components/regco/HomepageChrome";

const CYCLING_ROLES = [
  "compliance officer.",
  "AML analyst.",
  "risk manager.",
  "CBN filing assistant.",
  "regulatory advisor.",
  "fraud detective.",
];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["end end", "end start"] });
  const previewY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const previewScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const previewOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((p) => (p + 1) % CYCLING_ROLES.length), 2800);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const id = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 999,
          padding: "6px 14px",
          marginBottom: 32,
          zIndex: 1,
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>
          Now in early access — Nigerian financial institutions
        </span>
      </motion.div>

      <div style={{ textAlign: "center", zIndex: 1, maxWidth: 820 }}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(52px, 8vw, 88px)",
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-3px",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Meet RegCo, your
        </motion.h1>

        <div
          style={{
            height: "clamp(60px, 9vw, 96px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            marginTop: 4,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(52px, 8vw, 88px)",
                fontWeight: 700,
                letterSpacing: "-3px",
                lineHeight: 1.05,
                color: "#FFFFFF",
                textDecoration: "underline",
                textDecorationColor: "rgba(255,255,255,0.25)",
                textDecorationThickness: 2,
                textUnderlineOffset: 6,
                position: "absolute",
                whiteSpace: "nowrap",
              }}
            >
              {CYCLING_ROLES[roleIndex]}
            </motion.span>
          </AnimatePresence>
          <span
            style={{
              position: "absolute",
              right: -4,
              fontSize: "clamp(52px, 8vw, 88px)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.6)",
              opacity: showCursor ? 1 : 0,
              transition: "opacity 0.1s",
              lineHeight: 1.05,
              pointerEvents: "none",
            }}
          >
            |
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, maxWidth: 520, margin: "24px auto 36px", letterSpacing: "-0.2px" }}
        >
          An AI compliance agent that understands Nigerian regulation. Generate CBN returns, screen customers, flag AML alerts, file STRs — by just asking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 64 }}
        >
          <Link
            to="/book-demo"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFFFFF", color: "#000000", fontSize: 15, fontWeight: 600, padding: "12px 28px", borderRadius: 8, textDecoration: "none", letterSpacing: "-0.2px" }}
          >
            Request a Demo
          </Link>
          <Link
            to="/product"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#FFFFFF", fontSize: 15, fontWeight: 500, padding: "12px 24px", borderRadius: 8, textDecoration: "none", letterSpacing: "-0.2px" }}
          >
            See how it works →
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          y: previewY,
          scale: previewScale,
          opacity: previewOpacity,
          width: "100%",
          maxWidth: 820,
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
          boxShadow: "0 -8px 80px rgba(255,255,255,0.04), 0 0 0 1px rgba(255,255,255,0.05)",
          zIndex: 1,
        }}
      >
        <div style={{ height: 40, background: "#0D0D0D", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", padding: "0 16px", gap: 6 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
          <div style={{ flex: 1, height: 22, background: "rgba(255,255,255,0.05)", borderRadius: 4, marginLeft: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>regco.com.ng/agent</span>
          </div>
        </div>
        <div style={{ display: "flex", height: 420 }}>
          <div style={{ width: 52, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
            {["R", "⚡", "👤", "🛡", "📰", "📋"].map((icon, i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: i === 0 ? "rgba(255,255,255,0.1)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: i === 0 ? 13 : 14,
                  fontWeight: i === 0 ? 800 : 400,
                  color: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.3)",
                }}
              >
                {icon}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#000000" }}>R</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", maxWidth: "78%" }}>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.6 }}>
                  Good morning. You have <strong style={{ color: "#FFFFFF" }}>2 critical AML flags</strong> pending review and your <strong style={{ color: "#FFFFFF" }}>CBN MFB Return</strong> is due in 8 days. How would you like to start?
                </p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 16px" }}>
                <p style={{ fontSize: 13, color: "#FFFFFF", margin: 0 }}>Generate my May 2026 CBN MFB return from last month's CBS file</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#000000" }}>R</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Reading CBS file · Validating balance sheet · Checking CAR ratio</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const NumbersSection = () => {
  const stats = [
    { number: "1,000+", description: "Licensed financial institutions in Nigeria" },
    { number: "16", description: "Mandatory regulatory returns per institution per year" },
    { number: "₦2,000,000", description: "Minimum CBN fine per late or incorrect filing" },
    { number: "5", description: "Regulators RegCo Agent handles simultaneously" },
  ];
  return (
    <section style={{ background: "#F5F0EB", padding: "80px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
        <p style={{ fontSize: 16, color: "rgba(0,0,0,0.5)", marginBottom: 48, fontWeight: 400 }}>By the numbers</p>
        {stats.map((stat, i) => (
          <div key={stat.number}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", padding: "40px 0", gap: 40 }}>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: "clamp(52px, 7vw, 80px)", fontWeight: 700, color: "#0A0A0A", letterSpacing: "-3px", lineHeight: 1, margin: 0 }}
              >
                {stat.number}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: 18, color: "rgba(0,0,0,0.55)", lineHeight: 1.5, margin: 0, maxWidth: 340 }}
              >
                {stat.description}
              </motion.p>
            </div>
            {i < stats.length - 1 && <div style={{ height: 1, background: "rgba(0,0,0,0.1)" }} />}
          </div>
        ))}
      </div>
    </section>
  );
};

const AGENT_FEATURES = [
  {
    tag: "REGULATORY FILINGS",
    heading: "Just ask. Your return is ready in minutes.",
    body: "Tell RegCo Agent which return you need. It reads your CBS file, validates your figures against CBN thresholds, and produces a submission-ready return. No forms. No templates. No Excel.",
    detail: '"Generate my May 2026 CBN MFB return from yesterday\'s CBS export." → Done in 4 minutes.',
  },
  {
    tag: "AML & FRAUD MONITORING",
    heading: "Every transaction screened. Every alert surfaced.",
    body: "RegCo Agent applies the CBN's 6 AML rules to your entire transaction book and flags violations in real time. CTRs, structuring patterns, velocity anomalies, dormant account triggers — all detected.",
    detail: '"Analyze yesterday\'s transactions and show me anything above ₦5M." → 12 flags in 8 seconds.',
  },
  {
    tag: "CASE MANAGEMENT",
    heading: "Investigate, escalate, and file STRs — in one conversation.",
    body: "Ask the agent to open a case for any suspicious transaction. It compiles the customer profile, transaction history, and flag details into an investigation view. You review, make a decision, and the agent drafts and downloads the NFIU STR.",
    detail: '"Open a case for Emeka Okafor\'s ₦6.5M transfer and draft an STR." → Done.',
  },
  {
    tag: "CUSTOMER SCREENING",
    heading: "Know who you're doing business with. Before you onboard.",
    body: "Search any customer or entity name. RegCo Agent checks all five global sanctions lists simultaneously — UN Security Council, OFAC SDN, EU Consolidated, UK HM Treasury, and the CBN Watchlist. PEPs identified automatically.",
    detail: '"Is Adamu Musa a PEP or on any sanctions list?" → Checked 5 lists in 2 seconds.',
  },
];

const FeatureRow = ({ feature, index }: { feature: (typeof AGENT_FEATURES)[number]; index: number }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        minHeight: 560,
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: isEven ? -32 : 32 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          order: isEven ? 1 : 2,
          padding: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRight: isEven ? "1px solid rgba(255,255,255,0.06)" : "none",
          borderLeft: isEven ? "none" : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
          {feature.tag}
        </span>
        <h2 style={{ fontSize: 40, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-1.2px", lineHeight: 1.1, marginBottom: 20 }}>{feature.heading}</h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: 28 }}>{feature.body}</p>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Example prompt</p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, fontStyle: "italic" }}>{feature.detail}</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        style={{
          order: isEven ? 2 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 360,
            background: "#0E0E0E",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {[1, 2, 3].map((row) => (
            <motion.div
              key={row}
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + row * 0.18 }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8 }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80" }} />
              <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4 }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>OK</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const FeaturesSection = () => (
  <section style={{ background: "#000000" }}>
    {AGENT_FEATURES.map((f, i) => (
      <FeatureRow key={f.tag} feature={f} index={i} />
    ))}
  </section>
);

const MissionSection = () => {
  const paragraphs = [
    "Every licensed financial institution in Nigeria must file up to 16 mandatory regulatory returns every year — to the CBN, NFIU, SCUML, NDIC, and FIRS. Most of them still do this manually. In Excel. At 11pm before the deadline.",
    "The compliance officer is one of the most important people in any Nigerian bank. They sit between the institution and the regulator. Between the rules and the risk. Between a ₦2,000,000 fine and a clean examination.",
    "We built RegCo so they don't have to choose between doing their job well and doing it in time. RegCo Agent handles the filings, the AML screening, the sanctions checks, the board packs, and the audit trails — so compliance officers can focus on judgment, not data entry.",
    "We believe Nigerian financial institutions deserve the same tools that the world's best financial institutions have. That's what we're building.",
  ];
  return (
    <section style={{ background: "#1B4332", padding: "120px 40px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 12, fontWeight: 600, color: "#52B788", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 40 }}
        >
          A note on our mission
        </motion.p>
        {paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: i === 0 ? 22 : 18,
              color: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.7)",
              lineHeight: 1.75,
              marginBottom: i === 0 ? 32 : 24,
              letterSpacing: "-0.2px",
              fontWeight: i === 0 ? 500 : 400,
            }}
          >
            {paragraph}
          </motion.p>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.15)" }}
        >
          <p style={{ fontSize: 16, color: "#52B788", fontWeight: 600, margin: "0 0 4px", letterSpacing: "-0.2px" }}>RegCo Technologies Limited</p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>Abuja, Nigeria · 2026</p>
        </motion.div>
      </div>
    </section>
  );
};

const StandardsSection = () => {
  const items = [
    { number: "01", title: "CDD / KYC / KYB", desc: "End-to-end customer due diligence, identity verification, and beneficial ownership identification." },
    { number: "02", title: "Sanctions & PEP Screening", desc: "Real-time screening against UN, OFAC, EU, UK HM Treasury, and CBN watchlists." },
    { number: "03", title: "Transaction Monitoring", desc: "Real-time monitoring across cards, e-channels, deposits, and lending with configurable rules." },
    { number: "04", title: "Fraud Detection", desc: "Segregated fraud monitoring with CBN AML rules: CTR, structuring, velocity, round figures." },
    { number: "05", title: "Case Management", desc: "Automated alert creation, assignment, investigation tracking, and full audit trail." },
    { number: "06", title: "Regulatory Reporting", desc: "STRs, SARs, CTRs, FTRs, and all 16 mandatory returns in CBN-prescribed formats." },
    { number: "07", title: "Audit & Governance", desc: "Tamper-proof audit trail, governance framework documentation, periodic review support." },
    { number: "08", title: "Data Protection", desc: "NDPA 2023 compliant, NDPC registered, isolated data per institution, encrypted at rest and in transit." },
  ];
  return (
    <section style={{ background: "#000000", padding: "100px 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            CBN BASELINE STANDARDS COMPLIANCE
          </p>
          <h2 style={{ fontSize: 44, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-1.4px", lineHeight: 1.08, marginBottom: 16 }}>
            Built to the CBN's own standards.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>
            The CBN Baseline Standards for Automated AML Solutions require 8 capability areas. RegCo Agent covers all of them.
          </p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
          {items.map((item, i) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "#0A0A0A", padding: "28px 24px" }}
            >
              <p style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>{item.number}</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", marginBottom: 8, letterSpacing: "-0.3px" }}>{item.title}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SecurityHomeSection = () => {
  const items = [
    { icon: "🔒", title: "No training on your data", desc: "We never use your institution's data to train or update any AI model. Your data stays yours." },
    { icon: "🛡", title: "Private data stays private", desc: "Data is stored in isolated environments. Each institution's data is invisible to all others via row-level security." },
    { icon: "👁", title: "Full audit visibility", desc: "Every action taken by the agent is logged with a timestamp, user, and outcome. NDPC and CBN ready." },
  ];
  return (
    <section style={{ background: "#000000", padding: "100px 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center", marginBottom: 64 }}>
        <h2 style={{ fontSize: 52, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-1.8px", marginBottom: 16, lineHeight: 1.05 }}>
          Safe, Secure,
          <br />
          And Private.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "0 auto 48px", lineHeight: 1.65 }}>
          RegCo protects your institution's data with bank-grade security and Nigerian data protection compliance.
        </p>
        <Link to="/book-demo" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FFFFFF", color: "#000000", fontSize: 14, fontWeight: 600, padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>
          Request a Demo
        </Link>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
        {items.map((item) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div style={{ fontSize: 28, marginBottom: 16 }}>{item.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#FFFFFF", marginBottom: 8, letterSpacing: "-0.3px" }}>{item.title}</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const FinalCTA = () => (
  <section style={{ background: "#000000", padding: "120px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
    <h2 style={{ fontSize: 56, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-2px", marginBottom: 20, lineHeight: 1.08 }}>
      Your compliance team
      <br />
      deserves better tools.
    </h2>
    <p style={{ fontSize: 18, color: "rgba(255,255,255,0.45)", maxWidth: 460, margin: "0 auto 40px", lineHeight: 1.65 }}>
      Join Nigerian financial institutions that file faster, screen smarter, and never miss a CBN deadline.
    </p>
    <Link to="/book-demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFFFFF", color: "#000000", fontSize: 16, fontWeight: 600, padding: "14px 32px", borderRadius: 8, textDecoration: "none", letterSpacing: "-0.2px" }}>
      Request a Demo →
    </Link>
  </section>
);

const Index = () => (
  <div style={{ background: "#000000", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif", color: "#FFFFFF", minHeight: "100vh" }}>
    <HomepageNavbar />
    <HeroSection />
    <NumbersSection />
    <FeaturesSection />
    <MissionSection />
    <StandardsSection />
    <SecurityHomeSection />
    <FinalCTA />
    <HomepageFooter />
  </div>
);

export default Index;
