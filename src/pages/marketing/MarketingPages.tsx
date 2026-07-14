import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Check } from "lucide-react";
import SiteNavbar from "@/components/site/SiteNavbar";
import SiteFooter from "@/components/site/SiteFooter";

const institutions = [
  {
    code: "UMFB",
    name: "Unit Microfinance Banks",
    body:
      "Three quarterly CBN returns, one NDIC premium filing, an annual SCUML certification, plus screening and monitoring — handled in an afternoon, not a frantic week. Starter is built for unit MFBs without a full compliance team.",
    note: "Includes: CBN MFB Quarterly · NDIC Premium · Screening · Monitoring",
  },
  {
    code: "SMFB",
    name: "State Microfinance Banks",
    body:
      "More branches, larger ledgers, tighter scrutiny. State MFBs use Growth for multi-branch consolidation, single-obligor monitoring, full case management, and quarterly board packs auditors actually trust.",
    note: "Add-ons: Single-obligor · Case mgmt · Audit packet export",
  },
  {
    code: "NMFB",
    name: "National Microfinance Banks",
    body:
      "When your institution touches every state, the calendar never stops. National MFBs get dedicated onboarding, named support, and the full regulatory intelligence feed.",
    note: "Enterprise · SLA-backed · Dedicated CSM",
  },
  {
    code: "CMB",
    name: "Commercial Banks",
    body:
      "Run RegCo alongside your internal stack as a second line of defense — or replace your spreadsheets entirely. Either way, the result is the same: nothing reaches the CBN late and no customer slips screening.",
    note: "Custom · API integration · Sandbox available",
  },
  {
    code: "FNT",
    name: "Fintechs & Payment Service Banks",
    body:
      "Lean compliance teams, fast-moving regulators. We keep pace so you don't have to read every CBN circular the day it drops, and screen every customer in real time at onboarding.",
    note: "Webhook ingest · Real-time screening · Full audit log",
  },
  {
    code: "PMB",
    name: "Primary Mortgage Banks",
    body:
      "PMB-specific return formats, single-obligor rules tailored to mortgage exposure, and quarterly reporting on the cycle your regulator expects.",
    note: "PMB return suite · Real-estate disclosures",
  },
];

export const WhoWeServePage = () => (
  <div className="min-h-screen bg-white text-ink">
    <SiteNavbar />

    <section className="pt-32 pb-12 md:pt-40 md:pb-16">
      <div className="container-site">
        <p className="tag mb-4">Who we serve</p>
        <h1 className="text-display max-w-[24ch]">
          Six classes of institution. One regulatory standard.
        </h1>
        <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.55] text-ink-3">
          RegCo is built specifically for institutions licensed by the the Central Bank.
          Whether you have three branches or three hundred, the regulator's calendar is the same — and so is our commitment to keeping you ahead of it.
        </p>
      </div>
    </section>

    <section className="container-site pb-20">
      {institutions.map((inst, i) => (
        <article key={inst.code} className="grid grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 border-t border-[var(--line)]">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-3 text-[28px] font-semibold tracking-tight text-ink">{inst.code}</p>
            <p className="mt-1 text-[13.5px] text-ink-3">{inst.name}</p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <p className="text-[16px] leading-[1.55] text-ink">{inst.body}</p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{inst.note}</p>
          </div>
          <div className="col-span-12 md:col-span-2 flex md:justify-end items-start">
            <Link to="/book-demo" className="text-[13px] text-ink hover:underline underline-offset-4 inline-flex items-center gap-1">
              See a demo <ArrowRight size={13} />
            </Link>
          </div>
        </article>
      ))}
      <div className="border-t border-[var(--line)]" />
    </section>

    <section className="bg-ink text-white">
      <div className="container-site py-20 md:py-28 grid md:grid-cols-12 gap-10 items-end">
        <h2 className="md:col-span-7 text-h2 text-white max-w-[20ch]">
          See what RegCo looks like for your institution.
        </h2>
        <div className="md:col-span-5">
          <p className="text-[14.5px] leading-[1.6] text-white/70">
            A twenty-minute walkthrough tailored to your license category and your reporting cycle.
          </p>
          <Link to="/book-demo" className="mt-6 h-10 px-5 inline-flex items-center gap-2 rounded-full bg-white text-ink text-[14px] font-medium hover:bg-white/90 transition-colors">
            Book a demo <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>

    <SiteFooter />
  </div>
);

// ─── Pricing ────────────────────────────────────────────────────────────
type TierProps = {
  name: string;
  price: string;
  cycle: string;
  body: string;
  features: string[];
  cta: string;
  to: string;
  featured?: boolean;
};
const PricingTier = ({ name, price, cycle, body, features, cta, to, featured = false }: TierProps) => (
  <div className={`p-7 border rounded-lg ${featured ? "border-ink bg-white" : "border-[var(--line)] bg-white"}`}>
    <p className="tag mb-3">{name}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-[40px] font-semibold tracking-tight text-ink">{price}</span>
      <span className="text-[13px] text-ink-3">{cycle}</span>
    </div>
    <p className="mt-3 text-[13.5px] text-ink-3 leading-relaxed">{body}</p>
    <ul className="mt-6 space-y-2.5">
      {features.map((f) => (
        <li key={f} className="flex gap-2 text-[13.5px] text-ink leading-[1.55]">
          <Check size={15} className="mt-[3px] flex-shrink-0" strokeWidth={2} /> {f}
        </li>
      ))}
    </ul>
    <Link
      to={to}
      className={`mt-7 h-10 px-5 inline-flex items-center gap-2 rounded-full text-[13.5px] font-medium transition-colors ${
        featured ? "bg-ink text-white hover:bg-[#262626]" : "border border-[var(--line)] text-ink hover:bg-[#F5F5F5]"
      }`}
    >
      {cta} <ArrowUpRight size={14} />
    </Link>
  </div>
);

export const PricingPage = () => (
  <div className="min-h-screen bg-white text-ink">
    <SiteNavbar />
    <section className="pt-32 pb-12 md:pt-40 md:pb-16">
      <div className="container-site">
        <p className="tag mb-4">Pricing</p>
        <h1 className="text-display max-w-[20ch]">
          Priced by license category. Never by the number of returns.
        </h1>
      </div>
    </section>
    <section className="container-site pb-24">
      <div className="grid md:grid-cols-3 gap-5">
        <PricingTier
          name="Starter · Unit MFB"
          price="₦150K"
          cycle="/month"
          body="For unit microfinance banks running a single branch."
          features={["All CBN MFB returns", "NDIC Premium", "Live client screening", "Single user"]}
          cta="Book a demo"
          to="/book-demo"
        />
        <PricingTier
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
        <PricingTier
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
    </section>
    <SiteFooter />
  </div>
);
