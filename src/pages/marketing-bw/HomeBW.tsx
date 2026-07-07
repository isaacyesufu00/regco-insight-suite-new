import { Link } from "react-router-dom";
import Nav from "@/components/marketing-bw/Nav";
import ScrollTicks from "@/components/marketing-bw/ScrollTicks";
import NumberedList from "@/components/marketing-bw/NumberedList";
import ClosingCTA from "@/components/marketing-bw/ClosingCTA";
import { T } from "@/components/marketing-bw/tokens";
import heroImg from "@/assets/hero-bw.jpg.asset.json";

const findings = [
  {
    title: "Filings get missed",
    body: "A daily return is easy to forget when three other deadlines land the same week. RegCo generates and tracks every filing automatically, so nothing depends on someone remembering.",
  },
  {
    title: "Screening happens too late",
    body: "Manual sanctions checks often run after an account is already active. RegCo screens against five watchlists before the account is approved, not after.",
  },
  {
    title: "Patterns get missed across accounts",
    body: "A single analyst reviewing hundreds of accounts by hand will miss a structuring pattern that spans three of them. RegCo watches every account continuously, not just the ones flagged for review.",
  },
  {
    title: "The paper trail has gaps",
    body: "When a regulator asks for the record, gaps in manual logs become the actual finding. RegCo timestamps and locks every decision the moment it happens.",
  },
];

const steps = [
  {
    title: "Connect",
    body: "Your core banking system sends a signed webhook to RegCo on every transaction. No manual export, no batch upload.",
  },
  {
    title: "Screen and detect",
    body: "Every transaction is checked against sanctions lists and CBN monitoring rules in under 200 milliseconds.",
  },
  {
    title: "Review and file",
    body: "Flagged activity reaches your officer with full context. Approved filings generate in the exact format your regulator requires.",
  },
];

export default function HomeBW() {
  return (
    <div style={{ background: T.black, color: T.white, fontFamily: T.font, minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 900px) {
          .bw-hero { flex-direction: column !important; height: auto !important; }
          .bw-hero-img-wrap { width: 100% !important; height: 40vh !important; }
          .bw-hero-panel { width: 100% !important; padding: 40px 24px !important; }
          .bw-hero-headline { font-size: 48px !important; }
        }
      `}</style>

      <Nav />
      <ScrollTicks />

      {/* HERO */}
      <section
        data-section
        id="hero"
        className="bw-hero"
        style={{
          display: "flex",
          height: "100vh",
          minHeight: 700,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="bw-hero-img-wrap"
          style={{ width: "50%", height: "100%", position: "relative" }}
        >
          <img
            src={heroImg.url}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "grayscale(100%)",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "15%",
              height: "100%",
              background: `linear-gradient(to right, transparent, ${T.blackPure})`,
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          className="bw-hero-panel"
          style={{
            width: "50%",
            height: "100%",
            background: T.blackPure,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "64px 48px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: T.whiteDim,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            REGCO COMPLIANCE
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1
              className="bw-hero-headline"
              style={{
                fontSize: 88,
                fontWeight: 700,
                lineHeight: 0.98,
                letterSpacing: "-2px",
                color: T.white,
                margin: 0,
              }}
            >
              <span style={{ display: "block" }}>Compliance,</span>
              <span style={{ display: "block" }}>off your</span>
              <span style={{ display: "block", color: T.red }}>desk.</span>
            </h1>
            <p
              style={{
                marginTop: 24,
                maxWidth: 420,
                marginInline: "auto",
                color: T.whiteDim,
                fontSize: 17,
                lineHeight: 1.5,
              }}
            >
              RegCo automates CBN and NFIU filings, screens every customer, and flags risk before it becomes a regulatory problem.
            </p>
          </div>

          <div>
            <Link
              to="/book-demo"
              style={{
                background: T.red,
                color: T.white,
                borderRadius: 4,
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
                transition: "background 150ms ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = T.redHover)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = T.red)}
            >
              Book a Demo
            </Link>
            <div style={{ marginTop: 12, color: T.whiteFaint, fontSize: 12 }}>
              No setup fees. Live in under two weeks.
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section
        data-section
        id="problem"
        style={{ padding: "120px 24px", background: T.black }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              color: T.whiteFaint,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            01 — The Problem
          </div>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-1px",
              lineHeight: 1.05,
              color: T.white,
              marginBottom: 64,
            }}
          >
            Every manual step is a place things fall through.
          </h2>
          <NumberedList entries={findings} />
        </div>
      </section>

      {/* PLATFORM */}
      <section
        data-section
        id="platform"
        style={{ padding: "120px 24px", background: T.black }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              color: T.whiteFaint,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            02 — The Platform
          </div>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-1px",
              lineHeight: 1.05,
              color: T.white,
              marginBottom: 64,
            }}
          >
            Four engines. One connected system.
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 64,
              maxWidth: 620,
              margin: "0 auto",
            }}
          >
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    border: `1.5px solid ${T.red}`,
                    borderRadius: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    color: T.red,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    color: T.white,
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {s.title}
                </div>
                <div style={{ color: T.whiteDim, fontSize: 15, lineHeight: 1.6 }}>
                  {s.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA
        id="cta"
        headline="Stop filing by hand."
        subheadline="See how RegCo connects to your institution."
      />
    </div>
  );
}
