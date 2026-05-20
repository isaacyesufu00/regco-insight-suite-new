import { LegalPage, P } from "@/components/eigen/LegalShell";

const sections = [
  { id: "parties", label: "1. Parties", title: "1. Parties", body: <>
    <P><strong>Data Controller:</strong> [Your Institution Name] (the "Controller")</P>
    <P><strong>Data Processor:</strong> RegCo Technologies Limited (the "Processor")</P>
  </> },
  { id: "subject", label: "2. Subject Matter", title: "2. Subject Matter", body: <P>RegCo processes financial and institutional data provided by the Controller solely for the purpose of generating regulatory returns.</P> },
  { id: "duration", label: "3. Duration", title: "3. Duration", body: <P>This agreement remains in effect for the duration of the RegCo subscription.</P> },
  { id: "nature", label: "4. Nature and Purpose", title: "4. Nature and Purpose of Processing", body: <P>RegCo processes institution financial data, employee payroll data (for PAYE returns), and transaction data (for AML analysis). Processing is automated. No human RegCo employee accesses your raw financial data.</P> },
  { id: "security", label: "5. Security Measures", title: "5. Security Measures", body: <P>RegCo implements AES-256 encryption at rest, TLS 1.3 in transit, Row Level Security in database, access logging, and annual security reviews.</P> },
  { id: "subprocessors", label: "6. Sub-Processors", title: "6. Sub-Processors", body: <P>RegCo uses managed infrastructure for database, hosting, transactional email, and AI inference. A full sub-processor list is available on request.</P> },
  { id: "rights", label: "7. Data Subject Rights", title: "7. Data Subject Rights", body: <P>RegCo will assist the Controller in responding to data subject rights requests within 72 hours.</P> },
  { id: "breach", label: "8. Breach Notification", title: "8. Breach Notification", body: <P>RegCo will notify the Controller of any personal data breach within 72 hours of becoming aware.</P> },
  { id: "ndpc", label: "9. NDPC Registration", title: "9. NDPC Registration", body: <P>RegCo is registered with the NDPC as Data Processor. Registration number available on request.</P> },
];

const DataProcessingPage = () => (
  <LegalPage label="LEGAL" title="Data Processing Agreement" subtitle="This agreement governs how RegCo processes personal data on behalf of your institution." sections={sections} />
);

export default DataProcessingPage;
