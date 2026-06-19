import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Check } from "lucide-react";
import SiteNavbar from "@/components/site/SiteNavbar";
import SiteFooter from "@/components/site/SiteFooter";

type Product = {
  id: string;
  n: string;
  kicker: string;
  name: string;
  lede: string;
  features: string[];
};

const products: Product[] = [
  {
    id: "returns",
    n: "01",
    kicker: "Automated Returns",
    name: "End-to-end CBN, NFIU, NDIC, SCUML, FIRS filing.",
    lede:
      "RegCo compiles every mandatory return from your core banking data, runs the same arithmetic and edit checks the regulator runs, and submits on the regulator's calendar. Your compliance officer approves; we handle the rest.",
    features: [
      "All 17 mandatory returns across CBN, NDIC, NFIU, SCUML, FIRS, PENCOM",
      "Schema validation against live regulator specifications",
      "PDF, Word, Excel and XML/JSON outputs",
      "Quarterly board-pack export from the same dataset",
      "Filing acknowledgements stored against each submission",
    ],
  },
  {
    id: "screening",
    n: "02",
    kicker: "Live Client Screening",
    name: "BVN, NIN, sanctions, PEP, adverse media — one verdict, fully audited.",
    lede:
      "Every customer screened at onboarding and continuously thereafter. We cross-check the five legally mandated watchlists (UN, US OFAC, EU, UK HMT, CBN), match against PEP databases, and surface adverse-media hits — with the underlying evidence retained against the customer record.",
    features: [
      "BVN and NIN verification against NIBSS and NIMC",
      "Sanctions: UN Security Council · OFAC SDN · EU Consolidated · UK HMT · CBN Watchlist",
      "PEP and adverse-media screening with name-matching tuned for Nigerian naming conventions",
      "Continuous re-screening with status change alerts",
      "Per-customer evidence packet, retrievable on demand",
    ],
  },
  {
    id: "monitoring",
    n: "03",
    kicker: "Transaction Monitoring",
    name: "Near-real-time fraud, AML, and anomaly detection.",
    lede:
      "Rules tuned to Nigerian thresholds — CTR ₦5M, 24-hour velocity ₦10M, structuring, dormancy triggers, narration mismatches — running across every transaction your CBS produces. Cases route straight into the queue with the evidence already attached.",
    features: [
      "Sub-100ms median screening latency at production tier",
      "CTR, structuring, velocity, dormancy, counter-party risk rules out of the box",
      "Configurable thresholds per license category",
      "Auto-generated STR/CTR drafts ready for NFIU submission",
      "False-positive ratio surfaced and trended over time",
    ],
  },
  {
    id: "audit",
    n: "04",
    kicker: "Audit Trail & Case Management",
    name: "One chain of custody. Every decision, attributable.",
    lede:
      "Every alert, override, escalation, and submission is recorded with actor, timestamp, and evidence attached. When the examiner arrives — or when an internal audit asks who approved what — the answer is one click away.",
    features: [
      "Immutable audit log across returns, screening, and monitoring",
      "Case workflow: assign, escalate, attach evidence, resolve",
      "Examiner-ready evidence packet export",
      "Role-based access control with full action history",
      "Retention policies aligned to CBN record-keeping requirements",
    ],
  },
];

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <SiteNavbar />

      {/* Intro */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-site">
          <p className="tag mb-4">The product</p>
          <h1 className="text-display max-w-[22ch] text-ink">
            Four products. One regulatory operating system.
          </h1>
          <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.55] text-ink-3">
            RegCo replaces the spreadsheets, consultants, and last-minute scrambles with a single
            system that owns returns, screening, monitoring, and audit for licensed Nigerian financial
            institutions.
          </p>

          {/* Anchor index */}
          <ul className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[var(--line)] pt-6">
            {products.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} className="block group">
                  <span className="font-mono text-[12px] text-ink-3">{p.n}</span>
                  <span className="block mt-1 text-[14px] text-ink group-hover:underline underline-offset-4">
                    {p.kicker}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Product sections */}
      <section className="container-site pb-16">
        {products.map((p) => (
          <article
            key={p.id}
            id={p.id}
            className="scroll-mt-24 grid grid-cols-12 gap-8 md:gap-12 py-16 md:py-24 border-t border-[var(--line)]"
          >
            <div className="col-span-12 md:col-span-5">
              <span className="font-mono text-[12px] text-ink-3">{p.n}</span>
              <p className="tag mt-3 mb-3">{p.kicker}</p>
              <h2 className="text-h2 text-ink">{p.name}</h2>
              <p className="mt-5 text-[15.5px] leading-[1.6] text-ink-3 max-w-[44ch]">{p.lede}</p>
            </div>

            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3 mb-4">
                What it includes
              </p>
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[14.5px] text-ink leading-[1.55]">
                    <Check size={16} className="mt-[3px] flex-shrink-0 text-ink" strokeWidth={2} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/book-demo"
                  className="h-10 px-5 inline-flex items-center gap-2 rounded-full bg-ink text-white text-[13.5px] font-medium hover:bg-[#262626] transition-colors"
                >
                  Book a demo <ArrowUpRight size={14} />
                </Link>
                <Link
                  to="/pricing"
                  className="h-10 px-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] text-ink text-[13.5px] font-medium hover:bg-[#F5F5F5] transition-colors"
                >
                  Pricing <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}
        <div className="border-t border-[var(--line)]" />
      </section>

      {/* Closing band */}
      <section className="bg-ink text-white">
        <div className="container-site py-20 md:py-28 grid md:grid-cols-12 gap-10 items-end">
          <h2 className="md:col-span-7 text-h2 text-white max-w-[20ch]">
            See your next return, screen, alert, and case in one walkthrough.
          </h2>
          <div className="md:col-span-5">
            <p className="text-[14.5px] leading-[1.6] text-white/70">
              Bring a real export from last quarter. We'll generate the return, screen a customer,
              and walk through an open case in under twenty minutes.
            </p>
            <Link
              to="/book-demo"
              className="mt-6 h-10 px-5 inline-flex items-center gap-2 rounded-full bg-white text-ink text-[14px] font-medium hover:bg-white/90 transition-colors"
            >
              Book a demo <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
