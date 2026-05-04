import { Link } from "react-router-dom";
import { AnimateIn } from "./AnimateIn";

const CTASection = () => (
  <section style={{ background: "#1D1D1F", padding: "160px 0", position: "relative", overflow: "hidden" }}>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
      <div style={{ width: 400, height: 400, borderRadius: "50%", animation: "ctaPulse 5s ease-in-out infinite" }} />
    </div>
    <div className="relative z-10 text-center px-6">
      <AnimateIn>
        <h2 style={{ fontWeight: 700, fontSize: "clamp(40px, 6vw, 72px)", color: "white", letterSpacing: -2 }}>
          The 10th of the month.
        </h2>
      </AnimateIn>
      <AnimateIn delay={0.1}>
        <p style={{ fontStyle: "italic", fontWeight: 400, fontSize: "clamp(24px, 3vw, 40px)", color: "rgba(255,255,255,0.5)", marginTop: 12 }}>
          Your return is already done.
        </p>
      </AnimateIn>
      <AnimateIn delay={0.2}>
        <p style={{ fontSize: 21, color: "rgba(255,255,255,0.5)", marginTop: 20, maxWidth: 480, margin: "20px auto 0" }}>
          RegCo generates your CBN, NFIU, SCUML, NDIC, and FIRS returns automatically. So you never spend the 8th preparing what was always due on the 10th.
        </p>
      </AnimateIn>
      <AnimateIn delay={0.3}>
        <div className="flex items-center justify-center gap-4 mt-12">
          <Link to="/login" style={{ fontWeight: 600, fontSize: 17, background: "white", color: "#1D1D1F", borderRadius: 980, padding: "14px 28px", textDecoration: "none" }}>
            Sign In
          </Link>
          <Link to="/book-demo" style={{ fontWeight: 400, fontSize: 17, background: "rgba(255,255,255,0.1)", color: "white", borderRadius: 980, padding: "14px 28px", textDecoration: "none" }}>
            Book a Demo
          </Link>
        </div>
      </AnimateIn>
    </div>
  </section>
);

export default CTASection;
