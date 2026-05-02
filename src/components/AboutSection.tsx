import { AnimateIn } from "./AnimateIn";

const AboutSection = () => (
  <section id="about" style={{ background: "#FFFFFF", padding: "120px 0" }}>
    <div className="max-w-[800px] mx-auto px-6">
      <AnimateIn>
        <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 48px)", color: "#1D1D1F" }}>
          Built for Nigeria's compliance officers.
        </h2>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <p style={{ fontSize: 21, color: "#6E6E73", lineHeight: 1.7, marginTop: 32 }}>
          RegCo was built in Abuja after watching compliance officers spend entire weeks manually preparing CBN returns in Excel — only to face fines when a figure was transposed. We built the tool we wish existed.
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
              fontSize: 24,
            }}
          >
            IY
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 22, color: "#1D1D1F" }}>Isaac Yesufu</p>
            <p style={{ fontSize: 15, color: "#6E6E73", marginTop: 4 }}>
              Founder & CEO, RegCo Technologies Limited · Abuja, Nigeria
            </p>
            <p style={{ fontSize: 17, color: "#1D1D1F", marginTop: 12, lineHeight: 1.6 }}>
              Building the compliance infrastructure that Nigerian financial institutions deserve — accurate, fast, and stress-free.
            </p>
          </div>
        </div>
      </AnimateIn>
    </div>
  </section>
);

export default AboutSection;
