import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SiteNavbar from "@/components/site/SiteNavbar";
import SiteFooter from "@/components/site/SiteFooter";

const HELVETICA = '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';

const products = [
  {
    n: "01",
    name: "Automated Returns",
    desc:
      "Generate, validate, and file every CBN and NFIU return your institution owes. Schemas, arithmetic, and deadlines handled end-to-end — your team approves, RegCo files.",
    href: "/product/automated-returns",
  },
  {
    n: "02",
    name: "Live Client Screening",
    desc:
      "BVN, NIN, sanctions (UN, OFAC, EU, HMT, CBN), PEP and adverse media — checked in real time at onboarding and continuously thereafter. One verdict per customer, with the audit trail attached.",
    href: "/product/live-screening",
  },
  {
    n: "03",
    name: "Transaction Monitoring",
    desc:
      "Near-real-time detection across structuring, velocity, dormancy, narration mismatches, and counter-party risk. Fraud and AML cases flow straight into your case queue.",
    href: "/product/transaction-monitoring",
  },
  {
    n: "04",
    name: "Audit Trail & Case Mgmt",
    desc:
      "A single chain of custody for every decision: alert raised, analyst assigned, evidence attached, outcome recorded. Export an examiner-ready packet in one click.",
    href: "/product/audit-trail",
  },
];

const steps = [
  {
    n: "Connect",
    body:
      "Plug into your core banking system — T24, Finacle, Flexcube, Bankone — or upload directly. RegCo maps your data to the schema each regulator expects.",
  },
  {
    n: "Operate",
    body:
      "Returns generate on schedule. Customers are screened on every interaction. Transactions flow through detection rules tuned to your license category.",
  },
  {
    n: "File",
    body:
      "Approve, file, and archive — with a complete audit trail. Every action attributable, every artefact retrievable.",
  },
];

const stats = [
  { v: "₦2.4B+", l: "Regulatory penalties avoided across our client base in 2025." },
  { v: "17",     l: "Mandatory returns covered across CBN, NDIC, NFIU, SCUML, FIRS, PENCOM." },
  { v: "<100ms", l: "Median transaction-screening latency at the production tier." },
  { v: "99.4%",  l: "On-time submission rate across all active institutions." },
];

