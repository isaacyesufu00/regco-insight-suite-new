import { PageShell, PageHero, SectionHeading, Para, FeatureRow, MAX, NARROW, T } from "./_shared";

const FEATURES = [
  { title: "Continuous transaction monitoring", body: "Every payment, transfer, and ledger movement is evaluated in near real time against behavioural baselines, so unusual patterns surface while they are still actionable rather than weeks after the fact." },
  { title: "Adaptive anomaly detection", body: "Models learn what normal looks like for each institution, customer segment, and channel — flagging velocity spikes, structuring, and round-tripping that static rules routinely miss." },
  { title: "Explainable risk scoring", body: "Each alert carries the signals that drove it: amount, counterparty, geography, device, and history. Investigators see the why, not just the flag, so triage is faster and defensible." },
  { title: "Investigator workflow", body: "Cases route to the right desk with full context attached. Decisions, evidence, and dispositions are recorded so the trail survives any audit or regulator review." },
];

export default function FraudDetectionPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Platform"
        title="Fraud detection that keeps pace with the transaction."
        sub="RegCo watches every movement of money across your institution and turns raw activity into prioritized, explainable cases — so your team spends time on real risk, not noise."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="What it does" title="From raw activity to a queue your team can trust." />
        <div style={{ marginTop: 8 }}>
          {FEATURES.map((f) => <FeatureRow key={f.title} title={f.title} body={f.body} bar={T.red} />)}
        </div>
      </div>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ borderRadius: 4, boxShadow: `inset 0 0 0 1px ${T.ink14}`, overflow: "clip", position: "relative", aspectRatio: "16 / 7" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #2A2A28 0%, #141413 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, color: T.ink66 }}>Fraud monitoring workspace</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
