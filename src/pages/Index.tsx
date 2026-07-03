import { Link } from "react-router-dom";
import { useState, CSSProperties, ReactNode } from "react";
import {
  ChevronDown, ArrowRight, Play, PieChart, Search, Clock, GitBranch,
  Building2, Network, CreditCard, FileText, Landmark, Plus, ShieldCheck,
} from "lucide-react";
import heroDark from "@/assets/regco-hero-dark.jpg";
import dashMock from "@/assets/regco-dashboard-mock.jpg";
import manualWay from "@/assets/regco-manual-way.jpg";

/* Tokens */
const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
const SANS = "system-ui, sans-serif";
const MAXW = 1368;

/* Shared bits */
function ArrowChip({ dark = false, size = 24 }: { dark?: boolean; size?: number }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: 4,
      background: dark ? "#171514" : "#FFFFFF",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <ArrowRight size={14} strokeWidth={3} color={dark ? "#FFFFFF" : "#333333"} />
    </span>
  );
}

/* 1 — Announcement bar */
function AnnouncementBar() {
  return (
    <div style={{
      maxHeight: 64, overflow: "hidden", background: "#000000",
      padding: "12px 16px", display: "flex", alignItems: "center",
      justifyContent: "center", gap: 8, flexWrap: "wrap",
    }}>
      <span style={{ position: "relative", width: 8, height: 8, display: "inline-block", marginRight: 4 }}>
        <span style={{ position: "absolute", inset: -3, width: 14, height: 14, borderRadius: "50%", background: "#016630", opacity: 0.011 }} />
        <span style={{ position: "absolute", inset: -2, width: 12, height: 12, borderRadius: "50%", background: "#016630", opacity: 0.30 }} />
        <span style={{ position: "absolute", inset: 0, width: 8, height: 8, borderRadius: "50%", background: "oklch(62.7% 0.194 149.2)" }} />
      </span>
      <span style={{ color: "#FFFFFF", fontFamily: SANS, fontSize: 14, fontWeight: 700, letterSpacing: "0.14px", lineHeight: "20px" }}>
        RegCo is building compliance infrastructure for regulated institutions.
      </span>
      <Link to="/about-us" style={{ color: "#FFFFFF", fontFamily: SANS, fontSize: 14, letterSpacing: "0.14px", lineHeight: "20px", textDecoration: "underline" }}>Read our story</Link>
      <Link to="/book-demo" style={{ color: "#FFFFFF", fontFamily: SANS, fontSize: 14, letterSpacing: "0.14px", lineHeight: "20px", textDecoration: "underline" }}>Book a demo</Link>
    </div>
  );
}

/* 2 — Sticky Nav */
function StickyNav() {
  const items = ["Product", "Who We Serve", "Platform", "Company", "Resources"];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
      background: "rgba(21,21,21,0.01)",
      boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.1)",
      padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ maxWidth: MAXW, flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ color: "#FFFFFF", fontFamily: SANS, fontSize: 24, fontWeight: 800, letterSpacing: "0.02em", textDecoration: "none", height: 34, display: "inline-flex", alignItems: "center" }}>REGCO</Link>
        <nav style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          {items.map((l) => (
            <div key={l} className="regco-nav-item" style={{
              borderRadius: 8, padding: "8px 12px",
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
            }}>
              <span style={{ color: "#FFFFFF", fontFamily: SANS, fontSize: 16, textAlign: "center" }}>{l}</span>
              <span className="regco-nav-chev" style={{ position: "relative", top: 1, display: "inline-flex", transition: "transform 200ms ease" }}>
                <ChevronDown size={16} strokeWidth={2} color="#FFFFFF" />
              </span>
            </div>
          ))}
        </nav>
        <Link to="/book-demo" className="regco-cta-white" style={{
          background: "#FFFFFF", borderRadius: 6, padding: "8px 20px",
          color: "#000000", fontFamily: SANS, fontSize: 16, fontWeight: 500,
          letterSpacing: "0.16px", lineHeight: "24px", textDecoration: "none",
          transition: "background 150ms ease",
        }}>Book a Demo</Link>
      </div>
    </header>
  );
}

