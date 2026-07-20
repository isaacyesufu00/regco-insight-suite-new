import { PageShell, PageHero, SectionHeading, Para, FeatureRow, NARROW, T } from "./_shared";

const ARTICLES = [
  { cat: "Getting started", title: "Connecting RegCo to your core banking system", desc: "Pull vs. file-drop onboarding, what credentials RegCo holds, and how data stays encrypted." },
  { cat: "Fraud", title: "Tuning anomaly thresholds for your institution", desc: "How behavioural baselines are set per segment and how to reduce false positives without losing coverage." },
  { cat: "Reporting", title: "Validating a CBN return before submission", desc: "The reconciliation checks RegCo runs and what to do when a figure cannot be reconciled." },
  { cat: "Screening", title: "Handling BVN and NIN match variation", desc: "Why fuzzy matching matters and how to review edge cases without blocking legitimate customers." },
  { cat: "Governance", title: "Exporting an audit trail for external review", desc: "How to package a complete, immutable decision trail for auditors or regulators." },
  { cat: "AI", title: "Reading a compliance brain recommendation", desc: "Where each suggestion comes from and how to trace it back to its source." },
];

export default function KnowledgeBasePage() {
  return (
    <PageShell>
      <PageHero
        kicker="Resources"
        title="Answers before you need to ask."
        sub="Practical guidance for the teams running RegCo day to day — connection, tuning, reporting, and audit, written for compliance and IT readers."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="Browse" title="Most-read articles." />
        <div style={{ marginTop: 8 }}>
          {ARTICLES.map((a, i) => (
            <div key={a.title} style={{ paddingBlock: 24, borderBottom: `1px solid ${T.ink14}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 6, height: 16, background: [T.red, "#1F6FEB", "#B54708", "#1F6FEB", "#0F8A5F", "#7A4DF2"][i], display: "inline-block" }} />
                <span style={{ color: T.ink66, fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, fontWeight: 500 }}>{a.cat}</span>
              </div>
              <div style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 18, fontWeight: 600 }}>{a.title}</div>
              <Para style={{ fontSize: 15 }}>{a.desc}</Para>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <Para style={{ fontSize: 15 }}>Looking for API and integration detail? See the <span style={{ color: T.inkCC, fontWeight: 600 }}>Documentation</span> for connector references.</Para>
      </div>
    </PageShell>
  );
}
