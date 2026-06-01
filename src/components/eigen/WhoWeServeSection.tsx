import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  MotionValue,
} from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const SECTION_HEIGHT = "600vh";

interface Institution {
  id: string;
  category: string;
  count: string;
  headline: string;
  description: string;
  returns: string[];
  price: string;
}

const institutions: Institution[] = [
  {
    id: "unit-mfb",
    category: "UNIT MFB",
    count: "847",
    headline: "Community\nfinancial\ninstitutions",
    description:
      "Single-branch microfinance banks serving one community. Typically one compliance officer handling 10 mandatory returns across 4 regulators every month.",
    returns: ["CBN Returns", "NFIU Reports", "FIRS Remittances"],
    price: "From ₦350k/month",
  },
  {
    id: "state-mfb",
    category: "STATE MFB",
    count: "126",
    headline: "State-wide\nmicrofinance\nnetworks",
    description:
      "Operating across an entire state with multiple branches. Compliance teams consolidating data from multiple locations into a single unified return.",
    returns: ["All 16 returns", "Customer 360", "AML Monitoring"],
    price: "From ₦700k/month",
  },
  {
    id: "national-mfb",
    category: "NATIONAL MFB",
    count: "8",
    headline: "Nationwide\nmicrofinance\noperations",
    description:
      "Present in every state with tens of thousands of customers. CBN examinations are frequent. Compliance team under constant deadline pressure.",
    returns: ["All 16 returns", "Live AML Screening", "Board Pack"],
    price: "From ₦1.5M/month",
  },
  {
    id: "pmb",
    category: "PRIMARY MORTGAGE",
    count: "34",
    headline: "Mortgage\nand housing\nfinance",
    description:
      "Complex loan portfolios requiring CBN CAMEL classification. Prudential returns demand detailed borrower-level data that is time-consuming to compile manually.",
    returns: ["CBN Prudential", "NDIC Premium", "Risk Analysis"],
    price: "From ₦700k/month",
  },
  {
    id: "finance-co",
    category: "FINANCE COMPANY",
    count: "150+",
    headline: "Licensed\nfinancial\ncompanies",
    description:
      "Fast-growing fintech and finance companies managing FIRS, SCUML, and NFIU obligations with compliance teams that are often too small for the filing load.",
    returns: ["FIRS Suite", "SCUML Annual", "NFIU Reports"],
    price: "From ₦500k/month",
  },
  {
    id: "pencom",
    category: "PENCOM LICENSED",
    count: "42",
    headline: "Pension fund\nadministrators\n& custodians",
    description:
      "PFAs, PFCs, and CPFAs regulated by the National Pension Commission. Quarterly RSA returns, investment compliance, and member data submissions to PenCom.",
    returns: ["PenCom Quarterly", "RSA Returns", "Investment Compliance"],
    price: "From ₦900k/month",
  },
  {
    id: "commercial",
    category: "COMMERCIAL BANK",
    count: "26",
    headline: "Commercial\nand merchant\nbanking",
    description:
      "Full regulatory complexity. All 16 returns, live transaction screening, board-level reporting, and examination management under CBN's closest scrutiny.",
    returns: ["All features", "Enterprise support", "Direct integration"],
    price: "From ₦3M/month",
  },
];