/* 3 — Hero */
function Hero() {
  const stats = [
    { big: "5 Watchlists", small: "UN, OFAC, EU, UK HM Treasury, and CBN checked on every transaction" },
    { big: "6 CBN Rules", small: "Structuring, velocity, and split-deposit detection built into every account" },
    { big: "17 Return Types", small: "CBN, NFIU, SCUML, NDIC, FIRS, and PENCOM filings automated" },
    { big: "100% Logged", small: "Every decision timestamped and audit-ready, nothing editable after the fact" },
  ];
  return (
    <section style={{ minHeight: 814, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <img src={heroDark} alt="" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "50%", opacity: 0.95, zIndex: 0,
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 750,
        backgroundImage: `radial-gradient(ellipse 94.92% 193.97% at 10.55% 42.49%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 69%, rgba(0,0,0,1) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)`,
        zIndex: 1,
      }} />
      <div style={{
        position: "relative", zIndex: 2, maxWidth: MAXW, margin: "0 auto",
        padding: "80px 32px 48px", display: "flex", flexDirection: "column",
        justifyContent: "space-between", flex: 1, width: "100%",
      }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 32, justifyContent: "center" }}>
          <div style={{
            marginTop: 64, width: "fit-content", background: "#454443",
            borderRadius: 9999, padding: "6px 20px",
            color: "#FFFFFF", fontFamily: SANS, fontSize: 16,
            letterSpacing: "0.16px", lineHeight: "24px",
          }}>For CBN-regulated financial institutions</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h1 style={{
              margin: 0, whiteSpace: "pre-wrap", color: "#BBB3A0",
              fontFamily: SERIF, fontSize: 84, letterSpacing: "-1.68px", lineHeight: "96px",
            }}>{"The Compliance Platform\n\nfor Regulated Institutions"}</h1>
            <p style={{ margin: 0, color: "#FFFFFF", fontFamily: SANS, fontSize: 20, lineHeight: "28px" }}>
              A modern approach to regulatory compliance
            </p>
          </div>

          <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 24 }}>
            <form onSubmit={(e) => e.preventDefault()} style={{
              background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.05)",
              borderRadius: 6, display: "flex",
            }}>
              <input
                type="text"
                placeholder="Enter your institution's website"
                style={{
                  flex: 1, padding: "12px 8px 12px 20px", borderRadius: 6,
                  color: "#74716B", fontFamily: SANS, fontSize: 16,
                  border: "none", outline: "none", background: "transparent",
                }}
              />
              <button type="submit" style={{
                margin: 4, padding: "8px 20px", background: "#171514",
                borderRadius: 6, border: "none", color: "#FFFFFF",
                fontFamily: SANS, fontSize: 16, fontWeight: 500,
                letterSpacing: "0.16px", lineHeight: "24px", cursor: "pointer",
              }}>Get Started</button>
            </form>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
              <span style={{ color: "#FFFFFF", fontFamily: SANS, fontSize: 14, letterSpacing: "0.14px", lineHeight: "20px" }}>
                Looking to integrate RegCo with your CBS? Talk to our team
              </span>
              <Link to="/book-demo"><ArrowChip /></Link>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
          {stats.map((s) => (
            <div key={s.big} style={{
              boxShadow: "inset 2px 0 0 rgba(255,255,255,0.2)",
              paddingLeft: 40, display: "flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{ color: "#FFFFFF", fontFamily: SERIF, fontSize: 24, lineHeight: "32px" }}>{s.big}</div>
              <div style={{ color: "#FFFFFF", fontFamily: SANS, fontSize: 16, letterSpacing: "0.16px", lineHeight: "24px" }}>{s.small}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4 — Built for */
function BuiltFor() {
  const marks = ["CBN", "NFIU", "SCUML", "NDIC", "FIRS", "PENCOM"];
  return (
    <section style={{ maxWidth: MAXW, margin: "0 auto", overflow: "hidden", padding: 40, display: "flex", gap: 144, justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ color: "#333333", fontFamily: SERIF, fontSize: 24, lineHeight: "32px", minWidth: "fit-content", alignSelf: "center" }}>Built for</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 48, justifyContent: "flex-end", flexWrap: "wrap" }}>
        {marks.map((m) => (
          <span key={m} style={{
            fontFamily: SERIF, fontSize: 28, color: "#333333",
            filter: "grayscale(100%)", flexShrink: 0, letterSpacing: "0.02em",
          }}>{m}</span>
        ))}
      </div>
    </section>
  );
}

/* 5 — Manual review */
function ManualReview() {
  return (
    <section style={{ background: "#FCFBFA", padding: "80px 40px 128px" }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "0 80px", display: "flex", flexDirection: "column", gap: 64 }}>
        <h2 style={{
          margin: 0, color: "#333333", fontFamily: SERIF, fontSize: 56,
          letterSpacing: "-0.56px", lineHeight: "64px", textAlign: "center",
          whiteSpace: "pre-wrap",
        }}>{"Manual review costs time.\n\nRegCo gives it back."}</h2>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {[
            { title: "The Manual Way", src: manualWay },
            { title: "The RegCo Way", src: dashMock },
          ].map((c) => (
            <div key={c.title} style={{
              background: "#F4F1EE", borderRadius: 8, flex: 1,
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 16, paddingTop: 40, overflow: "hidden",
            }}>
              <div style={{ color: "#333333", fontFamily: SERIF, fontSize: 32, lineHeight: "40px" }}>{c.title}</div>
              <img src={c.src} alt={c.title} loading="lazy" style={{ width: "100%", aspectRatio: "1332 / 1080", objectFit: "cover", display: "block" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6 — Modern Approach */
function ModernApproach() {
  const stats = [
    { t: "Automated Filing", d: "CBN and NFIU returns generated directly from your transaction data" },
    { t: "AI-Assisted Review", d: "Copilot surfaces patterns and drafts filing narratives for officer review" },
    { t: "Real-Time Screening", d: "Every customer and transaction checked against five sanctions lists" },
    { t: "Audit-Ready Records", d: "A complete documentation trail for every decision, ready for examination" },
  ];
  return (
    <section style={{ background: "#F7F5F2", padding: "80px 40px 128px" }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "0 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{
          margin: 0, color: "#333333", fontFamily: SERIF, fontSize: 56,
          letterSpacing: "-0.56px", lineHeight: "64px", textAlign: "center",
          whiteSpace: "pre-wrap",
        }}>{"The Modern Approach to\n\nRegulatory Compliance"}</h2>

        <Link to="/book-demo" style={{
          marginTop: 32, display: "inline-flex", alignItems: "center", gap: 8,
          color: "#171514", fontFamily: SANS, fontSize: 16, fontWeight: 500,
          letterSpacing: "0.16px", lineHeight: "24px", textDecoration: "none",
        }}>
          See RegCo in Action <ArrowChip dark />
        </Link>

        <div style={{ marginTop: 24, marginBottom: 24, width: "100%", aspectRatio: "2756 / 1080", position: "relative", borderRadius: 8, overflow: "hidden" }}>
          <img src={dashMock} alt="RegCo dashboard" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{
            position: "absolute", bottom: "calc(0px + 32px)", left: 16,
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(84,79,66,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1.5px solid #544F42", transform: "rotate(-90deg)",
          }}>
            <Play size={20} color="#544F42" strokeWidth={3} style={{ transform: "rotate(90deg)" }} fill="#544F42" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40, width: "100%" }}>
          {stats.map((s) => (
            <div key={s.t} style={{ boxShadow: "inset 1px 0 0 #EBE5DF", paddingLeft: 40, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ color: "#000000", fontFamily: SERIF, fontSize: 24, lineHeight: "32px" }}>{s.t}</div>
              <div style={{ color: "#333333", fontFamily: SANS, fontSize: 16, letterSpacing: "0.16px", lineHeight: "24px" }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 7 — Advantage accordion */
function Advantage() {
  const items = [
    { icon: PieChart, title: "Understand your compliance gap",
      body: "Our compliance advisors walk you through exactly where your institution stands against the CBN's baseline standards, backed by a real gap assessment." },
    { icon: Search, title: "Identify high-risk activity" },
    { icon: Clock, title: "Onboard in minutes" },
    { icon: GitBranch, title: "Track case progress" },
  ];
  const [open, setOpen] = useState<number>(0);
  return (
    <section style={{ background: "#222222", padding: "128px 40px" }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "0 48px", display: "flex", flexDirection: "column", gap: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 40px" }}>
          <h2 style={{ margin: 0, color: "#FFFFFF", fontFamily: SERIF, fontSize: 56, letterSpacing: "-0.56px", lineHeight: "64px" }}>The RegCo Advantage</h2>
          <p style={{ margin: 0, color: "#F1F1F1", fontFamily: SANS, fontSize: 18, lineHeight: "26px" }}>
            A connected system that supports your compliance team at every stage.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ width: "100%", flex: 1 }}>
            <img src={dashMock} alt="" loading="lazy" style={{ width: "100%", aspectRatio: "846 / 535", objectFit: "cover", borderRadius: 8, display: "block" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "75%" }}>
            {items.map((it, i) => {
              const Icon = it.icon;
              const isOpen = open === i;
              return (
                <div key={it.title}
                  onClick={() => setOpen(i)}
                  style={{
                    borderBottom: "1px solid #000000",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                    paddingBottom: 24, opacity: isOpen ? 1 : 0.5, cursor: "pointer",
                    transition: "opacity 200ms ease",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon size={24} strokeWidth={2} color="#F1F1F1" />
                      <span style={{ color: "#FFFFFF", fontFamily: SERIF, fontSize: 24, fontWeight: 500, lineHeight: "32px" }}>{it.title}</span>
                    </div>
                    <ChevronDown size={16} color="#FFFFFF" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 300ms ease" }} />
                  </div>
                  {isOpen && it.body && (
                    <div style={{ marginTop: 12, paddingBottom: 16 }}>
                      <p style={{ margin: 0, color: "#FFFFFF", fontFamily: SANS, fontSize: 18, lineHeight: "26px" }}>{it.body}</p>
                      <Link to="/book-demo" style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, color: "#FFFFFF", fontFamily: SANS, fontSize: 16, fontWeight: 500, textDecoration: "none" }}>
                        Get Started <ArrowChip />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 8 — Testimonials */
function Testimonials() {
  const cards = [1, 2, 3];
  return (
    <section style={{ background: "#FCFBFA", padding: "128px 40px" }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "0 48px", display: "flex", flexDirection: "column", gap: 64 }}>
        <h2 style={{
          margin: 0, color: "#928D80", fontFamily: SERIF, fontSize: 56,
          letterSpacing: "-0.56px", lineHeight: "64px", textAlign: "center",
          whiteSpace: "pre-wrap",
        }}>{"What Compliance Teams\n\nHave to Say About RegCo"}</h2>
        <div style={{ display: "flex", gap: 16, justifyContent: "space-between" }}>
          {cards.map((n) => (
            <div key={n} style={{
              background: "#FCFBFA", border: "2px solid #EBE5DF", borderRadius: 10,
              flex: 1, display: "flex", flexDirection: "column", gap: 40,
              justifyContent: "space-between", padding: 40,
            }}>
              <p style={{ margin: 0, color: "#333333", fontFamily: SERIF, fontSize: 24, lineHeight: "32px" }}>
                [Client quote pending approval — Institution Name]
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#D9D4CC" }} />
                <div style={{ color: "rgba(0,0,0,0.6)", fontFamily: SANS, fontSize: 20, lineHeight: "28px" }}>
                  [Compliance Officer, Institution]
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 9 — Who We Serve */
function WhoWeServe() {
  const cardBase: CSSProperties = {
    background: "#F4F1EE", borderRadius: 12, display: "flex",
    flexDirection: "column", gap: 40, maxHeight: 248, padding: 40,
  };
  const iconBox: CSSProperties = {
    width: 40, height: 40, background: "#254763", borderRadius: 8,
    padding: 8, display: "inline-flex", alignItems: "center", justifyContent: "center",
  };
  const iconProps = { size: 24, color: "#FFFFFF", strokeWidth: 1.5 } as const;
  const cards: { icon: ReactNode; title: string; desc: string; order: number }[] = [
    { icon: <Landmark {...iconProps} />, title: "Unit MFBs", desc: "Single-location microfinance banks operating under CBN unit license", order: 1 },
    { icon: <Network {...iconProps} />, title: "State & National MFBs", desc: "Multi-branch microfinance operations across one or more states", order: 3 },
    { icon: <CreditCard {...iconProps} />, title: "Payment Service Banks", desc: "PSB-licensed institutions handling deposit and transfer services", order: 4 },
    { icon: <FileText {...iconProps} />, title: "Finance Companies", desc: "CBN-licensed finance companies and mortgage institutions", order: 5 },
    { icon: <Building2 {...iconProps} />, title: "Commercial Banks", desc: "Deposit money banks with multi-branch compliance obligations", order: 6 },
  ];
  return (
    <section style={{ background: "#FCFBFA", padding: "128px 40px" }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "0 48px", display: "flex", flexDirection: "column", gap: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ margin: 0, color: "#000000", fontFamily: SERIF, fontSize: 56, letterSpacing: "-0.56px", lineHeight: "64px", textAlign: "center" }}>Who We Serve</h2>
          <p style={{ margin: 0, color: "rgba(0,0,0,0.6)", fontFamily: SANS, fontSize: 18, lineHeight: "26px", textAlign: "center" }}>
            Built for the specific regulatory obligations of CBN-licensed institutions.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {cards.map((c) => (
            <div key={c.title} style={{ ...cardBase, order: c.order }}>
              <span style={iconBox}>{c.icon}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ color: "#333333", fontFamily: SERIF, fontSize: 24, lineHeight: "32px" }}>{c.title}</div>
                <div style={{ color: "rgba(0,0,0,0.6)", fontFamily: SANS, fontSize: 16, letterSpacing: "0.16px", lineHeight: "24px" }}>{c.desc}</div>
              </div>
            </div>
          ))}
          {/* Special CTA card - order 2 */}
          <div style={{
            order: 2, background: "#30302F", borderRadius: 10,
            display: "flex", flexDirection: "column", gap: 32,
            alignItems: "center", justifyContent: "center", padding: 24,
            position: "relative", maxHeight: 248,
            backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 8px)",
          }}>
            <div style={{ color: "#FFFFFF", fontFamily: SANS, fontSize: 40, fontWeight: 800, letterSpacing: "0.02em", width: 128, textAlign: "center" }}>REGCO</div>
            <Link to="/who-we-serve" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#FFFFFF", fontFamily: SANS, fontSize: 16, fontWeight: 500, letterSpacing: "0.16px", lineHeight: "24px", textDecoration: "none" }}>
              Learn more <ArrowChip />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 10 — FAQ */
function FAQ() {
  const qs = [
    { q: "What is RegCo?", a: "RegCo is a compliance platform that automates regulatory reporting, transaction monitoring, and sanctions screening for CBN-licensed institutions." },
    { q: "How does RegCo connect to our core banking system?", a: "RegCo integrates with major CBS providers via secure API. Our team handles the connection during onboarding." },
    { q: "What kinds of institutions does RegCo work with?", a: "Unit MFBs, State & National MFBs, Payment Service Banks, Finance Companies, and Commercial Banks operating under CBN license." },
    { q: "How does RegCo's pricing work?", a: "Pricing is scoped to institution size and modules deployed. Contact our team for a tailored quote." },
    { q: "How long does onboarding take?", a: "Most institutions are live within weeks. Timeline depends on CBS integration complexity and data readiness." },
  ];
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ background: "#F7F5F2", padding: "128px 40px" }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", display: "flex", gap: 24, justifyContent: "space-between" }}>
        <div style={{ maxWidth: 900, display: "flex", flexDirection: "column", gap: 24 }}>
          <h2 style={{ margin: 0, color: "#000000", fontFamily: SERIF, fontSize: 56, letterSpacing: "-0.56px", lineHeight: "64px" }}>FAQ's</h2>
          <p style={{ margin: 0, color: "rgba(0,0,0,0.6)", fontFamily: SANS, fontSize: 18, lineHeight: "26px" }}>
            Answers to frequently asked questions.
          </p>
          <Link to="/book-demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#171514", fontFamily: SANS, fontSize: 16, fontWeight: 500, letterSpacing: "0.16px", lineHeight: "24px", textDecoration: "none" }}>
            Talk to us <ArrowChip dark />
          </Link>
        </div>
        <div style={{ flex: 1, maxWidth: 672 }}>
          {qs.map((row, i) => {
            const isOpen = open === i;
            return (
              <div key={row.q} style={{ padding: "0 8px", position: "relative", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                <div
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ padding: "24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                >
                  <span style={{ color: "#000000", fontFamily: SERIF, fontSize: 24, fontWeight: 500, lineHeight: "32px" }}>{row.q}</span>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    border: "2px solid rgba(0,0,0,0.6)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 300ms ease",
                  }}>
                    <Plus size={14} strokeWidth={2} color="rgba(0,0,0,0.6)" />
                  </span>
                </div>
                {isOpen && (
                  <p style={{ margin: 0, paddingBottom: 16, color: "#333333", fontFamily: SANS, fontSize: 18, lineHeight: "26px" }}>{row.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* 11 — Final CTA card */
function FinalCTA() {
  return (
    <section style={{ background: "#F7F5F2", padding: "0 40px 128px" }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto" }}>
        <div style={{ background: "#EBE5DF", borderRadius: 8, display: "flex" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "96px 80px" }}>
            <h2 style={{ margin: 0, color: "#928D80", fontFamily: SERIF, fontSize: 56, letterSpacing: "-0.56px", lineHeight: "64px", maxWidth: 424 }}>
              Ready to Automate Your Compliance Workflow?
            </h2>
            <p style={{ marginTop: 12, marginBottom: 0, maxWidth: 400, color: "#333333", fontFamily: SANS, fontSize: 18, lineHeight: "26px" }}>
              Talk to our team to see how RegCo connects to your core banking system and what your onboarding timeline looks like.
            </p>
            <div style={{ marginTop: 40, display: "flex", gap: 8 }}>
              <Link to="/book-demo" style={{
                background: "#171514", borderRadius: 6, padding: "12px 28px",
                color: "#FFFFFF", fontFamily: SANS, fontSize: 18, fontWeight: 500,
                lineHeight: "26px", textDecoration: "none",
              }}>Book a Demo</Link>
              <Link to="/product" style={{
                border: "1px solid rgba(0,0,0,0.6)", borderRadius: 6, padding: "12px 28px",
                color: "#222222", fontFamily: SANS, fontSize: 18, fontWeight: 500,
                lineHeight: "26px", textDecoration: "none",
              }}>See the Product</Link>
            </div>
          </div>
          <div style={{ flex: 1, aspectRatio: "1 / 1", borderRadius: 8, position: "relative", maxWidth: "33%", margin: "auto" }}>
            <img src={dashMock} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 32, aspectRatio: "460 / 421" }} />
            <div style={{
              position: "absolute", bottom: "10%", left: "-25%",
              width: 295, height: 74, background: "#FFFFFF", borderRadius: 8,
              padding: 16, display: "flex", gap: 12, alignItems: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 8, background: "#F0EBE4", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheck size={24} color="#171514" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ color: "#000000", fontFamily: SANS, fontSize: 16, fontWeight: 500, letterSpacing: "0.16px", lineHeight: "24px" }}>Case closed</div>
                <div style={{ color: "rgba(0,0,0,0.6)", fontFamily: SANS, fontSize: 14, letterSpacing: "0.14px", lineHeight: "20px" }}>Filed and logged in under 2 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 12 — Footer */
function Footer() {
  const link: CSSProperties = { color: "#F1F1F1", fontFamily: SANS, fontSize: 16, lineHeight: "24px", textDecoration: "none" };
  const header: CSSProperties = { color: "#F9F9FA", fontFamily: SANS, fontSize: 18, fontWeight: 500, lineHeight: "26px" };
  const cols: { header: string; links: [string, string][] }[] = [
    { header: "Product", links: [["Fraud Detection","/product"],["Filing Engine","/product"],["Screening Core","/product"],["Copilot","/product"]] },
    { header: "Platform", links: [["Book a Demo","/book-demo"],["Integrations","/product"],["Security","/product"]] },
    { header: "Company", links: [["About","/about-us"],["Case Studies","/about-us"],["Careers","/about-us"]] },
    { header: "Social", links: [["LinkedIn","#"],["X","#"]] },
  ];
  return (
    <footer style={{ background: "#171514", paddingTop: 64 }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 80, marginTop: 56, padding: "0 48px" }}>
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 64 }}>
            <div style={{ color: "#FFFFFF", fontFamily: SANS, fontSize: 24, fontWeight: 800, letterSpacing: "0.02em", height: 28 }}>REGCO</div>
            <div style={{ color: "#F1F1F1", fontFamily: SANS, fontSize: 16, lineHeight: "24px" }}>Abuja, Nigeria</div>
          </div>
          {cols.map((col) => (
            <div key={col.header}>
              <div style={header}>{col.header}</div>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(([l, to]) => (
                  <Link key={l} to={to} style={link}>{l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 64, padding: "24px 48px", display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "#F1F1F1", fontFamily: SANS, fontSize: 12, lineHeight: "133.333%" }}>
            Copyright © 2026 RegCo Compliance, Inc. | All Rights Reserved
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Link to="#" style={{ color: "#F1F1F1", fontFamily: SANS, fontSize: 12, lineHeight: "133.333%", textDecoration: "none" }}>Terms of Service</Link>
            <Link to="#" style={{ color: "#F1F1F1", fontFamily: SANS, fontSize: 12, lineHeight: "133.333%", textDecoration: "none" }}>Privacy Policy</Link>
          </div>
        </div>
        <div style={{
          textAlign: "center", padding: "0 24px",
          color: "transparent", fontFamily: SERIF,
          fontSize: "clamp(80px, 22vw, 340px)",
          lineHeight: 0.9, letterSpacing: "-0.04em", fontWeight: 400,
          WebkitTextStroke: "1px #928D80",
          userSelect: "none",
        }}>REGCO</div>
      </div>
    </footer>
  );
}

/* Page */
export default function Index() {
  return (
    <div style={{
      background: "#FCFBFA", fontSize: 12, lineHeight: "16px",
      WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale",
      fontFamily: SANS,
    }}>
      <style>{`
        .regco-nav-item:hover .regco-nav-chev { transform: rotate(180deg); }
        .regco-cta-white:hover { background: #F1F1F1 !important; }
      `}</style>
      <AnnouncementBar />
      <StickyNav />
      <Hero />
      <BuiltFor />
      <ManualReview />
      <ModernApproach />
      <Advantage />
      <Testimonials />
      <WhoWeServe />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
