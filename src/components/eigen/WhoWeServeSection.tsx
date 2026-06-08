import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

// Public Mapbox token — restricted by URL on the Mapbox side
mapboxgl.accessToken =
  "pk.eyJ1IjoiaXNhYWNucmoiLCJhIjoiY21wd2hrNGh6MDBobDJyc2JrOGQ0N240MiJ9.nTJtDkPUmziOf1_ZsKBp1g";

// ─── Cinematic camera journey ───
type CameraKeyframe = { progress: number; center: [number, number]; zoom: number; pitch: number; bearing: number };
const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { progress: 0.0,  center: [20, 10],   zoom: 1.2, pitch: 0,  bearing: 0   },
  { progress: 0.20, center: [15, 5],    zoom: 2.8, pitch: 20, bearing: -5  },
  { progress: 0.38, center: [8, 8],     zoom: 4.2, pitch: 35, bearing: -8  },
  { progress: 0.55, center: [8.5, 9.5], zoom: 5.8, pitch: 45, bearing: -12 },
  { progress: 0.70, center: [7.5, 9.0], zoom: 7.2, pitch: 50, bearing: -15 },
  { progress: 1.0,  center: [7.5, 9.0], zoom: 7.2, pitch: 50, bearing: -15 },
];

const interpolateCamera = (progress: number) => {
  let start = CAMERA_KEYFRAMES[0];
  let end = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];
  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    if (progress >= CAMERA_KEYFRAMES[i].progress && progress <= CAMERA_KEYFRAMES[i + 1].progress) {
      start = CAMERA_KEYFRAMES[i];
      end = CAMERA_KEYFRAMES[i + 1];
      break;
    }
  }
  const t = (progress - start.progress) / (end.progress - start.progress || 1);
  const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  return {
    center: [
      start.center[0] + (end.center[0] - start.center[0]) * ease,
      start.center[1] + (end.center[1] - start.center[1]) * ease,
    ] as [number, number],
    zoom: start.zoom + (end.zoom - start.zoom) * ease,
    pitch: start.pitch + (end.pitch - start.pitch) * ease,
    bearing: start.bearing + (end.bearing - start.bearing) * ease,
  };
};

const institutions = [
  { category: "UNIT MFB",         count: "847",  headline: "Community\nmicrofinance",     desc: "Single-branch institutions serving one community. One compliance officer. 10 mandatory returns across 4 regulators every month.", returns: ["CBN Returns", "NFIU Reports", "FIRS Remittances"], price: "From ₦350k/month" },
  { category: "STATE MFB",        count: "126",  headline: "State-wide\nnetworks",        desc: "Multi-branch operations across an entire state. Complex data consolidation. All 16 mandatory returns.",                       returns: ["All 16 returns", "Customer 360", "AML Monitoring"], price: "From ₦700k/month" },
  { category: "NATIONAL MFB",     count: "8",    headline: "Nationwide\noperations",      desc: "Present in every state. Tens of thousands of customers. Frequent CBN examinations and constant deadline pressure.",            returns: ["All features", "Live AML", "Board Pack"],          price: "From ₦1.5M/month" },
  { category: "PRIMARY MORTGAGE", count: "34",   headline: "Housing\nfinance",            desc: "Complex loan portfolios requiring CAMEL classification. Prudential returns demand borrower-level data.",                       returns: ["CBN Prudential", "NDIC Premium", "Risk Analysis"], price: "From ₦700k/month" },
  { category: "FINANCE COMPANY",  count: "150+", headline: "Licensed\nfintech",           desc: "Fast-growing companies managing FIRS, SCUML, and NFIU obligations with lean compliance teams.",                                returns: ["FIRS Suite", "SCUML Annual", "NFIU Reports"],      price: "From ₦500k/month" },
  { category: "COMMERCIAL BANK",  count: "26",   headline: "Commercial\nbanking",         desc: "Full regulatory complexity. All 16 returns, live screening, board reporting, and examination management.",                     returns: ["All features", "Enterprise SLA", "Direct API"],    price: "From ₦3M/month" },
];

