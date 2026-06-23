import { LegalPage, P, UL } from "@/components/eigen/LegalShell";

const sections = [
  { id: "what", label: "What is the NDPC?", title: "What is the NDPC?", body: <P>The Data Protection Commission (NDPC) is the regulatory body established under the Data Protection Act 2023 to oversee the protection of personal data in Nigeria.</P> },
  { id: "status", label: "RegCo's NDPC Status", title: "RegCo's NDPC Status", body: <>
    <P>RegCo Technologies Limited is registered with the NDPC as both:</P>
    <UL items={[
      <><strong>Data Controller:</strong> we control our users' institutional data</>,
      <><strong>Data Processor:</strong> we process personal data on behalf of our clients' institutions</>,
    ]} />
  </> },
  { id: "measures", label: "Compliance Measures", title: "Our Compliance Measures", body: <UL items={[
    "Privacy Policy aligned with NDPA 2023",
    "Data Processing Agreements available for all clients",
    "Lawful basis for processing documented",
    "Data retention policy: 24 months after account closure",
    "Data Protection Impact Assessments conducted for new features",
    "Staff trained on data protection annually",
  ]} /> },
  { id: "rights", label: "Your Rights", title: "Your Rights Under the NDPA 2023", body: <UL items={[
    "Right of Access — request a copy of your data",
    "Right to Rectification — correct inaccurate data",
    "Right to Erasure — request deletion of your data",
    "Right to Restriction — limit how we process your data",
    "Right to Data Portability — receive your data in machine-readable format",
    "Right to Object — object to certain processing",
  ]} /> },
  { id: "exercise", label: "Exercise Your Rights", title: "Exercise Your Rights", body: <P>To exercise your rights: <a href="mailto:compliance@regco.com.ng" style={{ color: "#0A0A0A", fontWeight: 600 }}>compliance@regco.com.ng</a></P> },
];

const NDPCCompliancePage = () => (
  <LegalPage label="LEGAL" title="NDPC Compliance" subtitle="RegCo's compliance with the Data Protection Act 2023 and NDPC regulations." sections={sections} />
);

export default NDPCCompliancePage;