/* ---------------- Map zoom layer ---------------- */
const MapZoomLayer = ({ progress }: { progress: MotionValue<number> }) => {
  const vbX = useTransform(progress, [0, 0.15, 0.4, 0.65], [0, 350, 440, 460]);
  const vbY = useTransform(progress, [0, 0.15, 0.4, 0.65], [0, 80, 170, 195]);
  const vbW = useTransform(progress, [0, 0.15, 0.4, 0.65], [1000, 500, 200, 80]);
  const vbH = useTransform(progress, [0, 0.15, 0.4, 0.65], [500, 250, 100, 40]);

  const viewBox = useMotionTemplate`${vbX} ${vbY} ${vbW} ${vbH}`;

  const mapOpacity = useTransform(progress, [0.6, 0.8], [1, 0.08]);
  const dotGridOpacity = useTransform(progress, [0, 0.3], [0.6, 0]);
  const africaHighlight = useTransform(progress, [0.2, 0.45], [0, 1]);
  const nigeriaOpacity = useTransform(progress, [0.4, 0.6], [0, 1]);
  const nigeriaGlow = useTransform(progress, [0.45, 0.65], [0, 1]);
  const nigeriaGlowOuter = useTransform(nigeriaGlow, (v) => v * 0.5);
  const abujaOpacity = useTransform(nigeriaOpacity, (v) => (v > 0.5 ? (v - 0.5) * 2 : 0));

  return (
    <motion.div style={{ position: "absolute", inset: 0, opacity: mapOpacity }}>
      {/* Dot grid */}
      <motion.div style={{ position: "absolute", inset: 0, opacity: dotGridOpacity }}>
        <svg width="100%" height="100%" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="dotGrid" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="7" cy="7" r="1.1" fill="rgba(255,255,255,0.22)" />
            </pattern>
          </defs>
          <rect width="1400" height="700" fill="url(#dotGrid)" />
        </svg>
      </motion.div>

      {/* Continents */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox={viewBox as unknown as string}
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d="M 80,80 L 180,70 L 220,90 L 200,140 L 160,160 L 120,180 L 90,160 L 70,120 Z"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.8"
        />
        <path
          d="M 160,200 L 210,190 L 230,240 L 220,310 L 190,350 L 160,330 L 145,280 L 150,230 Z"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.8"
        />
        <path
          d="M 420,60 L 500,55 L 520,90 L 480,110 L 430,100 L 400,80 Z"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.8"
        />
        <path
          d="M 430,130 L 510,125 L 550,145 L 565,200 L 560,270 L 530,310 L 490,325 L 455,310 L 425,260 L 415,200 L 420,155 Z"
          fill="rgba(255,255,255,0)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.8"
        />
        <motion.path
          d="M 430,130 L 510,125 L 550,145 L 565,200 L 560,270 L 530,310 L 490,325 L 455,310 L 425,260 L 415,200 L 420,155 Z"
          style={{ opacity: africaHighlight }}
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.2"
        />
        <motion.path
          d="M 455,195 L 480,192 L 492,200 L 495,215 L 488,225 L 470,228 L 455,222 L 448,210 Z"
          style={{ opacity: nigeriaOpacity }}
          fill="rgba(255,255,255,0.14)"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.5"
        />
        <motion.circle
          cx="472"
          cy="210"
          r="20"
          style={{ opacity: nigeriaGlow }}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        <motion.circle
          cx="472"
          cy="210"
          r="35"
          style={{ opacity: nigeriaGlowOuter }}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <path
          d="M 560,60 L 750,50 L 800,100 L 780,160 L 700,180 L 620,170 L 565,130 Z"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.8"
        />
        <path
          d="M 720,270 L 800,265 L 820,310 L 790,350 L 730,345 L 700,310 Z"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.8"
        />
        <motion.circle cx="472" cy="210" r="1.6" style={{ opacity: abujaOpacity }} fill="rgba(255,255,255,1)" />
      </motion.svg>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
};

/* ---------------- Particles ---------------- */
const particles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
}));

const ParticleField = ({ progress }: { progress: MotionValue<number> }) => {
  const scale = useTransform(progress, [0, 0.6], [1, 1.8]);
  const opacity = useTransform(progress, [0, 0.1, 0.55, 0.65], [0, 0.4, 0.4, 0]);
  return (
    <motion.div style={{ position: "absolute", inset: 0, scale, opacity, pointerEvents: "none" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
          }}
        />
      ))}
    </motion.div>
  );
};

