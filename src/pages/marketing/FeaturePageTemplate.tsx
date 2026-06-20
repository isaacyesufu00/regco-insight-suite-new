import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-white text-ink">
      <SiteNavbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-site">
          <p className="tag mb-4">{tag}</p>
          <h1 className="text-display max-w-[22ch] text-ink">{title}</h1>
          <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.55] text-ink-3">{intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/book-demo"
              className="h-11 px-5 inline-flex items-center rounded-full bg-ink text-white text-[14px] font-medium hover:bg-[#262626] transition-colors"
            >
              Book a demo <ArrowRight size={15} className="ml-1.5" />
            </Link>
            <Link
              to="/pricing"
              className="h-11 px-5 inline-flex items-center rounded-full border border-[var(--line)] text-ink text-[14px] font-medium hover:bg-[#F5F5F5] transition-colors"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-[var(--line)] py-16 md:py-20">
        <div className="container-site grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <p className="tag">The problem</p>
            <h2 className="mt-3 text-[24px] md:text-[28px] leading-[1.2] font-semibold text-ink">
              {problem.heading}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <p className="text-[16px] leading-[1.65] text-ink-3">{problem.body}</p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-[var(--line)] py-16 md:py-20 bg-[#FAFAF7]">
        <div className="container-site">
          <p className="tag mb-3">Capabilities</p>
          <h2 className="text-[26px] md:text-[32px] leading-[1.15] font-semibold text-ink max-w-[24ch]">
            Built for the way Nigerian regulators actually work.
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="bg-white border border-[var(--line)] rounded-xl p-6">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F5F0] flex items-center justify-center mb-4">
                    <Icon size={18} strokeWidth={1.8} className="text-ink" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-ink mb-1.5">{c.title}</h3>
                  <p className="text-[13.5px] leading-[1.55] text-ink-3">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-t border-[var(--line)] py-16 md:py-20">
        <div className="container-site">
          <p className="tag mb-3">How it works</p>
          <h2 className="text-[26px] md:text-[32px] leading-[1.15] font-semibold text-ink max-w-[26ch]">
            Three steps from raw data to regulator-ready output.
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {workflow.map((s, i) => (
              <div key={s.step} className="relative">
                <span className="font-mono text-[12px] text-ink-3">{s.step}</span>
                <h3 className="mt-2 text-[17px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-ink-3">{s.body}</p>
                {i < workflow.length - 1 && (
                  <div className="hidden md:block absolute top-4 right-[-12px] text-ink-3">
                    <ArrowRight size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-[var(--line)] py-16 md:py-20 bg-ink text-white">
        <div className="container-site">
          <p className="tag text-white/50 mb-3">Outcomes</p>
          <h2 className="text-[26px] md:text-[32px] leading-[1.15] font-semibold max-w-[28ch]">
            Measurable, defensible improvements your examiner can verify.
          </h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((b) => (
              <div key={b.label} className="border border-white/10 rounded-xl p-5">
                <p className="text-[28px] md:text-[32px] font-semibold tracking-tight">{b.metric}</p>
                <p className="mt-1 text-[12.5px] text-white/60">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="border-t border-[var(--line)] py-12">
        <div className="container-site">
          <p className="tag mb-4 text-center">Aligned with</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {badges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center h-8 px-3 rounded-full border border-[var(--line)] text-[12.5px] text-ink-3"
              >
                <Check size={12} className="mr-1.5 text-ink" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--line)] py-16 md:py-20">
        <div className="container-site grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <p className="tag">FAQ</p>
            <h2 className="mt-3 text-[24px] md:text-[28px] leading-[1.2] font-semibold text-ink">
              Questions compliance teams ask before signing.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6 space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-[var(--line)] pb-6 last:border-0">
                <h3 className="text-[15.5px] font-semibold text-ink mb-2">{f.q}</h3>
                <p className="text-[14px] leading-[1.65] text-ink-3">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--line)] py-16 md:py-20 bg-[#FAFAF7]">
        <div className="container-site text-center">
          <h2 className="text-[26px] md:text-[34px] leading-[1.15] font-semibold text-ink max-w-[28ch] mx-auto">
            See it on your own returns calendar.
          </h2>
          <p className="mt-4 text-[15px] text-ink-3 max-w-[52ch] mx-auto">
            A 30-minute demo with our compliance engineers, walked through against your license category and CBS.
          </p>
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            <Link
              to="/book-demo"
              className="h-11 px-5 inline-flex items-center rounded-full bg-ink text-white text-[14px] font-medium hover:bg-[#262626] transition-colors"
            >
              Book a demo <ArrowRight size={15} className="ml-1.5" />
            </Link>
            <Link
              to="/product"
              className="h-11 px-5 inline-flex items-center rounded-full border border-[var(--line)] text-ink text-[14px] font-medium hover:bg-white transition-colors"
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