export default function Index() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    navigate(v ? `/book-demo?email=${encodeURIComponent(v)}` : "/book-demo");
  };

  return (
    <div className="min-h-screen bg-white text-ink" style={{ fontFamily: HELVETICA }}>
      <SiteNavbar />

      {/* Hero — compact text column, room for image on the right */}
      <section
        className="relative w-full"
        style={{ minHeight: "100vh", background: "#FFFFFF" }}
      >
        <div className="container-site relative" style={{ minHeight: "100vh" }}>
          <div
            className="absolute left-0 right-0"
            style={{ bottom: "12vh" }}
          >
            <div style={{ maxWidth: 520 }}>
              <h1
                className="text-ink"
                style={{
                  fontFamily: HELVETICA,
                  fontWeight: 600,
                  fontSize: "clamp(34px, 3.6vw, 46px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                Automating regulatory<br />
                compliance for regulated banks.
              </h1>
              <p
                className="mt-5 text-ink-3"
                style={{ fontFamily: HELVETICA, fontSize: 14, lineHeight: 1.55, maxWidth: 480 }}
              >
                Connect your CBS, screen customers live, monitor transactions in real time, and file CBN, NFIU, SCUML and NDIC returns from one audited workspace.
              </p>

              <form
                onSubmit={submitEmail}
                className="mt-6 flex items-center"
                style={{
                  maxWidth: 480,
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 999,
                  padding: "4px 4px 4px 18px",
                  boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontFamily: HELVETICA,
                    fontSize: 14,
                    color: "#1A1A1A",
                    padding: "10px 0",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    flexShrink: 0,
                    background: "#0A0A0A",
                    color: "#FFFFFF",
                    fontFamily: HELVETICA,
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Request access
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>


      {/* Trust strip — text only */}
      <section className="border-y border-[var(--line)]">
        <div className="container-site py-6 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-8">
          <p className="text-[12px] uppercase tracking-[0.18em] text-ink-3 font-mono">
            Trusted by regulated financial institutions
          </p>
          <p className="text-[13px] text-ink-3">
            Microfinance Banks · Primary Mortgage Banks · Finance Companies · Commercial Banks · Fintechs
          </p>
        </div>
      </section>

      {/* Four products */}
      <section className="section-pad">
        <div className="container-site">
          <div className="max-w-[60ch] mb-12">
            <p className="tag mb-3">Four products. One system.</p>
            <h2 className="text-h2 text-ink">
              Everything the compliance desk does — under one license.
            </h2>
          </div>


          <div>
            {products.map((p) => (
              <Link
                key={p.n}
                to={p.href}
                className="group grid grid-cols-12 gap-6 md:gap-10 py-10 border-t border-[var(--line)] last:border-b"
              >
                <div className="col-span-12 md:col-span-2">
                  <span className="font-mono text-[13px] text-ink-3">{p.n}</span>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <h3 className="text-h3 text-ink">{p.name}</h3>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p className="text-[15px] leading-[1.6] text-ink-3">{p.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] text-ink group-hover:underline underline-offset-4">
                    Learn more <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-pad bg-[#FAFAFA]">
        <div className="container-site">
          <div className="max-w-[60ch] mb-10">
            <p className="tag mb-3">How RegCo works</p>
            <h2 className="text-h2 text-ink">Three steps. One system of record.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((s, i) => (
              <div key={s.n} className="border-t border-[var(--line)] pt-5">
                <p className="font-mono text-[12px] text-ink-3">0{i + 1}</p>
                <h3 className="mt-2 text-[20px] font-semibold text-ink tracking-tight">{s.n}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-3">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="section-pad">
        <div className="container-site grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {stats.map((s) => (
            <div key={s.v} className="border-t border-[var(--line)] pt-5">
              <div className="text-kpi text-ink">{s.v}</div>
              <p className="mt-3 text-[13px] leading-[1.5] text-ink-3">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-white">
        <div className="container-site py-20 md:py-28 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <h2 className="text-h2 text-white max-w-[18ch]">
              Begin your next reporting cycle with RegCo.
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-[14.5px] leading-[1.6] text-white/70">
              Twenty minutes is enough to see exactly how your CBS data becomes a filed return, a screened customer, and a closed case.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/book-demo"
                className="h-10 px-5 inline-flex items-center gap-2 rounded-full bg-white text-ink text-[14px] font-medium hover:bg-white/90 transition-colors"
              >
                Book a demo <ArrowUpRight size={15} />
              </Link>
              <Link
                to="/sign-in"
                className="h-10 px-5 inline-flex items-center gap-2 rounded-full border border-white/25 text-white text-[14px] font-medium hover:bg-white/10 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad border-t border-[var(--line)]">
        <div className="container-site grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <p className="tag mb-3">Questions</p>
            <h2 className="text-h2 text-ink">Frequently asked.</h2>
            <p className="mt-5 text-[14.5px] leading-[1.6] text-ink-3 max-w-[36ch]">
              Straight answers on coverage, integration, security, and what it takes to go live.
            </p>
          </div>
          <div className="md:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "Which core banking systems does RegCo connect to?",
                  a: "We integrate with T24, Finacle, Flexcube, Bankone, and Kachasi via direct read-only connectors. Institutions on bespoke or legacy cores can map through scheduled file drops — CSV, XML, or fixed-width — without changes to the core itself.",
                },
                {
                  q: "Which regulators and returns are covered?",
                  a: "CBN (daily, monthly, quarterly prudential and AML returns), NDIC (deposit and single-obligor), NFIU (CTR, STR, currency declarations), SCUML, FIRS (CIT, VAT, WHT, PAYE), and PENCOM. Seventeen mandatory schedules in total at the current release.",
                },
                {
                  q: "Where is our data stored and how is it secured?",
                  a: "Data is held in encrypted tenant-isolated stores hosted in-region. Row-level security enforces strict per-institution access, and every read or write is recorded in an immutable audit log. Independent penetration tests are conducted annually.",
                },
                {
                  q: "How long does deployment take?",
                  a: "A standard institution is live in two to four weeks: one week for connector configuration, one for schema mapping and a parallel-run reporting cycle, and the remainder for officer onboarding and sign-off.",
                },
                {
                  q: "How is RegCo priced?",
                  a: "An annual platform fee scoped to license category and transaction volume, plus optional modules for transaction monitoring and case management. Pricing is discussed under NDA during the demo.",
                },
                {
                  q: "What support do clients receive?",
                  a: "Every institution is assigned a named compliance engineer and a one-business-hour response SLA on filing-blocking issues. Regulatory schema changes are absorbed by RegCo without billable change requests.",
                },
              ].map((item, i) => {
                const n = String(i + 1).padStart(2, "0");
                return (
                  <AccordionItem
                    key={n}
                    value={`q-${n}`}
                    className="border-t border-[var(--line)] last:border-b"
                  >
                    <AccordionTrigger className="py-6 hover:no-underline group">
                      <div className="flex items-start gap-6 text-left flex-1">
                        <span className="font-mono text-[12px] text-ink-3 pt-1">{n}</span>
                        <span className="text-[17px] leading-[1.4] text-ink font-medium tracking-tight">
                          {item.q}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pl-[calc(0.75rem+1.5rem+0.5rem)]">
                      <p className="text-[14.5px] leading-[1.65] text-ink-3 max-w-[62ch]">
                        {item.a}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
