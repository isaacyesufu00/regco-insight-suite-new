import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Activity, Users, Shield, BarChart2,
  FileCheck, ClipboardCheck, Newspaper, Calendar,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  id: string;
  icon: LucideIcon;
  name: string;
  tagline: string;
  description: string;
  bullets: string[];
  href: string;
};

const features: Feature[] = [
  {
    id: "reports",
    icon: FileText,
    name: "Report Generation",
    tagline: "16 mandatory returns across 5 regulators.",
    description:
      "Upload your CBS export. RegCo reads it, validates your balance sheet, checks CAR, Liquidity, and NPL ratios — and generates a CBN-formatted return in under 5 minutes.",
    bullets: [
      "MFB Regulatory Return, Prudential, Monetary Policy",
      "NFIU AML/CFT, Regulatory Return",
      "SCUML Annual, NDIC Premium, FIRS VAT/PAYE/WHT/CIT",
    ],
    href: "#reports",
  },
  {
    id: "transactions",
    icon: Activity,
    name: "Transaction Monitor",
    tagline: "6 CBN AML rules on every transaction.",
    description:
      "Upload monthly transaction data or connect via webhook. RegCo flags CTR, structuring, velocity, round figures, dormant accounts, and narration mismatch.",
    bullets: [
      "CTR detection above ₦5,000,000",
      "Real-time webhook for live screening",
      "STR auto-generation with NFIU format",
    ],
    href: "#fraud-prevention",
  },
  {
    id: "customer-360",
    icon: Users,
    name: "Customer 360",
    tagline: "Every account. Every channel. One search.",
    description:
      "Search any customer by BVN, account number, name, or phone. See all their accounts across core, mobile, agency and cards — in one screen.",
    bullets: [
      "Search across all channels simultaneously",
      "KYC completeness check at a glance",
      "Full transaction history with filters",
    ],
    href: "#customer-360",
  },
  {
    id: "screening",
    icon: Shield,
    name: "Sanctions & PEP Screening",
    tagline: "Five global lists. Results in 3 seconds.",
    description:
      "Screen any customer against UN Security Council, OFAC SDN, EU Consolidated, UK HM Treasury, and CBN Watchlist simultaneously. Nigerian PEP database included.",
    bullets: [
      "5 lists synced daily from official sources",
      "Nigerian PEP database — politicians and families",
      "Batch screening for new customer onboarding",
    ],
    href: "#screening",
  },
  {
    id: "risk",
    icon: BarChart2,
    name: "Risk Analysis",
    tagline: "CBN CAMEL classification. Automatic.",
    description:
      "Upload your loan portfolio. RegCo classifies every borrower — Pass, Watch List, Substandard, Doubtful, Loss — with CBN-prescribed provisions auto-applied.",
    bullets: [
      "CAMEL classification on full portfolio",
      "CBN provision rates auto-applied",
      "Instant customer risk score lookup",
    ],
    href: "/book-demo",
  },
  {
    id: "board-pack",
    icon: FileCheck,
    name: "Compliance Board Pack",
    tagline: "Monthly committee report in 30 seconds.",
    description:
      "One button generates your monthly compliance committee report — all filings, AML activity, KYC metrics, screening results — formatted for board presentation.",
    bullets: [
      "Pulls data from every RegCo module",
      "Formatted for board / committee presentation",
      "Downloadable as plain text or Word",
    ],
    href: "/book-demo",
  },
  {
    id: "audit",
    icon: ClipboardCheck,
    name: "Audit Issue Tracker",
    tagline: "Track every CBN examination finding.",
    description:
      "Log findings from CBN, NDIC, SCUML, and internal audits. Assign owners, set deadlines, upload evidence. Overdue issues flagged automatically.",
    bullets: [
      "Auto-flags overdue items in red",
      "Evidence documentation per issue",
      "CBN re-examination ready at all times",
    ],
    href: "/book-demo",
  },
  {
    id: "intelligence",
    icon: Newspaper,
    name: "Regulatory Intelligence",
    tagline: "Live CBN and regulatory news feed.",
    description:
      "Live feed from Nairametrics, BusinessDay, Punch, Vanguard, and The Guardian — filtered for CBN, NDIC, NFIU relevance and refreshed every 3 hours.",
    bullets: [
      "6 Nigerian news sources, filtered for banking",
      "CBN Circulars tab with official references",
      "Monthly task checklist resets automatically",
    ],
    href: "/book-demo",
  },
  {
    id: "calendar",
    icon: Calendar,
    name: "Compliance Calendar",
    tagline: "Every deadline. Colour-coded by urgency.",
    description:
      "Every CBN, NFIU, SCUML, NDIC, and FIRS filing deadline for the year on one calendar. Red, orange, green by urgency — health score updates as you file.",
    bullets: [
      "All 5 regulator deadlines pre-loaded",
      "Red / orange / green urgency system",
      "Health score recalculates on every filing",
    ],
    href: "#calendar",
  },
];

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <div style={{ position: "relative", minHeight: 130 }}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{ zIndex: hovered ? 20 : 1 }}
        style={{
          position: hovered ? "absolute" : "relative",
          top: 0,
          left: 0,
          right: 0,
          background: "#FFFFFF",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.07)",
          padding: "22px 22px",
          cursor: "default",
          transition: "box-shadow 0.2s ease",
          boxShadow: hovered
            ? "0 12px 40px rgba(0,0,0,0.12)"
            : "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: hovered ? 16 : 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: hovered ? "#0A0A0A" : "#F5F5F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s ease",
            }}
          >
            <Icon size={15} color={hovered ? "#FFFFFF" : "#525252"} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", margin: "0 0 3px", letterSpacing: "-0.2px" }}>
              {feature.name}
            </p>
            <p style={{ fontSize: 12, color: "#9B9B9B", margin: 0, lineHeight: 1.4 }}>
              {feature.tagline}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <p style={{ fontSize: 13, color: "#525252", lineHeight: 1.65, margin: "0 0 14px" }}>
                {feature.description}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                {feature.bullets.map((bullet) => (
                  <li key={bullet} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#525252" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#0A0A0A", flexShrink: 0, marginTop: 5 }} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <a
                href={feature.href}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Learn more →
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const stats = [
  { n: "16", label: "Mandatory returns automated" },
  { n: "5", label: "Regulators covered" },
  { n: "5", label: "Sanctions lists synced daily" },
  { n: "<5", label: "Minutes to generate any return" },
];

const FeaturesSection = () => (
  <section
    id="features"
    style={{
      background: "#F5F5F0",
      padding: "96px 0",
      borderTop: "1px solid rgba(0,0,0,0.07)",
      borderBottom: "1px solid rgba(0,0,0,0.07)",
    }}
  >
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "end",
          marginBottom: 56,
        }}
        className="features-header"
      >
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
            THE PLATFORM
          </p>
          <h2 style={{ fontSize: 44, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-1.3px", lineHeight: 1.08, margin: 0 }}>
            Every compliance tool<br />your institution needs.
          </h2>
        </div>
        <div>
          <p style={{ fontSize: 16, color: "#6B6B6B", lineHeight: 1.7, maxWidth: 400, marginLeft: "auto" }}>
            Built for Nigerian licensed financial institutions — Unit MFBs to Commercial Banks.
            Every feature below is live, automated, and connected to your compliance calendar.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="features-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <FeatureCard feature={feature} />
          </motion.div>
        ))}
      </motion.div>

      <div
        className="features-stat-bar"
        style={{
          display: "flex",
          gap: 0,
          marginTop: 48,
          background: "#0A0A0A",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              padding: "28px 24px",
              textAlign: "center",
              borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            <p style={{ fontSize: 36, fontWeight: 900, color: "#FFFFFF", margin: "0 0 4px", letterSpacing: "-1.5px" }}>
              {stat.n}
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.4 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .features-header { grid-template-columns: 1fr !important; gap: 24px !important; }
        .features-header p[style*="margin-left: auto"], .features-header > div:last-child p { margin-left: 0 !important; }
        .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .features-stat-bar { flex-wrap: wrap !important; }
        .features-stat-bar > div { flex: 1 1 50% !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
      }
      @media (max-width: 480px) {
        .features-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </section>
);

export default FeaturesSection;
