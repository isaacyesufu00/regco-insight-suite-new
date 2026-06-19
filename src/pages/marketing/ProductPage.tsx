import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import EditorialNavbar from "@/components/editorial/EditorialNavbar";
import EditorialFooter from "@/components/editorial/EditorialFooter";

const Row = ({
  index, kicker, title, body, reverse = false,
}: { index: string; kicker: string; title: string; body: string; reverse?: boolean }) => (
  <div className={`grid md:grid-cols-12 gap-10 items-center py-20 md:py-28 border-t border-ink-10`}>
    <div className={`md:col-span-5 ${reverse ? "md:order-2" : ""}`}>
      <p className="font-mono text-[12px] text-ink-muted mb-4">{index}</p>
      <p className="tag mb-3">{kicker}</p>
      <h3 className="font-serif text-[34px] md:text-[40px] leading-[1.08] text-ink">{title}</h3>
      <p className="mt-5 text-[15.5px] leading-relaxed text-ink-muted max-w-md">{body}</p>
    </div>
    <div className={`md:col-span-7 ${reverse ? "md:order-1" : ""}`}>
      <div className="aspect-[4/3] w-full bg-white border border-ink-10 rounded-md p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "linear-gradient(90deg, var(--ink) 1px, transparent 1px), linear-gradient(var(--ink) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="relative h-full flex flex-col">
          <p className="font-serif italic text-ink-muted">{kicker.toLowerCase()}</p>
          <div className="flex-1 grid grid-cols-6 gap-2 mt-6">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="bg-[var(--paper-2)] rounded-sm" style={{ opacity: 0.35 + (i % 7) * 0.08 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductPage = () => (
  <div className="min-h-screen bg-[var(--paper)] text-ink">
    <EditorialNavbar />

    <section className="pt-36 pb-16 md:pt-44">
      <div className="container-editorial">
        <p className="tag mb-6">The product</p>
        <h1 className="font-serif text-[44px] md:text-[68px] leading-[1.04]">
          A regulatory operating system,<br />
          <span className="italic text-ink-muted">made for the way you actually work.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-[17px] text-ink-muted leading-relaxed">
          RegCo connects to your core banking system, generates every return your regulator requires, and tracks the calendar so your compliance team never scrambles again.
        </p>
      </div>
    </section>

    <section className="container-editorial pb-24">
      <Row index="01" kicker="Connect"   title="Any core banking system. Any export format."
           body="Upload Excel, CSV, or pull directly from T24, Finacle, Flexcube, or Bankone. Our universal parser maps your trial balance, customer ledger, and transaction file to CBN-compliant schema in seconds." />
      <Row index="02" kicker="Validate"  title="Catches what the regulator would catch — first."  reverse
           body="Every figure runs through the same arithmetic and edit checks regulators use on submission. You see the warnings before they do." />
      <Row index="03" kicker="Generate"  title="Pixel-perfect returns, in the format that's required."
           body="CBN MFB Quarterly Return, NDIC Premium Assessment, NFIU CTR/STR, SCUML, FIRS CIT/VAT/PAYE/WHT — rendered to spec, exportable as PDF, Word or Excel." />
      <Row index="04" kicker="File"      title="The regulator's calendar, as your team's calendar." reverse
           body="Automated deadline reminders for every return your institution owes. A full audit trail behind every submission. A board pack at the end of every quarter." />
      <Row index="05" kicker="Intelligence" title="An AI compliance officer at your side."
           body="Ask in plain English: 'What's our single-obligor exposure to Customer X?' Our agent reads your data, applies the CBN rule, and answers — with citations." />
    </section>

    <section className="bg-ink text-[var(--paper)]">
      <div className="container-editorial py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
        <h2 className="md:col-span-7 font-serif text-4xl md:text-6xl leading-[1.05] text-[var(--paper)]">
          See your next return generated live.
        </h2>
        <div className="md:col-span-5 md:pl-12">
          <p className="text-[15.5px] text-[var(--paper)]/70 leading-relaxed">
            Bring a real export from last quarter. We'll generate the return in under five minutes.
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

export default ProductPage;
