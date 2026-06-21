import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import SiteNavbar from "@/components/site/SiteNavbar";
import SiteFooter from "@/components/site/SiteFooter";

export type FeaturePageProps = {
  seoTitle: string;
  seoDescription: string;
  tag: string;
  title: string;
  intro: string;
  problem: { heading: string; body: string };
  capabilities: { icon: LucideIcon; title: string; body: string }[];
  workflow: { step: string; title: string; body: string }[];
  benefits: { metric: string; label: string }[];
  badges: string[];
  faqs: { q: string; a: string }[];
};

/* A small inline mock visual used on the right side of each row.
   No cards — just a labelled table on a hairline border, on white. */
function MockTable({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4 text-[12px] text-ink-3">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink" />
        {title}
      </div>
      <div className="border-t border-[var(--line)]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b border-[var(--line)] py-3">
            <span className="text-[13.5px] text-ink-3">{k}</span>
            <span className="text-[13.5px] text-ink font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitRow({
  tag, heading, body, right,
}: {
  tag: string; heading: string; body: string; right: React.ReactNode;
}) {
  return (
    <section className="border-t border-[var(--line)] py-20 md:py-28 bg-white">
      <div className="container-site grid grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="col-span-12 md:col-span-6">
          <p className="tag mb-4">{tag}</p>
          <h2 className="text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] font-semibold text-ink max-w-[18ch]">
            {heading}
          </h2>
          <p className="mt-6 text-[16px] md:text-[17px] leading-[1.6] text-ink-3 max-w-[44ch]">
            {body}
          </p>
        </div>
        <div className="col-span-12 md:col-span-6">{right}</div>
      </div>
    </section>
  );
}

