import { PageShell, PageHero, ProseSection, Para, List, T } from "./_shared";

const CookiePreferences = () => {
  const cookies = [
    { name: "Essential", desc: "Required for the platform to function. Cannot be disabled.", state: "required" as const },
    { name: "Analytics", desc: "Help us understand how the platform is used. No personally identifiable data is shared.", state: "optional" as const },
    { name: "Advertising", desc: "RegCo does not use advertising cookies. We do not run ads.", state: "na" as const },
  ];
  return (
    <>
      <Para style={{ fontSize: 16 }}>You can review and reset your cookie preferences at any time below.</Para>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0 24px" }}>
        {cookies.map((c) => (
          <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: 16, background: "#FFFFFF", borderRadius: 10, border: `1px solid ${T.ink14}` }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: T.ink, margin: "0 0 4px", fontFamily: "Inter, system-ui, sans-serif" }}>{c.name}</p>
              <p style={{ fontSize: 13, color: T.ink66, margin: 0, fontFamily: "Inter, system-ui, sans-serif" }}>{c.desc}</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, background: c.state === "required" ? T.inkE6 : c.state === "na" ? T.ink0F : "#F0FDF4", color: c.state === "required" ? "#FFFFFF" : c.state === "na" ? T.ink66 : "#16A34A", borderRadius: 999, padding: "3px 10px", flexShrink: 0, marginLeft: 16, letterSpacing: "0.05em", fontFamily: "Inter, system-ui, sans-serif" }}>
              {c.state === "required" ? "REQUIRED" : c.state === "na" ? "NOT USED" : "OPTIONAL"}
            </span>
          </div>
        ))}
      </div>
      <button onClick={() => { localStorage.removeItem("regco_cookie_consent_v2"); window.location.reload(); }} style={{ height: 40, padding: "0 20px", background: "transparent", color: T.ink, border: `1px solid ${T.ink26}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>
        Reset cookie preferences
      </button>
    </>
  );
};

export default function PrivacyPolicyNewPage() {
  return (
    <PageShell>
      <PageHero kicker="Legal" title="Privacy Policy" sub="Last updated: May 2026" />
      <div style={{ maxWidth: 688, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <ProseSection id="who" heading="1. Who We Are">
          <Para style={{ fontSize: 16 }}>RegCo Technologies Limited ("RegCo", "we", "us", "our") is a technology company providing automated regulatory reporting software to licensed financial institutions. We are registered with the the company registry.</Para>
        </ProseSection>
        <ProseSection id="data" heading="2. What Data We Collect">
          <List items={[
            "Institution information: name, CBN license number, RC number, address",
            "User information: name, email address, job title",
            "Report data: financial figures you upload to generate regulatory returns",
            "Usage data: pages visited, features used, session duration",
          ]} />
          <Para style={{ fontSize: 16 }}>We do <strong>not</strong> collect personal banking details of your customers, account numbers, or transaction data unless you explicitly upload this for AML analysis.</Para>
        </ProseSection>
        <ProseSection id="use" heading="3. How We Use Your Data">
          <List items={[
            "To generate regulatory returns as requested",
            "To send you notifications when reports are ready",
            "To calculate your compliance health score",
            "To improve our platform",
            "We never sell your data to third parties",
          ]} />
        </ProseSection>
        <ProseSection id="storage" heading="4. Data Storage">
          <Para style={{ fontSize: 16 }}>Your data is stored on managed PostgreSQL infrastructure in a US-East region. All data is encrypted at rest and in transit. Row Level Security ensures your institution's data is never accessible to other RegCo users.</Para>
        </ProseSection>
        <ProseSection id="ndpc" heading="5. NDPC Compliance">
          <Para style={{ fontSize: 16 }}>RegCo is registered with the Data Protection Commission (NDPC) as both a Data Controller and Data Processor. We comply with the Data Protection Act 2023.</Para>
        </ProseSection>
        <ProseSection id="rights" heading="6. Your Rights">
          <Para style={{ fontSize: 16 }}>You have the right to access your data, correct inaccurate data, delete your data, and export your data in machine-readable format. Contact <a href="mailto:support@regco.com.ng" style={{ color: T.inkCC, fontWeight: 600 }}>support@regco.com.ng</a> to exercise these rights.</Para>
        </ProseSection>
        <ProseSection id="contact" heading="7. Contact">
          <Para style={{ fontSize: 16 }}>Data Protection Officer: <a href="mailto:support@regco.com.ng" style={{ color: T.inkCC, fontWeight: 600 }}>support@regco.com.ng</a></Para>
          <Para style={{ fontSize: 16 }}>RegCo Technologies Limited, our headquarters city.</Para>
        </ProseSection>
        <ProseSection id="cookies" heading="8. Cookie Preferences">
          <CookiePreferences />
        </ProseSection>
      </div>
    </PageShell>
  );
}
