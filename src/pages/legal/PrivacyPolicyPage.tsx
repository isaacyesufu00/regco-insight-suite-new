import { LegalPage, P, UL, type LegalSection } from "@/components/eigen/LegalShell";

const CookiePreferences = () => {
  const cookies = [
    { name: "Essential", desc: "Required for the platform to function. Cannot be disabled.", state: "required" as const },
    { name: "Analytics", desc: "Help us understand how the platform is used. No personally identifiable data is shared.", state: "optional" as const },
    { name: "Advertising", desc: "RegCo does not use advertising cookies. We do not run ads.", state: "na" as const },
  ];
  return (
    <>
      <P>You can review and reset your cookie preferences at any time below.</P>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0 24px" }}>
        {cookies.map((c) => (
          <div
            key={c.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: 16,
              background: "#FFFFFF",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", margin: "0 0 4px" }}>{c.name}</p>
              <p style={{ fontSize: 13, color: "#6B6B6B", margin: 0 }}>{c.desc}</p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: c.state === "required" ? "#0A0A0A" : c.state === "na" ? "#F5F5F0" : "#F0FDF4",
                color: c.state === "required" ? "#FFFFFF" : c.state === "na" ? "#9B9B9B" : "#16A34A",
                borderRadius: 999,
                padding: "3px 10px",
                flexShrink: 0,
                marginLeft: 16,
                letterSpacing: "0.05em",
              }}
            >
              {c.state === "required" ? "REQUIRED" : c.state === "na" ? "NOT USED" : "OPTIONAL"}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("regco_cookie_consent_v2");
          window.location.reload();
        }}
        style={{
          height: 40,
          padding: "0 20px",
          background: "transparent",
          color: "#0A0A0A",
          border: "1px solid rgba(0,0,0,0.15)",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Reset cookie preferences
      </button>
    </>
  );
};

const sections = [
  { id: "who", label: "1. Who We Are", title: "1. Who We Are", body: <P>RegCo Technologies Limited ("RegCo", "we", "us", "our") is a technology company providing automated regulatory reporting software to licensed financial institutions. We are registered with the the company registry.</P> },
  { id: "data", label: "2. What Data We Collect", title: "2. What Data We Collect", body: <>
    <UL items={[
      "Institution information: name, CBN license number, RC number, address",
      "User information: name, email address, job title",
      "Report data: financial figures you upload to generate regulatory returns",
      "Usage data: pages visited, features used, session duration",
    ]} />
    <P>We do <strong>not</strong> collect personal banking details of your customers, account numbers, or transaction data unless you explicitly upload this for AML analysis.</P>
  </> },
  { id: "use", label: "3. How We Use Your Data", title: "3. How We Use Your Data", body: <UL items={[
    "To generate regulatory returns as requested",
    "To send you notifications when reports are ready",
    "To calculate your compliance health score",
    "To improve our platform",
    "We never sell your data to third parties",
  ]} /> },
  { id: "storage", label: "4. Data Storage", title: "4. Data Storage", body: <P>Your data is stored on managed PostgreSQL infrastructure in a US-East region. All data is encrypted at rest and in transit. Row Level Security ensures your institution's data is never accessible to other RegCo users.</P> },
  { id: "ndpc", label: "5. NDPC Compliance", title: "5. NDPC Compliance", body: <P>RegCo is registered with the Data Protection Commission (NDPC) as both a Data Controller and Data Processor. We comply with the Data Protection Act 2023.</P> },
  { id: "rights", label: "6. Your Rights", title: "6. Your Rights", body: <P>You have the right to access your data, correct inaccurate data, delete your data, and export your data in machine-readable format. Contact <a href="mailto:support@regco.com.ng" style={{ color: "#0A0A0A", fontWeight: 600 }}>support@regco.com.ng</a> to exercise these rights.</P> },
  { id: "contact", label: "7. Contact", title: "7. Contact", body: <>
    <P>Data Protection Officer: <a href="mailto:support@regco.com.ng" style={{ color: "#0A0A0A", fontWeight: 600 }}>support@regco.com.ng</a></P>
    <P>RegCo Technologies Limited, our headquarters city.</P>
  </> },
  { id: "cookies", label: "8. Cookie Preferences", title: "8. Cookie Preferences", body: <CookiePreferences /> },
];

const PrivacyPolicyPage = () => (
  <LegalPage label="LEGAL" title="Privacy Policy" subtitle="Last updated: May 2026" sections={sections} />
);

export default PrivacyPolicyPage;
