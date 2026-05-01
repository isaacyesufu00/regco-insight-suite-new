const FeatureSplitSection = () => {
  return (
    <section className="py-[120px]" style={{ background: "#FFFFFF" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 22px" }}>
        <div
          className="bg-white flex flex-col md:flex-row items-center gap-10"
          style={{ borderRadius: 28, padding: 60, boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
        >
          {/* Left — RegCo icon */}
          <div className="flex-shrink-0">
            <div
              className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #FF9A00, #FF3D00)" }}
            >
              <span className="text-white text-[28px] font-black">R</span>
            </div>
          </div>

          {/* Right — text */}
          <p className="text-[19px] text-[#1D1D1F]" style={{ lineHeight: 1.6 }}>
            <span className="text-[#6E6E73]">RegCo protects your institution's data at every step.</span>{" "}
            <span className="font-semibold">All CBS data is processed in-memory during report generation and never stored permanently on RegCo servers.</span>{" "}
            <span className="text-[#6E6E73]">Your financial figures remain yours.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSplitSection;
