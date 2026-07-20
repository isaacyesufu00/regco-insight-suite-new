import { PageShell, PageHero, SectionHeading, Para, FeatureRow, NARROW, T, DarkPill } from "./_shared";

const VALUES = [
  { title: "Regulatory fluency", body: "We hire people who respect the difference between a model that sounds right and one that is provably compliant." },
  { title: "Traceability by default", body: "Every feature we ship is built to be explained. If we cannot show the trail, we do not ship it." },
  { title: "Institution-grade craft", body: "Banks and regulators depend on this software. We hold ourselves to the standard that dependency demands." },
];

const ROLES = [
  { title: "Compliance Engineers", loc: "Lagos / Remote", desc: "Bridge regulatory logic and product, turning obligations into working features." },
  { title: "ML Researchers", loc: "Remote", desc: "Build detection and reasoning models grounded in financial-institution data." },
  { title: "Implementation Specialists", loc: "Lagos", desc: "Help institutions connect RegCo to their CBS and go live with confidence." },
];

export default function CareersPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Company"
        title="Build the infrastructure compliance runs on."
        sub="We are assembling the team behind Africa's compliance operating system — engineers, researchers, and compliance specialists who want their work to matter to regulated institutions."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="Why RegCo" title="What we care about." />
        <div style={{ marginTop: 8 }}>
          {VALUES.map((v) => <FeatureRow key={v.title} title={v.title} body={v.body} bar={T.red} />)}
        </div>
      </div>
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="Open roles" title="Join the team." />
        <div style={{ marginTop: 8 }}>
          {ROLES.map((r) => (
            <div key={r.title} style={{ display: "flex", alignItems: "flex-start", gap: 16, paddingBlock: 24, borderBottom: `1px solid ${T.ink14}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 18, fontWeight: 600 }}>{r.title}</div>
                <Para style={{ fontSize: 15 }}>{r.desc}</Para>
                <div style={{ color: T.ink66, fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, marginTop: 8 }}>{r.loc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <DarkPill to="/contact">Get in touch</DarkPill>
      </div>
    </PageShell>
  );
}
