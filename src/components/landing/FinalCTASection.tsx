import { Link } from "react-router-dom";

const FinalCTASection = () => (
  <section className="py-[120px]" style={{ background: "#1D1D1F" }}>
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 22px" }} className="text-center">
      <h2 className="text-[48px] md:text-[56px] font-bold text-[#F5F5F7]" style={{ letterSpacing: "-0.5px", lineHeight: 1.1 }}>
        Stop filing CBN returns manually.
      </h2>
      <p className="mt-5 text-[21px] text-[rgba(245,245,247,0.55)] max-w-xl mx-auto" style={{ lineHeight: 1.6 }}>
        Join the Nigerian financial institutions automating regulatory compliance with RegCo.
      </p>
      <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/book-demo"
          className="px-7 py-3 rounded-full text-[15px] font-medium text-white"
          style={{ background: "#0066CC", backgroundImage: "none", transition: "filter 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
        >
          Book a free demo
        </Link>
        <Link
          to="/login"
          className="px-7 py-3 rounded-full text-[15px] font-medium text-[#F5F5F7]"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", backgroundImage: "none" }}
        >
          Sign in to dashboard
        </Link>
      </div>
    </div>
  </section>
);

export default FinalCTASection;
