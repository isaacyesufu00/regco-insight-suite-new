import { PageShell, PageHero, SectionHeading, Para, FeatureRow, MAX, NARROW, T } from "./_shared";

const FEATURES = [
  { title: "Sanctions, PEP, and watchlist screening", body: "Customers and counterparties are checked against Nigerian and global lists on onboarding and continuously afterward, so a change in status is caught the moment it happens." },
  { title: "BVN and NIN verification", body: "Identity is validated against national identifiers, with fuzzy matching that handles transliteration and nickname variation without blocking legitimate customers." },
  { title: "Adverse media and reputation signals", body: "News and public-source monitoring surfaces negative coverage linked to a customer or entity, giving investigators context a bare list match cannot provide." },
  { title: "Structured due diligence", body: "KYC and enhanced due diligence steps are captured as a repeatable workflow, with risk ratings that travel with the customer through every review." },
];

export default function IdentityScreeningPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Platform"
        title="Know exactly who you are dealing with."
        sub="RegCo brings customer identity, screening, and due diligence into one continuous process — reducing compliance exposure before risk ever enters the institution."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <SectionHeading kicker="What it does" title="Screen once, then keep screening." />
        <div style={{ marginTop: 8 }}>
          {FEATURES.map((f) => <FeatureRow key={f.title} title={f.title} body={f.body} bar="#1F6FEB" />)}
        </div>
      </div>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ borderRadius: 4, boxShadow: `inset 0 0 0 1px ${T.ink14}`, overflow: "clip", position: "relative", aspectRatio: "16 / 7" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #23262B 0%, #121417 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, color: T.ink66 }}>Identity review workspace</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
