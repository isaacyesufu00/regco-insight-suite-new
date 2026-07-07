import Nav from "@/components/marketing-bw/Nav";
import ScrollTicks from "@/components/marketing-bw/ScrollTicks";
import NumberedList from "@/components/marketing-bw/NumberedList";
import ClosingCTA from "@/components/marketing-bw/ClosingCTA";
import { T } from "@/components/marketing-bw/tokens";

const engines = [
  {
    title: "Screening Core",
    body: "Verifies every customer and counterparty against BVN, NIN, and five sanctions lists before an account goes live. Re-screens automatically when a watchlist updates.",
  },
  {
    title: "Fraud Detection",
    body: "Applies the CBN's six monitoring rules alongside behavioral pattern checks — structuring, velocity, split deposits — to every transaction, continuously.",
  },
  {
    title: "Filing Engine",
    body: "Generates CBN daily returns, NFIU CTRs, and STRs directly from your transaction data, formatted to the exact schema your regulator requires.",
  },
  {
    title: "Case Management",
    body: "Gives every flagged transaction an owner, a timeline, and a documented outcome. Every action is timestamped and cannot be edited after the fact.",
  },
];

export default function ProductBW() {
  return (
    <div style={{ background: T.black, color: T.white, fontFamily: T.font, minHeight: "100vh" }}>
      <Nav />
      <ScrollTicks />

      <section
        data-section
        id="hero"
        style={{
          height: "60vh",
          minHeight: 480,
          background: T.blackPure,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ maxWidth: 700 }}>
          <div
            style={{
              color: T.whiteDim,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Product
          </div>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-1.5px",
              lineHeight: 1.05,
              color: T.white,
              margin: 0,
            }}
          >
            One platform. Four engines.
          </h1>
          <p
            style={{
              marginTop: 24,
              color: T.whiteDim,
              fontSize: 17,
              maxWidth: 480,
              marginInline: "auto",
            }}
          >
            Screening, detection, filing, and case management, connected to the same transaction record.
          </p>
        </div>
      </section>

      <section
        data-section
        id="engines"
        style={{ padding: "120px 24px", background: T.black }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <NumberedList entries={engines} />
        </div>
      </section>

      <ClosingCTA
        id="cta"
        headline="See the four engines together."
        subheadline="Book a walkthrough of the platform end to end."
      />
    </div>
  );
}