/* ---------------- Coord & zoom readouts ---------------- */
const CoordinateDisplay = ({ progress }: { progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [0.15, 0.3, 0.65, 0.75], [0, 1, 1, 0]);
  const lat = useTransform(progress, [0.15, 0.55], [0, 9.082]);
  const lng = useTransform(progress, [0.15, 0.55], [0, 8.6753]);
  const latText = useTransform(lat, (v) => `${v.toFixed(4)}°N`);
  const lngText = useTransform(lng, (v) => `${v.toFixed(4)}°E`);
  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: 48,
        left: 48,
        opacity,
        fontFamily: "monospace",
        fontSize: 12,
        color: "rgba(255,255,255,0.45)",
        letterSpacing: "0.08em",
        pointerEvents: "none",
      }}
    >
      <p style={{ margin: 0 }}>
        <motion.span>{latText}</motion.span>
        {"  "}
        <motion.span>{lngText}</motion.span>
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
        FEDERAL REPUBLIC OF NIGERIA
      </p>
    </motion.div>
  );
};

const ZoomIndicator = ({ progress }: { progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [0.1, 0.25, 0.65, 0.75], [0, 0.7, 0.7, 0]);
  const zoom = useTransform(progress, [0.1, 0.65], [1, 847]);
  const zoomText = useTransform(zoom, (v) => `${Math.round(v)}x`);
  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: 48,
        right: 48,
        opacity,
        fontFamily: "monospace",
        fontSize: 11,
        color: "rgba(255,255,255,0.4)",
        letterSpacing: "0.1em",
        textAlign: "right",
        pointerEvents: "none",
      }}
    >
      <p style={{ margin: 0 }}>ZOOM</p>
      <motion.p style={{ margin: "2px 0 0", fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.65)" }}>
        {zoomText}
      </motion.p>
    </motion.div>
  );
};

/* ---------------- Headers & overlays ---------------- */
const SectionHeader = ({ progress }: { progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [0, 0.05, 0.18, 0.28], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.05], [24, 0]);
  return (
    <motion.div
      style={{ position: "absolute", top: 72, left: 64, opacity, y, pointerEvents: "none" }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          margin: "0 0 12px",
        }}
      >
        Who We Serve
      </p>
      <h2
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: "-1.8px",
          lineHeight: 1.06,
          margin: 0,
        }}
      >
        Every licensed
        <br />
        institution in Nigeria.
      </h2>
    </motion.div>
  );
};

const NigeriaLabel = ({ progress }: { progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [0.48, 0.62, 0.72, 0.8], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.48, 0.62], [0.85, 1]);
  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        translateX: "-50%",
        translateY: "-60%",
        opacity,
        scale,
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: "0 0 8px",
        }}
      >
        Federal Republic of
      </p>
      <p
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: "#FFFFFF",
          letterSpacing: "-2px",
          margin: 0,
          lineHeight: 1,
        }}
      >
        Nigeria
      </p>
      <div
        style={{
          width: 1,
          height: 48,
          background: "rgba(255,255,255,0.2)",
          margin: "16px auto 0",
        }}
      />
      <p
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.45)",
          margin: "12px 0 0",
          fontFamily: "monospace",
        }}
      >
        1,000+ licensed financial institutions
      </p>
    </motion.div>
  );
};

const DissolveFlash = ({ progress }: { progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [0.62, 0.65, 0.68, 0.72], [0, 0.15, 0.08, 0]);
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        background: "#FFFFFF",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

const ScrollHint = ({ progress }: { progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [0, 0.08, 0.15], [1, 1, 0]);
  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        translateX: "-50%",
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ width: 1, height: 32, background: "rgba(255,255,255,0.35)" }}
      />
      <p
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        Scroll
      </p>
    </motion.div>
  );
};

