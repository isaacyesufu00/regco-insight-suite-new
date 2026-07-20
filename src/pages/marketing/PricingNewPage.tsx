import { PageShell, PageHero, TierCard, Para, MAX, NARROW, T } from "./_shared";

export default function PricingNewPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Pricing"
        title="Priced by license category. Never by the number of returns."
        sub="Every plan covers your regulatory calendar — you only move up as your institution grows in scope."
      />
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingInline: 16, paddingBottom: 96 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
          <TierCard
            name="Starter · Unit MFB"
            price="₦150K"
            cycle="/month"
            body="For unit microfinance banks running a single branch."
            features={["All CBN MFB returns", "NDIC Premium", "Live client screening", "Single user"]}
            cta="Book a demo"
            to="/book-demo"
          />
          <TierCard
            name="Growth · State MFB"
            price="₦450K"
            cycle="/month"
            featured
            body="For multi-branch state MFBs needing consolidation, monitoring, and case management."
            features={[
              "Everything in Starter",
              "Transaction monitoring",
              "Case management",
              "Single-obligor monitoring",
              "5 users",
            ]}
            cta="Book a demo"
            to="/book-demo"
          />
          <TierCard
            name="Enterprise"
            price="Custom"
            cycle=""
            body="National MFBs, commercial banks, PMBs, fintechs."
            features={[
              "Everything in Growth",
              "API & webhook ingest",
              "Dedicated CSM",
              "SLA-backed",
              "Unlimited users",
            ]}
            cta="Contact sales"
            to="/contact/partnerships"
          />
        </div>
        <Para style={{ fontSize: 14, marginTop: 24, textAlign: "center" }}>
          All plans include CBN, NFIU, SCUML, NDIC, and FIRS return support. Pricing is indicative and confirmed during onboarding.
        </Para>
      </div>
    </PageShell>
  );
}
