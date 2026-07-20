import { PageShell, PageHero, SectionHeading, Para, FeatureRow, MAX, NARROW, T, DarkPill } from "./_shared";

const MODULES = [
  { title: "Fraud Detection", body: "Continuous, near-real-time monitoring of every transaction, with explainable risk scores that route the right cases to the right desk.", bar: T.red },
  { title: "Identity Screening", body: "BVN and NIN verification, sanctions and PEP screening, and adverse-media monitoring — captured as a repeatable due-diligence workflow.", bar: "#1F6FEB" },
  { title: "Audit & Governance", body: "An immutable, queryable record of every decision and control, so audit preparation is a continuous state rather than a quarterly scramble.", bar: "#0F8A5F" },
  { title: "Regulatory Reporting", body: "CBN returns and NFIU submissions assembled from your live data, validated, and packaged for sign-off before the deadline.", bar: "#B54708" },
  { title: "AI Compliance Brain", body: "Reasoning over your data and the rules that apply, offering evidence-linked guidance your team can act on and auditors can trace.", bar: "#7A4DF2" },
];

export default function ProductNewPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Product"
        title="One operating system for compliance."
        sub="RegCo unifies fraud detection, identity screening, audit and governance, regulatory reporting, and an AI compliance brain — so every transaction, customer, and return is always ready for review."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 48 }}>
        <SectionHeading kicker="Platform" title="What sits inside RegCo." />
        <div style={{ marginTop: 8 }}>
          {MODULES.map((m) => <FeatureRow key={m.title} title={m.title} body={m.body} bar={m.bar} />)}
        </div>
      </div>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ borderRadius: 4, boxShadow: `inset 0 0 0 1px ${T.ink14}`, overflow: "clip", position: "relative", aspectRatio: "16 / 7" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1C1C1A 0%, #0E0E0D 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, color: T.ink66 }}>The RegCo platform</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <DarkPill to="/book-demo">Book a demo</DarkPill>
          <DarkPill to="/who-we-serve">Who we serve</DarkPill>
        </div>
      </div>
    </PageShell>
  );
}
