import { PageShell, PageHero, ProseSection, Para, T } from "./_shared";

export default function TermsOfServiceNewPage() {
  return (
    <PageShell>
      <PageHero kicker="Legal" title="Terms of Service" sub="Last updated: May 2026. Please read these terms carefully before using RegCo." />
      <div style={{ maxWidth: 688, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <ProseSection id="acceptance" heading="1. Acceptance of Terms">
          <Para style={{ fontSize: 16 }}>By accessing or using RegCo's platform, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.</Para>
        </ProseSection>
        <ProseSection id="service" heading="2. Description of Service">
          <Para style={{ fontSize: 16 }}>RegCo provides automated regulatory return generation software for licensed financial institutions. The platform processes financial data you provide to generate regulatory submissions in formats required by CBN, NFIU, SCUML, NDIC, and FIRS.</Para>
        </ProseSection>
        <ProseSection id="responsibilities" heading="3. Your Responsibilities">
          <Para style={{ fontSize: 16 }}>You are responsible for the accuracy of all data you upload, submitting generated returns to regulators by their deadlines, maintaining your CBN license compliance, and safeguarding your login credentials.</Para>
        </ProseSection>
        <ProseSection id="disclaimer" heading="4. Accuracy Disclaimer">
          <Para style={{ fontSize: 16 }}>RegCo generates returns based on data you provide. We are not responsible for regulatory penalties arising from inaccurate data you upload. You must verify all generated returns before submission to regulators.</Para>
        </ProseSection>
        <ProseSection id="payment" heading="5. Subscription and Payment">
          <Para style={{ fontSize: 16 }}>Subscription fees are billed monthly or annually as agreed. Non-payment may result in account suspension. No refunds for partial months.</Para>
        </ProseSection>
        <ProseSection id="ip" heading="6. Intellectual Property">
          <Para style={{ fontSize: 16 }}>RegCo's software, AI prompts, and report templates are our intellectual property. You may not copy, reverse-engineer, or redistribute them.</Para>
        </ProseSection>
        <ProseSection id="termination" heading="7. Termination">
          <Para style={{ fontSize: 16 }}>Either party may terminate this agreement with 30 days written notice. Upon termination, your data is retained for 90 days then deleted.</Para>
        </ProseSection>
        <ProseSection id="law" heading="8. Governing Law">
          <Para style={{ fontSize: 16 }}>These terms are governed by applicable law. Disputes shall be resolved in courts of competent jurisdiction.</Para>
        </ProseSection>
        <ProseSection id="contact" heading="9. Contact">
          <Para style={{ fontSize: 16 }}><a href="mailto:legal@regco.com.ng" style={{ color: T.inkCC, fontWeight: 600 }}>legal@regco.com.ng</a> — RegCo Technologies Limited, our headquarters city.</Para>
        </ProseSection>
      </div>
    </PageShell>
  );
}
