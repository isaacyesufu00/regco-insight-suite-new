import { AnimateIn, CountUp } from "./AnimateIn";

const StatsSection = () => (
  <section id="stats" style={{ background: "#F5F5F7", padding: "140px 0" }}>
    <div className="max-w-[800px] mx-auto px-6">
      <AnimateIn>
        <p style={{ fontSize: 23, maxWidth: 700, lineHeight: 1.75 }}>
          <span style={{ color: "#6E6E73" }}>Introducing </span>
          <span style={{ color: "#1D1D1F", fontWeight: 700 }}>the only compliance platform built exclusively for regulated financial institutions.</span>
          <span style={{ color: "#6E6E73" }}> We automate every return you file — to the CBN, NFIU, SCUML, NDIC, and FIRS — so your compliance team spends their time on decisions, </span>
          <span style={{ color: "#1D1D1F", fontWeight: 700 }}>not data entry.</span>
        </p>
      </AnimateIn>

      <div style={{ width: "50%", height: 1, background: "rgba(0,0,0,0.1)", margin: "60px 0" }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <AnimateIn delay={0.1}>
          <div>
            <p style={{ fontSize: 17, color: "#6E6E73" }}>Saves up to</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span style={{ fontWeight: 900, fontSize: 80, color: "#1D1D1F", lineHeight: 1, letterSpacing: -2 }}>
                <CountUp value={19} />
              </span>
              <span style={{ fontWeight: 400, fontSize: 44, color: "#1D1D1F" }}>hrs</span>
            </div>
            <p style={{ fontSize: 17, color: "#6E6E73", marginTop: 8 }}>per compliance officer per month</p>
          </div>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <div>
            <p style={{ fontSize: 17, color: "#6E6E73" }}>Prevents</p>
            <div className="mt-2">
              <span style={{ fontWeight: 900, fontSize: 80, color: "#1D1D1F", lineHeight: 1 }}>₦14M+</span>
            </div>
            <p style={{ fontSize: 17, color: "#6E6E73", marginTop: 8 }}>in annual regulatory fine exposure</p>
          </div>
        </AnimateIn>
      </div>
    </div>
  </section>
);

export default StatsSection;
