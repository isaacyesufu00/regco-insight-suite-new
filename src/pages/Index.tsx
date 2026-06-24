import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SiteNavbar from "@/components/site/SiteNavbar";
import SiteFooter from "@/components/site/SiteFooter";
import boardroomAsset from "@/assets/hero-boardroom.png.asset.json";

const HERO_FONT = '"Inter Tight", -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';

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
  return (
    <div className="min-h-screen bg-white text-ink" style={{ fontFamily: HERO_FONT }}>
      <SiteNavbar />

      {/* Hero — Kota-style stacked cards on a tinted page */}
      <section
        className="relative w-full"
        style={{ background: "var(--hero-page)", padding: "48px 0 72px" }}
      >
        <div className="container-site">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: 24,
            }}
            className="hero-grid"
          >
            {/* LEFT — copy card with offset shadow card behind */}
            <div style={{ position: "relative" }}>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "translate(24px, 24px)",
                  background: "var(--hero-card-shadow)",
                  borderRadius: 28,
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: "relative",
                  background: "var(--hero-card)",
                  borderRadius: 28,
                  padding: "48px 48px 48px",
                  zIndex: 1,
                  minHeight: 560,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {/* Reviews chip */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#FFFFFF",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderRadius: 999,
                      padding: "5px 12px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                      marginBottom: 32,
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                       
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "0 4px" }}>
                      <span style={{ width: 16, height: 16, borderRadius: 4, background: "linear-gradient(135deg,#00C7FF,#0066FF)", display: "inline-block" }} />
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: "conic-gradient(#EA4335 0 25%,#FBBC05 25% 50%,#34A853 50% 75%,#4285F4 75% 100%)", display: "inline-block" }} />
                    </span>
                    <span style={{ display: "inline-flex", gap: 2 }}>
                      {[0,1,2,3,4].map((i) => (
                        <Star key={i} size={12} fill="#F5B100" stroke="#F5B100" />
                      ))}
                    </span>
                  </div>

                  <h1
                    style={{
                      fontFamily: HERO_FONT,
                      fontWeight: 700,
                      fontSize: "clamp(40px, 4.6vw, 64px)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.025em",
                      color: "var(--hero-ink)",
                      margin: 0,
                    }}
                  >
                    Automating regulatory<br />
                    compliance<br />
                    for the modern<br />
                    compliance desk.
                  </h1>

                  <p
                    style={{
                      marginTop: 28,
                      fontFamily: HERO_FONT,
                      fontSize: 17,
                      lineHeight: 1.55,
                      color: "var(--hero-sub)",
                      maxWidth: 440,
                    }}
                  >
                    RegCo connects to your core banking system, screens every customer, monitors every transaction, and files every CBN, NFIU, SCUML and NDIC return — from one audited workspace.
                  </p>
                </div>

                <div style={{ marginTop: 40 }}>
                  <Link
                    to="/book-demo"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--hero-ink)",
                      color: "#FFFFFF",
                      fontFamily: HERO_FONT,
                      fontSize: 15,
                      fontWeight: 500,
                      padding: "16px 28px",
                      borderRadius: 999,
                      textDecoration: "none",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Book a demo
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT — illustration card with offset shadow card behind */}
            <div style={{ position: "relative" }}>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "translate(24px, 24px)",
                  background: "var(--hero-illus-shadow)",
                  borderRadius: 28,
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: "relative",
                  background: "var(--hero-illus-card)",
                  borderRadius: 28,
                  overflow: "hidden",
                  zIndex: 1,
                  minHeight: 560,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={boardroomAsset.url}
                  alt="Compliance team reviewing reports at a boardroom table"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .hero-grid {
              grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) !important;
              gap: 28px !important;
            }
          }
        `}</style>
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
