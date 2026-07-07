import Nav from "@/components/marketing-bw/Nav";
import ScrollTicks from "@/components/marketing-bw/ScrollTicks";
import NumberedList from "@/components/marketing-bw/NumberedList";
import ClosingCTA from "@/components/marketing-bw/ClosingCTA";
import { T } from "@/components/marketing-bw/tokens";

const institutions = [
  {
    title: "Unit Microfinance Banks",
    body: "Single-location MFBs operating under a unit CBN license. RegCo scales down to match a smaller compliance team without cutting coverage.",
  },
  {
    title: "State Microfinance Banks",
    body: "Multi-branch MFB operations within a single state. RegCo consolidates activity across every branch into one compliance view.",
  },
  {
    title: "National Microfinance Banks",
    body: "Multi-state MFB operations with higher transaction volume. RegCo's detection engine is built to handle that scale without slowing down review.",
  },
  {
    title: "Payment Service Banks",
    body: "PSB-licensed institutions handling deposits and transfers at high frequency. RegCo's real-time screening keeps pace with transaction volume that manual review can't.",
  },
  {
    title: "Finance Companies",
    body: "CBN-licensed finance companies with their own filing obligations. RegCo maps directly to the specific returns your license category requires.",
  },
  {
    title: "Commercial Banks",
    body: "Deposit money banks with multi-branch, multi-product compliance needs. RegCo's case management scales to match a larger compliance team's workflow.",
  },
];

export default function WhoWeServeBW() {
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
            Who We Serve
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
            Built for the institutions the CBN actually examines.
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
            RegCo is designed around the specific obligations of CBN-regulated financial institutions, not a generic compliance template.
          </p>
        </div>
      </section>

      <section
        data-section
        id="list"
        style={{ padding: "120px 24px", background: T.black }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <NumberedList entries={institutions} />
        </div>
      </section>

      <ClosingCTA
        id="cta"
        headline="Find your institution's fit."
        subheadline="Tell us your license category and transaction volume. We'll walk through what onboarding looks like."
      />
    </div>
  );
}
