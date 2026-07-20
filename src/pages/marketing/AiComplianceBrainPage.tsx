import { PageShell, PageHero, SectionHeading, Para, FeatureRow, MAX, NARROW, T } from "./_shared";

const FEATURES = [
  { title: "Regulation-aware reasoning", body: "The compliance brain works against structured regulatory logic and institutional policy, so its answers stay grounded in rules rather than generic model output." },
  { title: "Evidence-linked answers", body: "Every recommendation points back to the data, control, or regulation that supports it. Nothing is asserted without a traceable source." },
  { title: "Plain-language explanation", body: "Complex obligations are translated into clear guidance for the officer on the case, reducing the interpretation gap between policy and practice." },
  { title: "Human in the loop", body: "The brain proposes; your team disposes. Decisions remain with qualified reviewers, with the model's reasoning preserved for audit." },
];

export default function AiComplianceBrainPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Platform"
        title="An AI colleague for every compliance decision."
        sub="The RegCo compliance brain reasons over your data and the rules that apply to it, offering explainable guidance your team can act on and auditors can trust."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="What it does" title="Intelligence with a paper trail." />
        <div style={{ marginTop: 8 }}>
          {FEATURES.map((f) => <FeatureRow key={f.title} title={f.title} body={f.body} bar="#7A4DF2" />)}
        </div>
      </div>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ borderRadius: 4, boxShadow: `inset 0 0 0 1px ${T.ink14}`, overflow: "clip", position: "relative", aspectRatio: "16 / 7" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #211C2E 0%, #100C16 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, color: T.ink66 }}>Compliance brain workspace</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
