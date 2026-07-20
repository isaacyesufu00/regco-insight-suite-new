import { PageShell, PageHero, SectionHeading, Para, FeatureRow, MAX, NARROW, T } from "./_shared";

const FEATURES = [
  { title: "Immutable audit trail", body: "Every decision, review, and override is recorded with who, when, and why. The trail cannot be rewritten, giving auditors a single source of truth." },
  { title: "Control monitoring", body: "Governance controls are tracked continuously rather than sampled at year-end, so gaps are visible the moment a control drifts out of tolerance." },
  { title: "Case and workflow evidence", body: "Investigations carry their evidence with them — documents, notes, and approvals live alongside the case so nothing has to be reconstructed under pressure." },
  { title: "Management visibility", body: "Leadership sees governance posture in real time: open items, overdue reviews, and control health across the institution in one view." },
];

export default function AuditGovernancePage() {
  return (
    <PageShell>
      <PageHero
        kicker="Platform"
        title="Governance your auditors will recognise."
        sub="RegCo preserves every decision and monitors every control, turning audit preparation from a quarterly scramble into a continuous state of readiness."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="What it does" title="Traceability built into the workflow." />
        <div style={{ marginTop: 8 }}>
          {FEATURES.map((f) => <FeatureRow key={f.title} title={f.title} body={f.body} bar="#0F8A5F" />)}
        </div>
      </div>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ borderRadius: 4, boxShadow: `inset 0 0 0 1px ${T.ink14}`, overflow: "clip", position: "relative", aspectRatio: "16 / 7" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #20271F 0%, #11140F 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, color: T.ink66 }}>Audit and governance view</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
