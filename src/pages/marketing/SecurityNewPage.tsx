import { PageShell, PageHero, SectionHeading, Para, FeatureRow, ProseSection, MAX, NARROW, T } from "./_shared";

const protectionCards = [
  { title: "Encryption at Rest", body: "Sensitive data is protected by two layers of encryption at rest: managed database volumes are encrypted by the infrastructure provider, and PII and BVN numbers are additionally encrypted at the field level using AES-256 with keys held in Supabase Vault. Encryption keys are never stored in application code." },
  { title: "Encryption in Transit", body: "All data transmitted between your browser and our servers is protected using TLS 1.2 or higher (TLS 1.3 supported). No data travels over the network in an unencrypted state." },
  { title: "Strict Data Isolation", body: "Every institution's data is isolated at the database layer using PostgreSQL Row Level Security with per-institution policies. Access is enforced by the database itself — not only by application code — so a user from one institution cannot read or write another institution's records." },
  { title: "Login Protection", body: "RegCo enforces rate-limited login protection through Supabase Auth, including automatic account lockout after repeated failed attempts and a cooldown period. Login events are recorded in the immutable audit trail." },
  { title: "Password Security", body: "RegCo enforces strong-password requirements and, where enabled in Supabase Auth, rejects passwords found in known breach datasets. Weak or compromised passwords are blocked at signup." },
  { title: "Full Audit Trail", body: "Significant actions on your regulated records — customers, KYC, transactions, cases, alerts and reports — are written to a tamper-proof, immutable, per-institution audit trail with cryptographic hash chaining. Your compliance lead can verify the integrity of the trail at any time." },
];

const dataChecklist = [
  "Your data is never sold to third parties",
  "Your data is never shared with other institutions",
  "Your data is never used for advertising or profiling",
  "CBS files are accessed via signed URLs that expire in 30 minutes",
  "No uploaded file is ever publicly accessible",
  "A Data Processing Agreement is signed with every client",
  "You can request deletion of your data at any time",
];

const infraCols = [
  { title: "SOC 2 Certified Infrastructure", body: "RegCo is built on Supabase, which holds SOC 2 Type 2 certification with controls audited annually. This means the underlying infrastructure your data sits on meets the highest independent security audit standards." },
  { title: "Secure File Storage", body: "All uploaded CBS files are stored in private access-controlled storage buckets. Files are only ever accessible via time-limited signed URLs that expire after 30 minutes. No file is ever publicly accessible via a permanent link." },
  { title: "Secure Global Hosting", body: "The RegCo platform is hosted on Vercel's enterprise-grade global content delivery network. All traffic is served over HTTPS with TLS 1.3 enforced on every request." },
];

const accessLeft = [
  "Invitation-only access — no public signup",
  "Email confirmation required on all accounts",
  "Strong password requirements enforced at signup",
  "Strong password requirements and breached-password checks (via Supabase Auth)",
  "Automatic account lockout after repeated failed login attempts",
  "Cooldown period on locked accounts",
  "Cryptographically signed JWT session tokens",
  "All user-facing backend operations require a valid JWT; scheduled jobs use isolated service credentials",
  "Admin operations fully separated from client operations",
  "Service role keys never exposed to the browser or frontend",
];

const accessRight = [
  "Only staff you authorise can ever access your dashboard",
  "Unverified accounts cannot access any data",
  "Weak passwords are rejected before they can be set",
  "Known breached passwords are blocked automatically",
  "Brute force login attacks are blocked automatically",
  "Attackers cannot simply wait and retry immediately",
  "Sessions cannot be forged or tampered with",
  "Our backend rejects unauthenticated calls — every user-facing endpoint requires a valid session JWT",
  "Clients and admins operate in completely separate environments",
  "The most sensitive credentials are inaccessible from the internet",
];

const badges = [
  { line1: "NDPA 2023", line2: "Data Protection Act aligned" },
  { line1: "Data Processing Agreement", line2: "Signed with every client before access" },
  { line1: "CAC Registered", line2: "Registered with Corporate Affairs Commission" },
  { line1: "SOC 2 Infrastructure", line2: "Built on SOC 2 Type 2 certified infrastructure" },
];

