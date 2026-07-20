import { PageShell, PageHero, Para, ProseSection, FeatureRow, NARROW, T } from "./_shared";

const principles = [
  { title: "Human in the loop", body: "The compliance brain proposes; qualified reviewers dispose. No regulatory decision is taken automatically without a named accountable officer." },
  { title: "Explainability by default", body: "Every recommendation and risk score traces back to the data, rule, or regulation that produced it. Nothing is asserted without a source." },
  { title: "Regulation-grounded reasoning", body: "Models reason over structured regulatory logic and your institution's policy, not generic internet output, so guidance stays within the rules that apply." },
  { title: "No training on your data", body: "Customer and transaction data is processed for your returns only. It is not used to train shared models." },
];

const commitments = [
  { id: "fairness", heading: "Fairness and bias", body: "Screening and scoring models are monitored for disparate impact across customer segments. Biased or unrepresentative signals are reviewed and removed before they reach a case." },
  { id: "transparency", heading: "Transparency", body: "Institutions can see how any output was derived. Audit logs capture the model version, inputs, and reasoning behind each decision." },
  { id: "accountability", heading: "Accountability", body: "A named owner is responsible for each AI capability in production. Model changes are versioned and go through the same review as any other release." },
  { id: "safety", heading: "Safety and robustness", body: "Models operate inside bounded workflows with validation gates, so a wrong answer is caught by a check rather than passed to a regulator." },
  { id: "privacy", heading: "Privacy", body: "Personal data is handled under the Nigeria Data Protection Act. Processing is minimised to what each return requires, and access is logged." },
];

export default function ResponsibleAiPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Legal"
        title="Responsible AI in compliance."
        sub="RegCo uses AI to help institutions stay compliant — never to replace the human accountability that regulation requires. These are the principles we build and operate by."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <div>
          {principles.map((p, i) => <FeatureRow key={p.title} title={p.title} body={p.body} bar={[T.red, "#1F6FEB", "#7A4DF2", "#0F8A5F"][i]} />)}
        </div>
        {commitments.map((c) => (
          <ProseSection key={c.id} id={c.id} heading={c.heading}>
            <Para style={{ fontSize: 16 }}>{c.body}</Para>
          </ProseSection>
        ))}
        <div style={{ color: T.ink66, fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, marginTop: 24 }}>
          Aligned with the Nigeria Data Protection Act (NDPA) 2023 and emerging guidance on trustworthy AI for financial services.
        </div>
      </div>
    </PageShell>
  );
}
