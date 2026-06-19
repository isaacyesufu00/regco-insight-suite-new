import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import EditorialNavbar from "@/components/editorial/EditorialNavbar";
import EditorialFooter from "@/components/editorial/EditorialFooter";

const institutions = [
  { code: "UMFB", name: "Unit Microfinance Banks",
    body: "Three quarterly CBN returns, one NDIC premium filing, and an annual SCUML certification — handled in a single afternoon instead of a frantic week. RegCo's Starter tier is built for unit MFBs who can't afford a full compliance team.",
    note: "Most-used: CBN MFB Quarterly Return · NDIC Premium" },
  { code: "SMFB", name: "State Microfinance Banks",
    body: "More branches, larger ledgers, tighter scrutiny. State MFBs use RegCo's Growth tier for multi-branch consolidation, single-obligor monitoring, and quarterly board packs that auditors actually trust.",
    note: "Add-ons: Single-obligor · Customer 360 · Audit tracker" },
  { code: "NMFB", name: "National Microfinance Banks",
    body: "When your institution touches every state in Nigeria, the calendar never stops. National MFBs get dedicated onboarding, named support, and our full regulatory intelligence feed.",
    note: "Enterprise · SLA-backed · Dedicated CSM" },
  { code: "CMB",  name: "Commercial Banks",
    body: "Run RegCo alongside your internal compliance stack as a second line of defense — or replace your spreadsheets entirely. Either way, the result is the same: nothing reaches the CBN late.",
    note: "Custom · API integration · Sandbox available" },
  { code: "FNT",  name: "Fintechs & Payment Service Banks",
    body: "Lean compliance teams, fast-moving regulators. We keep pace so you don't have to read every CBN circular the day it drops.",
    note: "Built for scale-ups · Webhook ingest · Audit log" },
  { code: "PMB",  name: "Primary Mortgage Banks",
    body: "PMB-specific return formats, single-obligor rules tailored to mortgage exposure, and quarterly reporting on the cycle your regulator expects.",
    note: "PMB return suite · Real estate disclosures" },
];

const WhoWeServePage = () => (
  <div className="min-h-screen bg-[var(--paper)] text-ink">
    <EditorialNavbar />

    <section className="pt-36 pb-16 md:pt-44 md:pb-20">
      <div className="container-editorial">
        <p className="tag mb-6">Who we serve</p>
        <h1 className="font-serif text-[44px] md:text-[68px] leading-[1.04]">
          Six classes of institution.<br />
          <span className="italic text-ink-muted">One regulatory standard.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-[17px] text-ink-muted leading-relaxed">
          RegCo is built specifically for institutions licensed by the Central Bank of Nigeria. Whether you have three branches or three hundred, the regulator's calendar is the same — and so is our commitment to keeping you ahead of it.
        </p>
      </div>
    </section>

    <section className="container-editorial pb-24">
      {institutions.map((inst, i) => (
        <article key={inst.code} className="grid md:grid-cols-12 gap-10 py-16 border-t border-ink-10">
          <div className="md:col-span-3">
            <p className="font-mono text-[12px] text-ink-muted">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-4 font-serif text-5xl text-ink">{inst.code}</p>
            <p className="mt-2 text-[14px] text-ink-muted">{inst.name}</p>
          </div>
          <div className="md:col-span-7">
            <p className="font-serif text-[24px] md:text-[26px] leading-[1.35] text-ink">{inst.body}</p>
            <p className="mt-6 text-[12px] tracking-[0.18em] uppercase text-ink-muted">{inst.note}</p>
          </div>
          <div className="md:col-span-2 flex md:justify-end items-start">
            <Link to="/book-demo" className="text-[13.5px] text-ink hover:text-rust transition-colors inline-flex items-center gap-1">
              See a demo <ArrowRight size={14} />
            </Link>
          </div>
        </article>
      ))}
      <div className="border-t border-ink-10" />
    </section>

    <section className="bg-ink text-[var(--paper)]">
      <div className="container-editorial py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
        <h2 className="md:col-span-7 font-serif text-4xl md:text-6xl leading-[1.05] text-[var(--paper)]">
          Find out what RegCo looks like for your institution.
        </h2>
        <div className="md:col-span-5 md:pl-12">
          <p className="text-[15.5px] text-[var(--paper)]/70 leading-relaxed">
            A twenty-minute walkthrough tailored to your license category and your reporting cycle.
          </p>
          <Link to="/book-demo" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--rust)] text-white text-[14.5px] font-medium hover:bg-[var(--rust-dark)] transition-colors">
            Book a demo <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    <EditorialFooter />
  </div>
);

// PricingPage retained as named export for App.tsx compatibility — restyled minimally.
const PricingTier = ({ name, price, cycle, body, features, cta, to, featured = false }: any) => (
  <div className={`p-8 border ${featured ? "border-ink bg-white" : "border-ink-10 bg-[var(--paper)]"} rounded-md`}>
    <p className="tag mb-4">{name}</p>
    <div className="flex items-baseline gap-1">
      <span className="font-serif text-5xl text-ink">{price}</span>
      <span className="text-[13px] text-ink-muted">{cycle}</span>
    </div>
    <p className="mt-4 text-[14px] text-ink-muted leading-relaxed">{body}</p>
    <ul className="mt-6 space-y-2 text-[13.5px] text-ink">
      {features.map((f: string) => <li key={f} className="flex gap-2"><span className="text-rust">·</span>{f}</li>)}
    </ul>
    <Link to={to} className={`mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13.5px] font-medium transition-colors ${featured ? "bg-ink text-[var(--paper)] hover:bg-[var(--rust)]" : "border border-ink-15 text-ink hover:bg-ink/[0.04]"}`}>
      {cta} <ArrowUpRight size={14} />
    </Link>
  </div>
);

const PricingPage = () => (
  <div className="min-h-screen bg-[var(--paper)] text-ink">
    <EditorialNavbar />
    <section className="pt-36 pb-16 md:pt-44">
      <div className="container-editorial">
        <p className="tag mb-6">Pricing</p>
        <h1 className="font-serif text-[44px] md:text-[64px] leading-[1.04]">
          Priced by license category.<br />
          <span className="italic text-ink-muted">Never by the number of returns.</span>
        </h1>
      </div>
    </section>
    <section className="container-editorial pb-32">
      <div className="grid md:grid-cols-3 gap-6">
        <PricingTier name="Starter · Unit MFB" price="₦150K" cycle="/month"
          body="For unit microfinance banks running a single branch."
          features={["All CBN MFB returns", "NDIC Premium", "Email support", "Single user"]}
          cta="Book a demo" to="/book-demo" />
        <PricingTier name="Growth · State MFB" price="₦450K" cycle="/month" featured
          body="For multi-branch state MFBs needing consolidation and oversight."
          features={["Everything in Starter", "Single-obligor monitoring", "Customer 360", "Audit tracker", "5 users"]}
          cta="Book a demo" to="/book-demo" />
        <PricingTier name="Enterprise" price="Custom" cycle=""
          body="National MFBs, commercial banks, PMBs, fintechs."
          features={["Everything in Growth", "API & webhook ingest", "Dedicated CSM", "SLA-backed", "Unlimited users"]}
          cta="Contact sales" to="/contact/partnerships" />
      </div>
    </section>
    <EditorialFooter />
  </div>
);

export { WhoWeServePage, PricingPage };