// Simplified Nigeria boundary polygon
const NIGERIA_POLYGON: [number, number][][] = [[
  [2.6917, 6.3583], [3.3, 6.4], [4.2, 5.9], [5.5, 5.3],
  [6.2, 4.7], [7.0, 4.5], [8.4, 4.5], [9.0, 4.4],
  [9.8, 5.0], [10.5, 5.4], [11.0, 6.0], [11.5, 6.5],
  [13.0, 7.5], [13.7, 8.7], [14.6, 10.5], [14.2, 11.3],
  [13.5, 12.0], [13.0, 13.0], [12.3, 13.1], [11.5, 13.3],
  [10.7, 13.5], [10.0, 13.4], [9.0, 12.8], [8.7, 12.5],
  [7.8, 13.3], [6.7, 13.0], [5.3, 13.9], [3.6, 11.8],
  [3.5, 11.0], [3.3, 10.2], [2.7, 9.0], [2.7, 7.9],
  [2.6917, 6.3583],
]];

// ─── Mobile fallback ───
const MobileWhoWeServe = () => (
  <section style={{ background: "#0A0A0A", color: "#FFFFFF", padding: "80px 24px" }}>
    <p style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: 14 }}>WHO WE SERVE</p>
    <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1.2px", lineHeight: 1.05, marginBottom: 28 }}>
      Every licensed<br />institution in<br />Nigeria.
    </h2>
    <svg viewBox="2 4 13 10" style={{ width: "100%", maxWidth: 280, height: "auto", marginBottom: 32, opacity: 0.5 }}>
      <polygon points={NIGERIA_POLYGON[0].map(p => `${p[0]},${15 - p[1]}`).join(" ")} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.08" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {institutions.map(inst => (
        <div key={inst.category} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", margin: "0 0 6px" }}>{inst.category}</p>
          <p style={{ fontSize: 36, fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px", letterSpacing: "-1px" }}>{inst.count}</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", margin: "0 0 8px", whiteSpace: "pre-line" }}>{inst.headline}</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>{inst.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// ─── Main desktop section ───
const WhoWeServeSection = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoomNumber, setZoomNumber] = useState(1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const headerOpacity      = useTransform(scrollYProgress, [0, 0.05, 0.20, 0.30], [0, 1, 1, 0]);
  const nigeriaLabelOpacity = useTransform(scrollYProgress, [0.48, 0.60, 0.72, 0.80], [0, 1, 1, 0]);
  const coordinateOpacity  = useTransform(scrollYProgress, [0.20, 0.32, 0.72, 0.80], [0, 1, 1, 0]);
  const zoomOpacity        = useTransform(scrollYProgress, [0.20, 0.32, 0.72, 0.80], [0, 1, 1, 0]);
  const listOpacity        = useTransform(scrollYProgress, [0.72, 0.85], [0, 1]);
  const listY              = useTransform(scrollYProgress, [0.72, 0.85], [40, 0]);
  const scrollHintOpacity  = useTransform(scrollYProgress, [0, 0.06, 0.12], [1, 1, 0]);
  const zoomDisplay        = useTransform(scrollYProgress, [0.20, 0.70], [1, 847]);

  // Init map
  useEffect(() => {
    if (isMobile || !mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [20, 10],
      zoom: 1.2,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.on("load", () => {
      setMapLoaded(true);

      map.addSource("nigeria-highlight", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "Polygon", coordinates: NIGERIA_POLYGON },
          properties: {},
        },
      });

      map.addLayer({
        id: "nigeria-fill",
        type: "fill",
        source: "nigeria-highlight",
        paint: { "fill-color": "rgba(255,255,255,1)", "fill-opacity": 0 },
      });

      map.addLayer({
        id: "nigeria-border",
        type: "line",
        source: "nigeria-highlight",
        paint: { "line-color": "rgba(255,255,255,0.65)", "line-width": 1.5, "line-opacity": 0 },
      });

      const abujaEl = document.createElement("div");
      abujaEl.id = "abuja-marker";
      abujaEl.style.cssText =
        "width:10px;height:10px;border-radius:50%;background:#FFFFFF;box-shadow:0 0 16px rgba(255,255,255,0.7);opacity:0;transition:opacity 0.5s;";
      new mapboxgl.Marker({ element: abujaEl, anchor: "center" })
        .setLngLat([7.4951, 9.0579])
        .addTo(map);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isMobile]);

  // Drive map with scroll
  useEffect(() => {
    if (isMobile) return;
    const unsub = scrollYProgress.on("change", (progress) => {
      if (!mapRef.current || !mapLoaded) return;
      const cam = interpolateCamera(progress);
      mapRef.current.jumpTo(cam);

      const nigeriaOp = Math.max(0, Math.min(1, (cam.zoom - 3.5) / 2));
      if (mapRef.current.getLayer("nigeria-fill")) {
        mapRef.current.setPaintProperty("nigeria-fill", "fill-opacity", nigeriaOp * 0.06);
        mapRef.current.setPaintProperty("nigeria-border", "line-opacity", nigeriaOp);
      }

      const marker = document.getElementById("abuja-marker");
      if (marker) {
        marker.style.opacity = cam.zoom > 5.5 ? String(Math.min(1, (cam.zoom - 5.5) / 1.5)) : "0";
      }
    });
    return unsub;
  }, [mapLoaded, scrollYProgress, isMobile]);

  // Mirror zoomDisplay motion value to state for JSX
  useEffect(() => {
    const unsub = zoomDisplay.on("change", (v) => setZoomNumber(Math.round(v)));
    return unsub;
  }, [zoomDisplay]);

  if (isMobile) return <MobileWhoWeServe />;

  return (
    <section id="who-we-serve" ref={sectionRef} style={{ position: "relative", height: "600vh", background: "#0A0A0A" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden", background: "#0A0A0A" }}>
        {/* Map */}
        <div ref={mapContainerRef} style={{ position: "absolute", inset: 0, background: "#0A0A0A" }} />

        {/* Dark vignette */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.55) 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 200, pointerEvents: "none",
            background: "linear-gradient(to bottom, transparent, #0A0A0A)",
          }}
        />

        {/* HEADER */}
        <motion.div
          style={{
            position: "absolute", top: "12vh", left: 0, right: 0, textAlign: "center",
            color: "#FFFFFF", opacity: headerOpacity, padding: "0 24px",
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", marginBottom: 18 }}>
            WHO WE SERVE
          </p>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05, margin: 0 }}>
            Every licensed<br />institution in Nigeria.
          </h2>
        </motion.div>

        {/* COORDINATES — bottom left */}
        <motion.div
          style={{
            position: "absolute", bottom: 40, left: 40, color: "#FFFFFF",
            opacity: coordinateOpacity, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          <p style={{ fontSize: 12, margin: 0, letterSpacing: "0.04em" }}>9.0820°N · 8.6753°E</p>
          <p style={{ fontSize: 10, margin: "4px 0 0", color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>
            FEDERAL REPUBLIC OF NIGERIA
          </p>
        </motion.div>

        {/* ZOOM — bottom right */}
        <motion.div
          style={{
            position: "absolute", bottom: 40, right: 40, color: "#FFFFFF",
            opacity: zoomOpacity, textAlign: "right",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          <p style={{ fontSize: 10, margin: 0, letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)" }}>ZOOM</p>
          <p style={{ fontSize: 22, fontWeight: 700, margin: "4px 0 0", letterSpacing: "-0.02em" }}>{zoomNumber}x</p>
        </motion.div>

        {/* NIGERIA LABEL */}
        <motion.div
          style={{
            position: "absolute", top: "38%", left: 0, right: 0, textAlign: "center",
            color: "#FFFFFF", opacity: nigeriaLabelOpacity, pointerEvents: "none",
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)", margin: 0 }}>
            FEDERAL REPUBLIC OF
          </p>
          <p style={{ fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 800, letterSpacing: "-3px", margin: "8px 0 12px", lineHeight: 1 }}>
            Nigeria
          </p>
          <div style={{ width: 60, height: 1, background: "rgba(255,255,255,0.4)", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, letterSpacing: "0.04em" }}>
            1,000+ licensed financial institutions
          </p>
        </motion.div>

        {/* INSTITUTION LIST */}
        <motion.div
          style={{
            position: "absolute", inset: 0, padding: "80px 40px 60px",
            opacity: listOpacity, y: listY, color: "#FFFFFF",
            display: "flex", flexDirection: "column",
            background: "linear-gradient(to bottom, rgba(10,10,10,0.85), rgba(10,10,10,0.98))",
            overflowY: "auto",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 28 }}>
            LICENSED INSTITUTION CATEGORIES — NIGERIA
          </p>

          {/* Timeline bar */}
          <div style={{ display: "flex", gap: 4, marginBottom: 36, maxWidth: 1280, width: "100%", margin: "0 auto 36px" }}>
            {institutions.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.2)" }} />
            ))}
          </div>

          {/* Columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 0,
              maxWidth: 1280,
              width: "100%",
              margin: "0 auto",
              flex: 1,
            }}
          >
            {institutions.map((inst, i) => (
              <div
                key={inst.category}
                style={{
                  padding: i > 0 ? "0 20px" : "0 20px 0 0",
                  borderRight: i < institutions.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", margin: "0 0 10px" }}>
                  {inst.category}
                </p>
                <p style={{ fontSize: 44, fontWeight: 800, color: "#FFFFFF", margin: "0 0 8px", letterSpacing: "-1.5px", lineHeight: 1 }}>
                  {inst.count}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", whiteSpace: "pre-line", margin: "0 0 12px", lineHeight: 1.25 }}>
                  {inst.headline}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 14px", flex: 1 }}>
                  {inst.desc}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                  {inst.returns.map((r) => (
                    <p key={r} style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: 0, letterSpacing: "0.02em" }}>
                      → {r}
                    </p>
                  ))}
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", margin: 0, letterSpacing: "0.02em" }}>
                  {inst.price}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              maxWidth: 1280, width: "100%", margin: "32px auto 0",
              borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20,
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap",
            }}
          >
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0 }}>
              Every institution above files 10–16 mandatory returns per year across 5 regulators.
            </p>
            <a
              href="/book-demo"
              style={{
                fontSize: 13, fontWeight: 600, color: "#0A0A0A", background: "#FFFFFF",
                borderRadius: 8, padding: "10px 18px", textDecoration: "none", letterSpacing: "0.02em",
              }}
            >
              Book a demo →
            </a>
          </div>
        </motion.div>

        {/* SCROLL HINT */}
        <motion.div
          style={{
            position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.55)", opacity: scrollHintOpacity,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 22, height: 34, borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.35)", position: "relative",
            }}
          >
            <motion.div
              animate={{ y: [4, 14, 4], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute", left: "50%", top: 0, marginLeft: -2,
                width: 4, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.7)",
              }}
            />
          </motion.div>
          <p style={{ fontSize: 10, letterSpacing: "0.2em", margin: 0, fontWeight: 600 }}>SCROLL</p>
        </motion.div>

        {/* Attribution */}
        <p
          style={{
            position: "absolute", bottom: 6, right: 12, margin: 0,
            fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.02em",
            pointerEvents: "none",
          }}
        >
          Map © Mapbox © OpenStreetMap
        </p>
      </div>
    </section>
  );
};

export default WhoWeServeSection;
