import { PageShell, PageHero, Para, MAX, T, DarkPill } from "./_shared";

const PARAS = [
  "RegCo began inside the institutions it now serves. We watched compliance teams at banks, fintechs, and agencies fight the same battle — fragmented tools, manual filings, and audits that arrived too late to matter.",
  "We proved a small, focused team could raise the bar in a category that had settled for less. We built with taste, conviction, and an obsession with making regulatory work feel simpler, smarter, and genuinely trustworthy.",
  "RegCo is now building the AI operating system for compliance across Nigerian financial services. With the backing of the institutions we serve, that ambition goes further.",
];

export default function AboutNewPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Company"
        title="We build the infrastructure compliance runs on."
        sub="RegCo exists to make regulatory work continuous, intelligent, and ready for review — long before an auditor arrives."
      />
      <div style={{ maxWidth: 520, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        {PARAS.map((p, i) => (
          <p key={i} style={{
            color: T.ink99, fontFamily: "Inter, system-ui, sans-serif", fontSize: 21, fontWeight: 400,
            letterSpacing: "-0.21px", lineHeight: 1.55, textWrap: "pretty",
            marginBottom: i < PARAS.length - 1 ? 28 : 0, marginTop: i === PARAS.length - 1 ? 24 : 0,
          }}>{p}</p>
        ))}
        <div style={{ marginTop: 44, width: 200, aspectRatio: "541 / 129", background: "linear-gradient(135deg, #E9E9E2 0%, #DEDCD3 100%)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 15, color: T.ink66 }}>RegCo</span>
        </div>
      </div>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <DarkPill to="/careers">Careers</DarkPill>
          <DarkPill to="/contact">Contact us</DarkPill>
        </div>
      </div>
    </PageShell>
  );
}
