import { AnimateIn, CountUp } from "./AnimateIn";

const StatsSection = () => (
  <section id="stats" style={{ background: "#F5F5F7", padding: "120px 0" }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <AnimateIn>
        <p style={{ fontSize: 21, maxWidth: 640, lineHeight: 1.7 }}>
          <span style={{ color: "#6E6E73" }}>Introducing </span>
          <span style={{ color: "#1D1D1F", fontWeight: 700 }}>the world's most accurate Nigerian MFB compliance engine.</span>
          <span style={{ color: "#6E6E73" }}> Built to validate every figure before it reaches the CBN portal. So you only submit </span>
          <span style={{ color: "#1D1D1F", fontWeight: 700 }}>what you know is correct.</span>
        </p>
      </AnimateIn>

      <div style={{ width: "50%", height: 1, background: "rgba(0,0,0,0.1)", margin: "60px 0" }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <AnimateIn delay={0.1}>
          <div>
            <p style={{ fontSize: 17, color: "#6E6E73" }}>Saves up to</p>
            <div className="flex items-baseline gap-2 mt-2">
              <CountUp value={19} className="text-[#1D1D1F]" suffix="" prefix="" />
              <span style={{ fontWeight: 900, fontSize: 72, color: "#1D1D1F", lineHeight: 1 }}>
                <CountUp value={19} className="" />
              </span>
              <span style={{ fontWeight: 400, fontSize: 40, color: "#1D1D1F" }}>hrs</span>
            </div>
            <p style={{ fontSize: 17, color: "#6E6E73", marginTop: 8 }}>per month per compliance officer</p>
          </div>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <div>
            <p style={{ fontSize: 17, color: "#6E6E73" }}>Prevents up to</p>
            <div className="mt-2">
              <span style={{ fontWeight: 900, fontSize: 72, color: "#1D1D1F", lineHeight: 1 }}>₦14M+</span>
            </div>
            <p style={{ fontSize: 17, color: "#6E6E73", marginTop: 8 }}>in annual CBN fine exposure</p>
          </div>
        </AnimateIn>
      </div>
    </div>
  </section>
);

export default StatsSection;
