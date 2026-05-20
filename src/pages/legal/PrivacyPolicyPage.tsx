import { LegalPage, P, UL } from "@/components/eigen/LegalShell";

const sections = [
  { id: "who", label: "1. Who We Are", title: "1. Who We Are", body: <P>RegCo Technologies Limited ("RegCo", "we", "us", "our") is a Nigerian technology company providing automated regulatory reporting software to licensed financial institutions. We are registered with the Corporate Affairs Commission of Nigeria.</P> },
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
  { id: "ndpc", label: "5. NDPC Compliance", title: "5. NDPC Compliance", body: <P>RegCo is registered with the Nigeria Data Protection Commission (NDPC) as both a Data Controller and Data Processor. We comply with the Nigeria Data Protection Act 2023.</P> },
  { id: "rights", label: "6. Your Rights", title: "6. Your Rights", body: <P>You have the right to access your data, correct inaccurate data, delete your data, and export your data in machine-readable format. Contact <a href="mailto:support@regco.com.ng" style={{ color: "#0A0A0A", fontWeight: 600 }}>support@regco.com.ng</a> to exercise these rights.</P> },
  { id: "contact", label: "7. Contact", title: "7. Contact", body: <>
    <P>Data Protection Officer: <a href="mailto:support@regco.com.ng" style={{ color: "#0A0A0A", fontWeight: 600 }}>support@regco.com.ng</a></P>
    <P>RegCo Technologies Limited, Abuja, FCT, Nigeria.</P>
  </> },
];

const PrivacyPolicyPage = () => (
  <LegalPage label="LEGAL" title="Privacy Policy" subtitle="Last updated: May 2026" sections={sections} />
);

export default PrivacyPolicyPage;
