import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import EditorialNavbar from "@/components/editorial/EditorialNavbar";
import EditorialFooter from "@/components/editorial/EditorialFooter";

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div className="font-mono text-3xl md:text-4xl text-ink tracking-tight">{value}</div>
    <div className="mt-2 text-[13px] text-ink-muted leading-snug">{label}</div>
  </div>
);

const Capability = ({ kicker, title, body }: { kicker: string; title: string; body: string }) => (
  <article className="py-8 border-t border-ink-10">
    <p className="tag mb-4">{kicker}</p>
    <h3 className="font-serif text-[28px] leading-[1.15] text-ink mb-3">{title}</h3>
    <p className="text-[15px] leading-relaxed text-ink-muted max-w-md">{body}</p>
  </article>
);

const CoverageItem = ({ code, name, count }: { code: string; name: string; count: string }) => (
  <div className="flex items-baseline justify-between py-4 border-t border-ink-10">
    <div>
      <div className="font-serif text-2xl text-ink">{code}</div>
      <div className="text-[13px] text-ink-muted mt-1">{name}</div>
    </div>
    <div className="font-mono text-[13px] text-ink-muted">{count}</div>
  </div>
);

export default function Index() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-ink">
      <EditorialNavbar />

      {/* ───────────────── Hero ───────────────── */}
      <section className="pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-8">
              <p className="tag mb-8">Regulatory infrastructure · Est. 2024</p>
              <h1 className="font-serif text-[44px] md:text-[72px] leading-[1.02] tracking-tight text-ink">
                Compliance reporting,<br />
                <span className="italic text-ink-muted">written by your data,</span><br />
                filed on time.
              </h1>
              <p className="mt-8 max-w-xl text-[17px] md:text-[18px] leading-relaxed text-ink-muted">
                RegCo turns your core banking exports into audit-ready CBN, NDIC, NFIU, SCUML and FIRS returns — automatically, accurately, and on the regulator's calendar.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/book-demo"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-[var(--paper)] text-[14.5px] font-medium hover:bg-[var(--rust)] transition-colors"
                >
                  Book a demo <ArrowUpRight size={16} />
                </Link>
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-ink-15 text-ink text-[14.5px] font-medium hover:bg-ink/[0.04] transition-colors"
                >
                  See the product <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 md:pl-8">
              <div className="border-l border-ink-10 pl-6">
                <p className="tag mb-3">In service of</p>
                <p className="font-serif italic text-[22px] leading-snug text-ink">
                  Nigerian banks, microfinance banks, fintechs and primary mortgage institutions.
                </p>
              </div>
            </div>
          </div>

          {/* Empty intentional whitespace where CBN/NFIU/SCUML strip was — per memory. */}
          <div aria-hidden className="h-24 md:h-32" />
        </div>
      </section>

      {/* ───────────── Product still life ───────────── */}
      <section className="pb-24 md:pb-32">
        <div className="container-editorial">
          <div className="aspect-[16/9] w-full bg-white border border-ink-10 rounded-md overflow-hidden relative">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-6">
              <div className="col-span-3 row-span-6 border-r border-ink-10 bg-[var(--paper)] p-6">
                <p className="font-serif text-lg">RegCo</p>
                <ul className="mt-8 space-y-3 text-[13px] text-ink-muted">
                  <li className="text-ink">Overview</li>
                  <li>Reports</li>
                  <li>Calendar</li>
                  <li>Monitoring</li>
                  <li>Customers</li>
                  <li>Agent</li>
                </ul>
              </div>
              <div className="col-span-9 row-span-6 p-8">
                <p className="tag">Wednesday · 19 June 2026</p>
                <h3 className="font-serif text-3xl mt-2">Good morning, Adaeze.</h3>
                <div className="mt-8 grid grid-cols-3 gap-6">
                  <div className="border border-ink-10 rounded-md p-5 bg-[var(--paper)]">
                    <p className="tag text-[10px]">Compliance score</p>
                    <p className="font-serif text-5xl mt-2">94</p>
                    <p className="font-mono text-[11px] text-[var(--rust)] mt-1">+3 wk</p>
                  </div>
                  <div className="border border-ink-10 rounded-md p-5 bg-[var(--paper)]">
                    <p className="tag text-[10px]">Due this week</p>
                    <p className="font-serif text-5xl mt-2">4</p>
                    <p className="font-mono text-[11px] text-ink-muted mt-1">returns</p>
                  </div>
                  <div className="border border-ink-10 rounded-md p-5 bg-[var(--paper)]">
                    <p className="tag text-[10px]">Filed YTD</p>
                    <p className="font-serif text-5xl mt-2">47</p>
                    <p className="font-mono text-[11px] text-ink-muted mt-1">on time</p>
                  </div>
                </div>
                <div className="mt-8 border-t border-ink-10">
                  {["CBN MFB Quarterly Return", "NDIC Premium Assessment", "NFIU CTR — June", "SCUML Compliance Filing"].map((r, i) => (
                    <div key={r} className="flex items-center justify-between py-3 border-b border-ink-10 text-[13px]">
                      <span>{r}</span>
                      <span className="font-mono text-[11px] text-ink-muted">DUE {28 - i * 2} JUN</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="font-serif italic text-center text-ink-muted mt-4 text-[14px]">
            Your compliance desk, rebuilt from the ground up.
          </p>
        </div>
      </section>

      {/* ───────────────── Capabilities ───────────────── */}
      <section className="pb-24 md:pb-32">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            <h2 className="md:col-span-5 font-serif text-4xl md:text-5xl leading-[1.05]">
              Everything a compliance desk does — without the spreadsheets.
            </h2>
            <p className="md:col-span-6 md:col-start-7 text-[15.5px] text-ink-muted leading-relaxed self-end">
              We rebuilt regulatory reporting around the way regulators actually consume it: structured, validated, formatted, and filed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-10">
            <Capability
              kicker="01 · Connect"
              title="Pulls from any core banking system."
              body="Excel, CSV, T24, Finacle, Flexcube, Bankone — our universal parser reads them all and maps to CBN-compliant schema."
            />
            <Capability
              kicker="02 · Generate"
              title="Renders the exact return format."
              body="CBN, NDIC, NFIU, SCUML, FIRS returns — auto-built with the validations regulators run before they accept a submission."
            />
            <Capability
              kicker="03 · File"
              title="Tracks the regulator's calendar."
              body="Deadline alerts, board-pack exports, and an audit trail for every submission. Never miss a quarter again."
            />
          </div>
        </div>
      </section>

      {/* ───────────────── Stats band ───────────────── */}
      <section className="py-20 md:py-24 border-y border-ink-10 bg-[var(--paper-2)]/40">
        <div className="container-editorial grid grid-cols-2 md:grid-cols-4 gap-10">
          <Stat value="₦2.4B+" label="Regulatory penalties avoided across our client base in 2025." />
          <Stat value="14" label="Return formats generated automatically across CBN, NDIC, NFIU, SCUML, FIRS." />
          <Stat value="6 hrs" label="Median time saved per return versus manual preparation." />
          <Stat value="99.4%" label="On-time submission rate across all active institutions." />
        </div>
      </section>

      {/* ───────────────── Coverage ───────────────── */}
      <section className="py-24 md:py-32">
        <div className="container-editorial grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <p className="tag mb-6">Regulatory coverage</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05]">
              Every return your institution owes,<br />
              <span className="italic text-ink-muted">in one place.</span>
            </h2>
            <p className="mt-6 text-[15.5px] text-ink-muted max-w-md leading-relaxed">
              From quarterly MFB returns to single-obligor disclosures, RegCo maintains the canonical templates so you never chase a circular again.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <CoverageItem code="CBN" name="Central Bank of Nigeria — Returns & circulars" count="6 forms" />
            <CoverageItem code="NDIC" name="Premium assessments · Single-obligor" count="2 forms" />
            <CoverageItem code="NFIU" name="CTR, STR, CBR — Financial intelligence" count="3 forms" />
            <CoverageItem code="SCUML" name="Designated non-financial businesses" count="1 form" />
            <CoverageItem code="FIRS" name="CIT · VAT · PAYE · WHT" count="4 forms" />
            <div className="border-t border-ink-10" />
          </div>
        </div>
      </section>

      {/* ───────────────── Quote ───────────────── */}
      <section className="py-24 md:py-32 border-t border-ink-10">
        <div className="container-narrow text-center">
          <p className="font-serif text-[28px] md:text-[34px] leading-[1.25] text-ink">
            "We replaced four spreadsheets, two consultants and a permanent dread of the 20th of every month — with RegCo."
          </p>
          <p className="mt-8 text-[13px] tracking-[0.18em] uppercase text-ink-muted">
            Head of Compliance · Tier-2 Microfinance Bank
          </p>
        </div>
      </section>

      {/* ───────────────── CTA band ───────────────── */}
      <section className="bg-ink text-[var(--paper)]">
        <div className="container-editorial py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] text-[var(--paper)]">
              Begin your next reporting cycle with RegCo.
            </h2>
          </div>
          <div className="md:col-span-5 md:pl-12">
            <p className="text-[15.5px] leading-relaxed text-[var(--paper)]/70">
              A twenty-minute walkthrough is enough to see exactly how your CBS data becomes a filed return.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/book-demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--rust)] text-white text-[14.5px] font-medium hover:bg-[var(--rust-dark)] transition-colors"
              >
                Book a demo <ArrowUpRight size={16} />
              </Link>
              <Link
                to="/sign-in"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-[var(--paper)] text-[14.5px] font-medium hover:bg-white/[0.06] transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EditorialFooter />
    </div>
  );
}
