import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { ArrowUpRight, ArrowRight, Star, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SiteFooter from "@/components/site/SiteFooter";
import boardroom from "@/assets/hero-boardroom.png";

const HERO_FONT = '"Inter Tight", -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';

const HELVETICA = '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';

// App Store + Google brand marks (small inline SVGs)
const AppStoreMark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
    <defs>
      <linearGradient id="asg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1AC8FF" />
        <stop offset="1" stopColor="#0A6CFF" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="5" fill="url(#asg)" />
    <path d="M8.2 16.4l.9-1.55h1.78l-.88 1.55c-.34.59-1.1.79-1.69.45-.58-.34-.79-1.1-.45-1.69zM15.6 14.85h-5.4l-.9-1.55h7.2c.68 0 1.23.55 1.23 1.23 0 .67-.55 1.23-1.23 1.23h-.45l-.45-.91zm-2.3-7.6l.8-1.39c.34-.58 1.1-.79 1.68-.45.59.34.79 1.1.45 1.69l-3.74 6.48h2.7l.9 1.55H8.85L13.3 7.25z" fill="#fff"/>
  </svg>
);
const GoogleMark = () => (
  <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.9 6.1 29.2 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.9 6.1 29.2 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.4-.4-3.5z"/>
  </svg>
);

function HeroPillNav() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "sticky", top: 16, zIndex: 50, padding: "0 24px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "#EAF1F7",
          borderRadius: 999,
          padding: "10px 14px 10px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 14px rgba(20,40,80,0.08)",
          fontFamily: HERO_FONT,
        }}
      >
        <Link to="/" style={{ fontSize: 17, fontWeight: 700, color: "#0A0A0A", textDecoration: "none", letterSpacing: "-0.02em" }}>
          RegCo
        </Link>
        <nav style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
          <button onClick={() => setOpen(o => !o)} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 14, color: "#0A0A0A", background: "none", border: "none", cursor: "pointer", fontFamily: HERO_FONT }}>
            Products <ChevronDown size={13} />
          </button>
          {[["Who we serve","/who-we-serve"],["Pricing","/pricing"],["About","/about"]].map(([l,h]) => (
            <NavLink key={h} to={h} style={{ fontSize: 14, color: "#0A0A0A", textDecoration: "none" }}>{l}</NavLink>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/sign-in" style={{ fontSize: 14, color: "#0A0A0A", textDecoration: "none", padding: "0 8px" }}>Sign in</Link>
          <Link to="/book-demo" style={{ background: "#0A0A0A", color: "#FFFFFF", fontSize: 14, fontWeight: 500, padding: "10px 18px", borderRadius: 999, textDecoration: "none" }}>
            Book a demo
          </Link>
        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen text-ink" style={{ fontFamily: HERO_FONT, background: "var(--hero-page)" }}>
      {/* Hero — Kota-style stacked cards on a tinted page */}
      <section
        className="relative w-full"
        style={{ background: "var(--hero-page)", padding: "24px 0 72px" }}
      >
        <HeroPillNav />
        <div className="container-site" style={{ marginTop: 28 }}>
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
                  transform: "translate(12px, -12px)",
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
                  padding: "48px",
                  zIndex: 1,
                  minHeight: 620,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Reviews chip */}
                <div
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
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
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <AppStoreMark />
                    <GoogleMark />
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
                    fontSize: "clamp(36px, 3.4vw, 52px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.025em",
                    color: "var(--hero-ink)",
                    margin: 0,
                    maxWidth: 460,
                  }}
                >
                  Automating regulatory compliance for the modern compliance desk.
                </h1>

                <p
                  style={{
                    marginTop: 24,
                    fontFamily: HERO_FONT,
                    fontSize: 16,
                    lineHeight: 1.55,
                    color: "var(--hero-sub)",
                    maxWidth: 440,
                  }}
                >
                  RegCo connects to your core banking system, screens every customer, monitors every transaction, and files every CBN, NFIU, SCUML and NDIC return — from one audited workspace.
                </p>

                <div style={{ marginTop: 32 }}>
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
                  transform: "translate(12px, -12px)",
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
                  minHeight: 620,
                  display: "flex",
                }}
              >
                <img
                  src={boardroom}
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
              grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
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
