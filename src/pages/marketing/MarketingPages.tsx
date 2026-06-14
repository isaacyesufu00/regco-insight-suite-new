import { Link } from "react-router-dom";
import { HomepageNavbar, HomepageFooter } from "@/components/regco/HomepageChrome";
import { motion } from "framer-motion";

interface ShellProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
}

export const MarketingShell = ({ eyebrow, title, subtitle, children }: ShellProps) => (
  <div style={{ background: "#000000", color: "#FFFFFF", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif" }}>
    <HomepageNavbar />
    <section style={{ padding: "160px 40px 80px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontSize: "clamp(48px, 7vw, 80px)",
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: "-2.5px",
          lineHeight: 1.05,
          margin: 0,
          maxWidth: 900,
          marginInline: "auto",
        }}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", maxWidth: 580, margin: "28px auto 0", lineHeight: 1.65 }}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 12 }}
      >
        <Link
          to="/book-demo"
          style={{ background: "#FFFFFF", color: "#000000", fontSize: 15, fontWeight: 600, padding: "12px 28px", borderRadius: 8, textDecoration: "none", letterSpacing: "-0.2px" }}
        >
          Request a Demo
        </Link>
      </motion.div>
    </section>
    <main>{children}</main>
    <HomepageFooter />
  </div>
);

export const ProductPage = () => (
  <MarketingShell
    eyebrow="THE REGCO AGENT"
    title={<>An AI compliance copilot, not another dashboard.</>}
    subtitle="Speak to RegCo Agent the way you'd brief a senior compliance officer. It reads your CBS file, drafts the return, screens the customer, and surfaces the AML flag — then asks you to confirm before filing."
  >
    <Sections
      groups={[
        {
          title: "Regulatory filings, on request",
          rows: [
            "All 16 mandatory Nigerian returns — CBN, NFIU, SCUML, NDIC, FIRS, PENCOM",
            "Reads any CBS export — FlexCube, T24, NCube, BankOne, custom Excel",
            "Validates CAR, liquidity, NPL, and PDR against the latest CBN thresholds",
            "Outputs in the regulator's prescribed format, ready for submission",
          ],
        },
        {
          title: "AML monitoring you don't run — it runs you",
          rows: [
            "CBN's 6 AML rules applied to every transaction in real time",
            "Critical flags surfaced as soon as they happen",
            "Structuring, velocity, CTR thresholds, dormant-account anomalies",
            "One-click STR drafting from any flagged transaction",
          ],
        },
        {
          title: "Customer screening, before onboarding",
          rows: [
            "UN, OFAC, EU, UK HM Treasury, CBN watchlist — checked simultaneously",
            "Nigerian PEP database with relatives and close associates",
            "Adverse-media search with named-entity matching",
            "Audit-ready screening certificate for every check",
          ],
        },
      ]}
    />
  </MarketingShell>
);

export const WhoWeServePage = () => (
  <MarketingShell
    eyebrow="WHO WE SERVE"
    title={<>Built for every Nigerian licensed financial institution.</>}
    subtitle="Microfinance Banks. Primary Mortgage Banks. Commercial Banks. Finance Companies. Payment Service Providers. If you file with the CBN, RegCo is for you."
  >
    <Sections
      groups={[
        { title: "Microfinance Banks (Tier 1–3)", rows: ["MFB Regulatory Returns", "PDR calculation", "Liquidity ratio reporting", "Tier-specific compliance thresholds"] },
        { title: "Primary Mortgage Banks", rows: ["PMB-specific CBN returns", "Loan classification reports", "Real estate exposure tracking", "NHF compliance"] },
        { title: "Commercial Banks", rows: ["Full CBN return suite", "FX position reporting", "NDIC premium computation", "Group-level consolidation"] },
        { title: "Finance Companies", rows: ["FC Regulatory Returns", "Lending portfolio analytics", "Customer concentration limits", "Quarterly CBN reporting"] },
      ]}
    />
  </MarketingShell>
);

export const PricingPage = () => (
  <MarketingShell eyebrow="PRICING" title={<>Simple, tier-aligned pricing.</>} subtitle="Pay for the regulatory scope your licence requires. Every plan includes the RegCo Agent, the dashboard, and CBN-grade security.">
    <section style={{ padding: "80px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { name: "Starter", price: "Contact us", desc: "For Tier 1 MFBs and small finance companies.", features: ["All 16 mandatory returns", "AML monitoring", "Sanctions screening", "Email support"] },
          { name: "Growth", price: "Contact us", desc: "For Tier 2/3 MFBs, PMBs, and mid-sized institutions.", features: ["Everything in Starter", "Customer 360", "Board pack generation", "Priority support", "Up to 10 users"], featured: true },
          { name: "Enterprise", price: "Contact us", desc: "For commercial banks and groups with multiple subsidiaries.", features: ["Everything in Growth", "Multi-entity consolidation", "SSO + custom roles", "Dedicated compliance partner", "Unlimited users"] },
        ].map((t) => (
          <div
            key={t.name}
            style={{
              background: t.featured ? "#FFFFFF" : "rgba(255,255,255,0.04)",
              color: t.featured ? "#000000" : "#FFFFFF",
              border: `1px solid ${t.featured ? "transparent" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 14,
              padding: 28,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, opacity: 0.7 }}>{t.name}</p>
            <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-1px", margin: "8px 0 12px" }}>{t.price}</p>
            <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 20, lineHeight: 1.6 }}>{t.desc}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
              {t.features.map((f) => (
                <li key={f} style={{ fontSize: 13, padding: "6px 0", opacity: 0.85 }}>
                  ✓ {f}
                </li>
              ))}
            </ul>
            <Link
              to="/book-demo"
              style={{
                display: "block",
                textAlign: "center",
                background: t.featured ? "#000000" : "#FFFFFF",
                color: t.featured ? "#FFFFFF" : "#000000",
                padding: "10px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Talk to sales
            </Link>
          </div>
        ))}
      </div>
    </section>
  </MarketingShell>
);

export const CompanyPage = () => (
  <MarketingShell
    eyebrow="COMPANY"
    title={<>The future state of Nigerian compliance.</>}
    subtitle="We're building the AI compliance partner Nigerian financial institutions deserve. Bank-grade. Locally aware. Built in Abuja, for the CBN's regulatory reality."
  >
    <Sections
      groups={[
        {
          title: "Our mission",
          rows: [
            "Make CBN compliance as fast as it is correct",
            "Free compliance officers from manual data entry",
            "Bring world-class tools to every Nigerian licensed institution",
            "Help regulators raise the bar without raising the cost",
          ],
        },
        { title: "Where we're based", rows: ["Headquartered in Abuja, Nigeria", "Founded in 2024", "RegCo Technologies Limited (RC pending publication)"] },
      ]}
    />
  </MarketingShell>
);

export const SecurityMarketingPage = () => (
  <MarketingShell
    eyebrow="SECURITY"
    title={
      <>
        Safe, Secure,
        <br />
        And Private.
      </>
    }
    subtitle="RegCo secures your institution's data with bank-grade security, NDPA-compliant data handling, and full audit visibility for every action the agent takes."
  >
    <section style={{ padding: "80px 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {[
          { title: "No training on your data", desc: "We never use your institution's data to train, fine-tune, or update any AI model. Your data stays yours, full stop." },
          { title: "Private data stays private", desc: "Each institution's data is stored in an isolated environment with row-level security. Cross-institution access is impossible by design." },
          { title: "Full audit visibility", desc: "Every action the agent takes is logged with timestamp, user, regulation cited, and outcome. NDPC and CBN examination ready." },
          { title: "Encryption everywhere", desc: "TLS 1.3 in transit. AES-256 at rest. Encrypted backups. Keys managed in HSM-backed infrastructure." },
          { title: "NDPA 2023 compliant", desc: "Registered with the Nigeria Data Protection Commission. Data residency in compliant African and EU regions only." },
          { title: "Bring-your-own controls", desc: "SSO, custom role hierarchies, IP allow-listing, and forced session timeouts for institutions with stricter policies." },
        ].map((item) => (
          <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", marginBottom: 10, letterSpacing: "-0.3px" }}>{item.title}</h3>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </MarketingShell>
);

const Sections = ({ groups }: { groups: { title: string; rows: string[] }[] }) => (
  <section style={{ padding: "80px 40px" }}>
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {groups.map((g, gi) => (
        <motion.div
          key={g.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: "48px 0", borderBottom: gi < groups.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
        >
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 28 }}>{g.title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {g.rows.map((r) => (
              <div key={r} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", marginTop: 8, flexShrink: 0 }} />
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: 0 }}>{r}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);
