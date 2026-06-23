import { LegalPage, P } from "@/components/eigen/LegalShell";

const sections = [
  { id: "acceptance", label: "1. Acceptance of Terms", title: "1. Acceptance of Terms", body: <P>By accessing or using RegCo's platform, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.</P> },
  { id: "service", label: "2. Description of Service", title: "2. Description of Service", body: <P>RegCo provides automated regulatory return generation software for licensed financial institutions. The platform processes financial data you provide to generate regulatory submissions in formats required by CBN, NFIU, SCUML, NDIC, and FIRS.</P> },
  { id: "responsibilities", label: "3. Your Responsibilities", title: "3. Your Responsibilities", body: <P>You are responsible for the accuracy of all data you upload, submitting generated returns to regulators by their deadlines, maintaining your CBN license compliance, and safeguarding your login credentials.</P> },
  { id: "disclaimer", label: "4. Accuracy Disclaimer", title: "4. Accuracy Disclaimer", body: <P>RegCo generates returns based on data you provide. We are not responsible for regulatory penalties arising from inaccurate data you upload. You must verify all generated returns before submission to regulators.</P> },
  { id: "payment", label: "5. Subscription and Payment", title: "5. Subscription and Payment", body: <P>Subscription fees are billed monthly or annually as agreed. Non-payment may result in account suspension. No refunds for partial months.</P> },
  { id: "ip", label: "6. Intellectual Property", title: "6. Intellectual Property", body: <P>RegCo's software, AI prompts, and report templates are our intellectual property. You may not copy, reverse-engineer, or redistribute them.</P> },
  { id: "termination", label: "7. Termination", title: "7. Termination", body: <P>Either party may terminate this agreement with 30 days written notice. Upon termination, your data is retained for 90 days then deleted.</P> },
  { id: "law", label: "8. Governing Law", title: "8. Governing Law", body: <P>These terms are governed by applicable law. Disputes shall be resolved in courts of competent jurisdiction.</P> },
  { id: "contact", label: "9. Contact", title: "9. Contact", body: <P><a href="mailto:legal@regco.com.ng" style={{ color: "#0A0A0A", fontWeight: 600 }}>legal@regco.com.ng</a> — RegCo Technologies Limited, our headquarters city.</P> },
];

const TermsOfServicePage = () => (
  <LegalPage label="LEGAL" title="Terms of Service" subtitle="Last updated: May 2026. Please read these terms carefully before using RegCo." sections={sections} />
);

export default TermsOfServicePage;
