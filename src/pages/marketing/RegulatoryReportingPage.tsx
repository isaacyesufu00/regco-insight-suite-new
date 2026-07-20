import { PageShell, PageHero, SectionHeading, Para, FeatureRow, MAX, NARROW, T } from "./_shared";

const FEATURES = [
  { title: "CBN return preparation", body: "Regulatory returns are assembled from live operational data and validated before submission, removing the manual spreadsheet assembly that drives most reporting errors." },
  { title: "Automated reconciliation", body: "Figures are reconciled across sources so inconsistencies are caught and resolved inside the platform, not flagged by the regulator after the fact." },
  { title: "NFIU GoAML output", body: "Suspicious transaction and activity reports are formatted to NFIU GoAML expectations, with the supporting narrative attached for the receiving unit." },
  { title: "Submission-ready packages", body: "Each return ships as a complete, reviewable package — data, validation notes, and sign-off — so approval is a decision, not an investigation." },
];

export default function RegulatoryReportingPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Platform"
        title="Reporting that is ready before the deadline."
        sub="RegCo generates CBN returns and NFIU submissions from your own data, validates them, and packages them for sign-off — turning days of manual work into minutes."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="What it does" title="From raw data to a return you can defend." />
        <div style={{ marginTop: 8 }}>
          {FEATURES.map((f) => <FeatureRow key={f.title} title={f.title} body={f.body} bar="#B54708" />)}
        </div>
      </div>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ borderRadius: 4, boxShadow: `inset 0 0 0 1px ${T.ink14}`, overflow: "clip", position: "relative", aspectRatio: "16 / 7" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #2B2418 0%, #15110A 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, color: T.ink66 }}>Regulatory reporting view</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