export default function FeaturePageTemplate(props: FeaturePageProps) {
  const {
    seoTitle, seoDescription, tag, title, intro,
    problem, capabilities, workflow, benefits, badges, faqs,
  } = props;

  useEffect(() => {
    document.title = seoTitle;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", seoDescription);
  }, [seoTitle, seoDescription]);

  // Pick the two leading capabilities and the two leading benefits
  // to compose the right-hand mock visuals (no cards, just data).
  const capRows: [string, string][] = capabilities.slice(0, 4).map((c) => [c.title, "Active"]);
  const benRows: [string, string][] = benefits.slice(0, 4).map((b) => [b.label, b.metric]);

  return (
    <div className="min-h-screen bg-white text-ink">
      <SiteNavbar />

      {/* Hero — also a split row, no cards */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-white">
        <div className="container-site grid grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="col-span-12 md:col-span-6">
            <p className="tag mb-4">{tag}</p>
            <h1 className="text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.03em] font-semibold text-ink max-w-[18ch]">
              {title}
            </h1>
            <p className="mt-6 text-[17px] md:text-[18px] leading-[1.55] text-ink-3 max-w-[48ch]">
              {intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/book-demo"
                className="h-11 px-5 inline-flex items-center rounded-full bg-ink text-white text-[14px] font-medium hover:bg-[#262626] transition-colors"
              >
                Book a demo <ArrowRight size={15} className="ml-1.5" />
              </Link>
              <Link
                to="/pricing"
                className="h-11 px-5 inline-flex items-center rounded-full border border-[var(--line)] text-ink text-[14px] font-medium hover:bg-[#FAFAFA] transition-colors"
              >
                See pricing
              </Link>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <MockTable title="Current cycle" rows={capRows} />
          </div>
        </div>
      </section>

      {/* Problem — split row */}
      <SplitRow
        tag="The problem"
        heading={problem.heading}
        body={problem.body}
        right={
          <div className="border-l border-[var(--line)] pl-8 py-2">
            <p className="text-[13px] uppercase tracking-[0.15em] text-ink-3 mb-3">Today, without RegCo</p>
            <ul className="space-y-3 text-[15px] leading-[1.55] text-ink">
              <li>— Hand-built returns from CBS exports</li>
              <li>— Edit-check fails discovered after submission</li>
              <li>— No audit trail of who approved what</li>
              <li>— Manual screening against stale watchlists</li>
            </ul>
          </div>
        }
      />

      {/* Capabilities — one split row per capability, no cards */}
      {capabilities.map((c, i) => {
        const Icon = c.icon;
        return (
          <SplitRow
            key={c.title}
            tag={`Capability · ${String(i + 1).padStart(2, "0")}`}
            heading={c.title}
            body={c.body}
            right={
              <div className="flex items-start gap-5 py-2">
                <Icon size={22} strokeWidth={1.6} className="text-ink mt-1 flex-shrink-0" />
                <div className="border-l border-[var(--line)] pl-5">
                  <p className="text-[13px] uppercase tracking-[0.15em] text-ink-3 mb-2">
                    What this gives you
                  </p>
                  <p className="text-[15px] leading-[1.6] text-ink max-w-[40ch]">
                    {c.body.split(".")[0]}.
                  </p>
                </div>
              </div>
            }
          />
        );
      })}

      {/* Workflow — three steps, inline, no cards */}
      <section className="border-t border-[var(--line)] py-20 md:py-28 bg-white">
        <div className="container-site">
          <p className="tag mb-3">How it works</p>
          <h2 className="text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] font-semibold text-ink max-w-[24ch]">
            Three steps from raw data to regulator-ready output.
          </h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
            {workflow.map((s) => (
              <div key={s.step} className="border-t border-ink pt-5">
                <span className="font-mono text-[12px] text-ink-3">{s.step}</span>
                <h3 className="mt-3 text-[20px] font-semibold text-ink tracking-[-0.01em]">{s.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-3 max-w-[36ch]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits — split row with measurable outcomes, no cards */}
      <SplitRow
        tag="Outcomes"
        heading="Measurable, defensible improvements your examiner can verify."
        body="Every figure on this page is recomputed from your live core banking data, with the calculation, source, and approver attached. Nothing here is anecdotal."
        right={<MockTable title="Measured against baseline" rows={benRows} />}
      />

      {/* Badges — single inline row */}
      <section className="border-t border-[var(--line)] py-12 bg-white">
        <div className="container-site flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="text-[13px] uppercase tracking-[0.15em] text-ink-3">Aligned with</span>
          {badges.map((b) => (
            <span key={b} className="text-[14px] text-ink">{b}</span>
          ))}
        </div>
      </section>

      {/* FAQ — split, no cards */}
      <section className="border-t border-[var(--line)] py-20 md:py-28 bg-white">
        <div className="container-site grid grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="col-span-12 md:col-span-5">
            <p className="tag mb-4">FAQ</p>
            <h2 className="text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] font-semibold text-ink max-w-[18ch]">
              Questions compliance teams ask before signing.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 divide-y divide-[var(--line)]">
            {faqs.map((f) => (
              <div key={f.q} className="py-6 first:pt-0 last:pb-0">
                <h3 className="text-[17px] font-semibold text-ink mb-2">{f.q}</h3>
                <p className="text-[14.5px] leading-[1.65] text-ink-3">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — minimal, no card */}
      <section className="border-t border-[var(--line)] py-20 md:py-28 bg-white">
        <div className="container-site">
          <h2 className="text-[34px] md:text-[48px] leading-[1.05] tracking-[-0.02em] font-semibold text-ink max-w-[22ch]">
            See it on your own returns calendar.
          </h2>
          <p className="mt-5 text-[16px] text-ink-3 max-w-[52ch]">
            A 30-minute demo with our compliance engineers, walked through against your license category and CBS.
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            <Link
              to="/book-demo"
              className="h-11 px-5 inline-flex items-center rounded-full bg-ink text-white text-[14px] font-medium hover:bg-[#262626] transition-colors"
            >
              Book a demo <ArrowRight size={15} className="ml-1.5" />
            </Link>
            <Link
              to="/product"
              className="h-11 px-5 inline-flex items-center rounded-full border border-[var(--line)] text-ink text-[14px] font-medium hover:bg-[#FAFAFA] transition-colors"
            >
              See full product overview
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
