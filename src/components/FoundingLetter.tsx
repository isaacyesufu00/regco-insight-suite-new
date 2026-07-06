import { Link } from "react-router-dom";

const HELV = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const C = {
  surface: "#141414",
  ink:     "#F2EDE4",
  ink2:    "#D8D2C6",
  ink3:    "#8A847A",
  rule:    "#2A2724",
};

const Body: React.CSSProperties = {
  fontFamily: HELV, fontWeight: 400, fontSize: 17, lineHeight: 1.6,
  color: C.ink2, margin: 0,
};
const Mono: React.CSSProperties = {
  fontFamily: MONO, fontWeight: 400, fontSize: 13, color: C.ink3,
};

export default function FoundingLetter() {
  return (
    <>
      <div style={{ border: `1px solid ${C.rule}`, background: C.surface, padding: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div style={{ fontFamily: HELV, fontWeight: 700, fontSize: 15, color: C.ink, letterSpacing: "0.04em", lineHeight: 1.05 }}>
            <div>REGCO</div><div>COMPLIANCE</div>
          </div>
          <div style={{ fontFamily: HELV, fontStyle: "italic", fontSize: 13, color: C.ink3, textAlign: "right" }}>
            Compliance infrastructure for regulated institutions
          </div>
        </div>
        <div style={{ height: 2, background: "#CA0101", marginTop: 20, marginBottom: 32 }} />
        <div style={{ ...Mono, fontSize: 13, color: C.ink3, marginBottom: 32 }}>June 27th, 2026</div>

        <p style={{ ...Body, marginTop: 0 }}>
          After banking, compliance is the part of finance most overdue for automation.
        </p>
        <p style={{ ...Body, marginTop: 20 }}>
          Today, systems can process transactions and flag numbers. But they lack judgment. What counts as a suspicious pattern versus normal business activity? When does a series of small transfers become a structuring case? When you hire a senior compliance officer, making those calls is exactly what you are paying for.
        </p>
        <p style={{ ...Body, marginTop: 20 }}>
          Rapid progress in AI has happened wherever there is a clear right answer: math, code, pattern recognition. Compliance has very few of those. Most of the hard calls live in a grey area where the answer depends on context, regulatory history, and what an examiner is likely to focus on during the next cycle.
        </p>
        <p style={{ ...Body, marginTop: 20 }}>
          How do you automate a decision where reasonable officers disagree? Or where the right response depends on the institution's own risk appetite, not just the transaction amount? How do you build a system that handles the edge cases, not just the thresholds?
        </p>
        <p style={{ ...Body, marginTop: 20 }}>
          That is why we built RegCo. A platform that sits between the core banking system and the compliance officer. It handles the work that should never have been manual: screening customers, generating filings, flagging patterns, and keeping a complete record of every decision made.
        </p>
        <p style={{ ...Body, marginTop: 20 }}>
          We are not replacing compliance officers. We are giving them back the time they currently spend on paperwork, so they can focus on the judgment calls that actually require a human. That is the job no platform can do alone.
        </p>

        <div style={{ height: 2, background: "#CA0101", marginTop: 32, width: 120 }} />
        <p style={{ ...Body, marginTop: 20 }}>
          RegCo exists to make compliance invisible to the institution and defensible to the regulator. It is day{" "}
          <span style={{ color: "#CA0101", textDecoration: "underline", textDecorationColor: "#CA0101", textDecorationThickness: "1.5px", textUnderlineOffset: 3 }}>
            zero
          </span>.
        </p>

        <div style={{ marginTop: 48, width: 248, height: 80, border: `1px dashed ${C.rule}`, display: "flex", alignItems: "center", justifyContent: "center", ...Mono, fontSize: 11 }}>
          [signature]
        </div>
        <div style={{ marginTop: 16, ...Body, color: C.ink }}>Isaac Yesufu</div>
        <div style={{ ...Body, color: C.ink3, fontSize: 14 }}>Founder and CEO, RegCo</div>
      </div>

      <div style={{ textAlign: "center", marginTop: 48 }}>
        <Link to="/book-demo" style={{ fontFamily: HELV, fontStyle: "italic", fontSize: 15, color: "#CA0101", textDecoration: "none" }}>
          Book a demo →
        </Link>
      </div>
    </>
  );
}