export default function SecurityNewPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Legal"
        title="Security at RegCo"
        sub="RegCo was built from the ground up for regulated financial institutions. Every architectural decision we have made prioritises the security and confidentiality of your institution's data."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 48 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[["AES-256", "Encryption at rest"], ["TLS 1.3", "Encryption in transit"], ["NDPA 2023", "Data Protection Act aligned"]].map(([b, s]) => (
            <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, border: `1px solid ${T.ink26}`, background: T.ink0F, padding: "7px 14px", fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, color: T.inkCC }}>
              <strong style={{ fontWeight: 600 }}>{b}</strong>
              <span style={{ color: T.ink66 }}>—</span>
              <span style={{ color: T.ink99 }}>{s}</span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="Protection" title="How We Protect Your Data" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16, marginTop: 8 }}>
          {protectionCards.map((c, i) => (
            <FeatureRow key={c.title} title={c.title} body={c.body} bar={[T.red, "#1F6FEB", "#0F8A5F", "#B54708", "#7A4DF2", "#0F8A5F"][i]} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="Ownership" title="Your Data Belongs to You" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 40, marginTop: 8, alignItems: "start" }}>
          <div>
            <Para style={{ fontSize: 16 }}>RegCo processes your institution's data solely for the purpose of generating your regulatory returns. We do not sell, share, license, or analyse your data for any other purpose.</Para>
            <Para style={{ fontSize: 16 }}>Your CBS export data is processed once to generate your report. All file access is controlled through time-limited signed URLs that expire automatically after 30 minutes. No uploaded file is ever publicly accessible.</Para>
            <Para style={{ fontSize: 16 }}>Every client relationship is governed by a Data Processing Agreement that is accepted before accessing the platform. RegCo operates in alignment with the Data Protection Act 2023.</Para>
          </div>
          <div>
            {dataChecklist.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBlock: 8, borderBottom: `1px solid ${T.ink14}` }}>
                <span style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="Infrastructure" title="Infrastructure and Hosting" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginTop: 8 }}>
          {infraCols.map((c, i) => <FeatureRow key={c.title} title={c.title} body={c.body} bar={[T.red, "#1F6FEB", "#0F8A5F"][i]} />)}
        </div>
      </div>

      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="Access" title="Access Control and Authentication" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 40, marginTop: 8 }}>
          <div>
            <div style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>What We Enforce</div>
            {accessLeft.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBlock: 6 }}>
                <span style={{ width: 6, height: 6, background: T.red, borderRadius: 999, flexShrink: 0, marginTop: 8 }} />
                <span style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>What This Means For You</div>
            {accessRight.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBlock: 6 }}>
                <span style={{ width: 6, height: 6, background: T.ink99, borderRadius: 999, flexShrink: 0, marginTop: 8 }} />
                <span style={{ color: T.ink99, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="Alignment" title="Regulatory and Compliance Alignment" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginTop: 8 }}>
          {badges.map((b, i) => (
            <div key={b.line1} style={{ borderRadius: 8, border: `1px solid ${T.ink14}`, background: "#FFFFFF", padding: 20, textAlign: "center" }}>
              <span style={{ width: 6, height: 16, background: [T.red, "#1F6FEB", "#0F8A5F", "#B54708"][i], display: "inline-block", marginBottom: 12 }} />
              <div style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, fontWeight: 600 }}>{b.line1}</div>
              <div style={{ color: T.ink66, fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, marginTop: 4 }}>{b.line2}</div>
            </div>
          ))}
        </div>
        <Para style={{ fontSize: 14, marginTop: 24 }}>RegCo is currently pursuing formal NDPC registration. We are working toward ISO 27001 certification. All security practices on this page reflect the current implemented state of our platform and infrastructure as of July 2026.</Para>
      </div>

      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <ProseSection id="disclosure" heading="Responsible Disclosure">
          <Para style={{ fontSize: 16 }}>RegCo takes security vulnerabilities seriously. If you believe you have discovered a security issue in our platform we ask that you contact us privately before any public disclosure so we can investigate and resolve the issue promptly.</Para>
          <Para style={{ fontSize: 16 }}>Please send all security disclosures to: <a href="mailto:security@regco.com" style={{ color: T.inkCC, fontWeight: 600 }}>security@regco.com</a></Para>
          <Para style={{ fontSize: 16 }}>We commit to acknowledging your report within 2 business days and keeping you informed throughout our investigation. We do not pursue legal action against researchers who disclose vulnerabilities responsibly and in good faith.</Para>
        </ProseSection>
      </div>

      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <SectionHeading kicker="Contact" title="Have a Security Question?" />
        <Para style={{ fontSize: 16 }}>If you have questions about RegCo's security practices, our Data Processing Agreement, or how we handle your institution's data, our team is ready to help.</Para>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16, marginTop: 16 }}>
          {[
            { label: "Security Disclosures", value: "security@regco.com", sub: "For security vulnerability reports and detailed security enquiries" },
            { label: "General Support", value: "support@regco.com", sub: "For questions about data handling, your DPA, or compliance matters" },
          ].map((c) => (
            <div key={c.label} style={{ borderRadius: 8, border: `1px solid ${T.ink14}`, background: "#FFFFFF", padding: 24 }}>
              <div style={{ color: T.ink66, fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.label}</div>
              <a href={`mailto:${c.value}`} style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>{c.value}</a>
              <div style={{ color: T.ink66, fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>{c.sub}</div>
            </div>
          ))}
        </div>
        <Para style={{ fontSize: 12, marginTop: 32 }}>This page was last reviewed July 2026. RegCo runs a continuous security-hardening programme and independently reviews controls as the platform evolves; controls described here reflect the current implemented state. Material changes to our security practices will be communicated to all active clients.</Para>
      </div>
    </PageShell>
  );
}