/* ---------------- Institution list ---------------- */
const InstitutionList = ({ progress }: { progress: MotionValue<number> }) => {
  const opacity = useTransform(progress, [0.68, 0.82], [0, 1]);
  const y = useTransform(progress, [0.68, 0.82], [32, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        y,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 48px 48px",
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          margin: "0 0 32px",
        }}
      >
        Licensed Institution Categories — Nigeria
      </p>

      <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.12)", position: "relative" }}>
        {institutions.map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(i / (institutions.length - 1)) * 100}%`,
              top: -4,
              width: 1,
              height: 8,
              background: "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${institutions.length}, 1fr)`,
          gap: 0,
        }}
      >
        {institutions.map((inst, i) => (
          <div
            key={inst.id}
            style={{
              padding: "20px 20px 0",
              paddingLeft: i === 0 ? 0 : 20,
              paddingRight: i === institutions.length - 1 ? 0 : 20,
              borderRight: i < institutions.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: "0 0 10px",
                fontFamily: "monospace",
              }}
            >
              {inst.category}
            </p>
            <p
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#FFFFFF",
                margin: "0 0 12px",
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              {inst.count}
            </p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.3,
                margin: "0 0 12px",
                whiteSpace: "pre-line",
              }}
            >
              {inst.headline}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
                margin: "0 0 14px",
              }}
            >
              {inst.description}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              {inst.returns.map((r) => (
                <span key={r} style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                  → {r}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: 0 }}>
              {inst.price}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 32,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          pointerEvents: "auto",
        }}
      >
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
          Every institution above files 10–16 mandatory returns per year across 5 regulators.
        </p>
        <a
          href="/book-demo"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#FFFFFF",
            color: "#0A0A0A",
            borderRadius: 8,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Book a demo →
        </a>
      </div>
    </motion.div>
  );
};

/* ---------------- Mobile ---------------- */
const MobileWhoWeServe = () => (
  <section
    id="who-we-serve"
    style={{ background: "#0A0A0A", padding: "80px 24px", color: "#FFFFFF" }}
  >
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "rgba(255,255,255,0.45)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        margin: "0 0 12px",
      }}
    >
      Who We Serve
    </p>
    <h2
      style={{
        fontSize: 36,
        fontWeight: 800,
        letterSpacing: "-1.2px",
        lineHeight: 1.1,
        margin: "0 0 12px",
      }}
    >
      Every licensed institution in Nigeria.
    </h2>
    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "0 0 40px", lineHeight: 1.6 }}>
      1,000+ licensed financial institutions across the Federal Republic of Nigeria.
    </p>

    <div style={{ position: "relative", paddingLeft: 20 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 8,
          bottom: 8,
          width: 1,
          background: "rgba(255,255,255,0.12)",
        }}
      />
      {institutions.map((inst) => (
        <div key={inst.id} style={{ position: "relative", padding: "0 0 32px" }}>
          <div
            style={{
              position: "absolute",
              left: -24,
              top: 6,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.7)",
            }}
          />
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "0 0 8px",
              fontFamily: "monospace",
            }}
          >
            {inst.category}
          </p>
          <p
            style={{
              fontSize: 24,
              fontWeight: 900,
              margin: "0 0 8px",
              letterSpacing: "-0.8px",
            }}
          >
            {inst.count}
          </p>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.3,
              margin: "0 0 8px",
            }}
          >
            {inst.headline.replace(/\n/g, " ")}
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 12px" }}>
            {inst.description}
          </p>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: 0 }}>
            {inst.price}
          </p>
        </div>
      ))}
    </div>

    <a
      href="/book-demo"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#FFFFFF",
        color: "#0A0A0A",
        borderRadius: 8,
        padding: "12px 22px",
        fontSize: 14,
        fontWeight: 700,
        textDecoration: "none",
        marginTop: 16,
      }}
    >
      Book a demo →
    </a>
  </section>
);

/* ---------------- Main ---------------- */
const WhoWeServeSection = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  if (isMobile) return <MobileWhoWeServe />;

  return (
    <section
      id="who-we-serve"
      ref={sectionRef}
      style={{ height: SECTION_HEIGHT, position: "relative", background: "#0A0A0A" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#0A0A0A" }}>
        <MapZoomLayer progress={smoothProgress} />
        <ParticleField progress={smoothProgress} />
        <SectionHeader progress={smoothProgress} />
        <CoordinateDisplay progress={smoothProgress} />
        <ZoomIndicator progress={smoothProgress} />
        <NigeriaLabel progress={smoothProgress} />
        <DissolveFlash progress={smoothProgress} />
        <InstitutionList progress={smoothProgress} />
        <ScrollHint progress={smoothProgress} />
      </div>
    </section>
  );
};

export default WhoWeServeSection;
