import { AnimateIn } from "./AnimateIn";

const AboutSection = () => (
  <section id="about" style={{ background: "#FFFFFF", padding: "140px 0" }}>
    <div className="max-w-[740px] mx-auto px-6">
      <AnimateIn>
        <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 48px)", color: "#1D1D1F" }}>
          Built after watching Nigerian compliance officers work nights and weekends.
        </h2>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <p style={{ fontSize: 21, color: "#6E6E73", lineHeight: 1.75, marginTop: 32, maxWidth: 680 }}>
          RegCo was built in Abuja after interviewing compliance officers across six microfinance banks. Every one of them described the same experience — three days before the CBN deadline, a spreadsheet that would not reconcile, a balance sheet out by seven hundred thousand naira, and a director calling every hour. We built the product we wished had existed for them.
        </p>
      </AnimateIn>

      <AnimateIn delay={0.2}>
        <div
          className="flex items-center gap-8 mt-12"
          style={{
            borderRadius: 28,
            padding: 48,
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="shrink-0 flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: "linear-gradient(135deg, #FF9A00, #FF3D00)",
              color: "white",
              fontWeight: 700,
              fontSize: 28,
            }}
          >
            IY
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 22, color: "#1D1D1F" }}>Isaac Yesufu</p>
            <p style={{ fontSize: 15, color: "#6E6E73", marginTop: 4 }}>
              Founder and CEO, RegCo Technologies Limited
            </p>
            <p style={{ fontSize: 15, color: "#6E6E73" }}>Abuja, Nigeria</p>
            <p style={{ fontSize: 17, color: "#1D1D1F", marginTop: 12, lineHeight: 1.6 }}>
              Former — compliance process researcher. Current — builder of the platform every Nigerian MFB compliance officer deserves.
            </p>
          </div>
        </div>
      </AnimateIn>
    </div>
  </section>
);

export default AboutSection;
