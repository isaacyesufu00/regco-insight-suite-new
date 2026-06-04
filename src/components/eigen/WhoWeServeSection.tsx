import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "@/config/mapbox";
import { useIsMobile } from "@/hooks/use-mobile";

mapboxgl.accessToken = MAPBOX_TOKEN;

interface Institution {
  id: string;
  category: string;
  count: string;
  headline: string;
  description: string;
  price: string;
}

const institutions: Institution[] = [
  { id: "unit-mfb", category: "UNIT MFB", count: "847", headline: "Community financial institutions", description: "Single-branch microfinance banks serving one community. Typically one compliance officer handling 10 mandatory returns across 4 regulators every month.", price: "From ₦350k/month" },
  { id: "state-mfb", category: "STATE MFB", count: "126", headline: "State-wide microfinance networks", description: "Operating across an entire state with multiple branches. Consolidating data from multiple locations into a single unified return.", price: "From ₦700k/month" },
  { id: "national-mfb", category: "NATIONAL MFB", count: "8", headline: "Nationwide microfinance operations", description: "Present in every state with tens of thousands of customers. CBN examinations are frequent. Constant deadline pressure.", price: "From ₦1.5M/month" },
  { id: "pmb", category: "PRIMARY MORTGAGE", count: "34", headline: "Mortgage & housing finance", description: "Complex loan portfolios requiring CBN CAMEL classification. Prudential returns demand detailed borrower-level data.", price: "From ₦700k/month" },
  { id: "finance-co", category: "FINANCE COMPANY", count: "150+", headline: "Licensed financial companies", description: "Fast-growing fintech and finance companies managing FIRS, SCUML, and NFIU obligations.", price: "From ₦500k/month" },
  { id: "pencom", category: "PENCOM LICENSED", count: "42", headline: "Pension fund administrators & custodians", description: "PFAs, PFCs, and CPFAs regulated by PenCom. Quarterly RSA returns, investment compliance, and member data.", price: "From ₦900k/month" },
  { id: "commercial", category: "COMMERCIAL BANK", count: "26", headline: "Commercial & merchant banking", description: "Full regulatory complexity. All 16 returns, live transaction screening, board-level reporting under CBN's closest scrutiny.", price: "From ₦3M/month" },
];

// Camera phases: [pStart, pEnd, zoomStart, zoomEnd, pitchStart, pitchEnd, bearingStart, bearingEnd]
const PHASES: Array<[number, number, number, number, number, number, number, number]> = [
  [0.00, 0.15, 1.8, 4.5, 0, 0, 0, 0],
  [0.15, 0.35, 4.5, 7.0, 0, 0, 0, 5],
  [0.35, 0.55, 7.0, 11.5, 0, 20, 5, 15],
  [0.55, 0.78, 11.5, 14.5, 20, 45, 15, 25],
  [0.78, 1.00, 14.5, 17.5, 45, 60, 25, 35],
];

const WAYPOINTS: Array<[number, number]> = [
  [20.0, 5.0],
  [8.7, 9.0],
  [7.55, 9.08],
  [7.50, 9.06],
  [7.4879, 9.0565],
];

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const MobileWhoWeServe = () => (
  <section id="who-we-serve" style={{ background: "#080A16", padding: "80px 24px", color: "#FFFFFF" }}>
    <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px" }}>Who We Serve</p>
    <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1.2px", lineHeight: 1.1, margin: "0 0 12px" }}>
      Every licensed institution in Nigeria.
    </h2>
    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "0 0 40px", lineHeight: 1.6 }}>
      1,000+ licensed financial institutions across the Federal Republic of Nigeria.
    </p>
    <div style={{ position: "relative", paddingLeft: 20 }}>
      <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 1, background: "rgba(255,255,255,0.12)" }} />
      {institutions.map((inst) => (
        <div key={inst.id} style={{ position: "relative", padding: "0 0 32px" }}>
          <div style={{ position: "absolute", left: -24, top: 6, width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.7)" }} />
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px", fontFamily: "monospace" }}>{inst.category}</p>
          <p style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.8px" }}>{inst.count}</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1.3, margin: "0 0 8px" }}>{inst.headline}</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 12px" }}>{inst.description}</p>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: 0 }}>{inst.price}</p>
        </div>
      ))}
    </div>
    <a href="/book-demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFFFFF", color: "#0A0A0A", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", marginTop: 16 }}>
      Book a demo →
    </a>
  </section>
);

const WhoWeServeSection = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const rotationIdRef = useRef<number>(0);
  const isScrollZoomingRef = useRef<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Init map
  useEffect(() => {
    if (isMobile || !mapContainerRef.current || mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [20.0, 5.0],
      zoom: 1.8,
      projection: "globe",
      bearing: 0,
      pitch: 0,
      interactive: false,
      antialias: true,
      fadeDuration: 0,
      attributionControl: false,
    });
    mapRef.current = map;

    const startRotation = () => {
      const rotate = () => {
        if (isScrollZoomingRef.current || !mapRef.current) return;
        const c = mapRef.current.getCenter();
        mapRef.current.setCenter([c.lng + 0.04, c.lat]);
        rotationIdRef.current = requestAnimationFrame(rotate);
      };
      rotationIdRef.current = requestAnimationFrame(rotate);
    };

    map.on("load", () => {
      map.setFog({
        color: "rgb(163, 206, 246)",
        "high-color": "rgb(22, 75, 180)",
        "horizon-blend": 0.04,
        "space-color": "rgb(8, 10, 22)",
        "star-intensity": 0.7,
      });
      setMapLoaded(true);
      startRotation();
    });

    return () => {
      cancelAnimationFrame(rotationIdRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, [isMobile]);

  // Scroll handler
  useEffect(() => {
    if (isMobile || !mapLoaded) return;
    const updateCamera = (progress: number) => {
      const map = mapRef.current;
      if (!map) return;
      if (progress > 0.01 && !isScrollZoomingRef.current) {
        isScrollZoomingRef.current = true;
        cancelAnimationFrame(rotationIdRef.current);
      }
      if (progress <= 0.005 && isScrollZoomingRef.current) {
        isScrollZoomingRef.current = false;
      }
      let zoom = 1.8, pitch = 0, bearing = 0;
      for (const [ps, pe, zs, ze, pits, pite, bs, be] of PHASES) {
        if (progress >= ps && progress <= pe) {
          const t = easeInOutCubic((progress - ps) / (pe - ps));
          zoom = lerp(zs, ze, t);
          pitch = lerp(pits, pite, t);
          bearing = lerp(bs, be, t);
          break;
        }
      }
      const wp = progress * (WAYPOINTS.length - 1);
      const i = Math.min(Math.floor(wp), WAYPOINTS.length - 2);
      const t = easeInOutCubic(wp - i);
      const lng = lerp(WAYPOINTS[i][0], WAYPOINTS[i + 1][0], t);
      const lat = lerp(WAYPOINTS[i][1], WAYPOINTS[i + 1][1], t);
      map.jumpTo({ center: [lng, lat], zoom, pitch, bearing });
    };

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const raw = -rect.top / scrollable;
      const p = Math.max(0, Math.min(1, raw));
      setScrollProgress(p);
      updateCamera(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile, mapLoaded]);

  if (isMobile) return <MobileWhoWeServe />;

  return (
    <section
      id="who-we-serve"
      ref={sectionRef}
      style={{ height: "500vh", position: "relative", background: "#080A16" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#080A16" }}>
        {/* Map */}
        <div ref={mapContainerRef} style={{ position: "absolute", inset: 0 }} />

        {/* Radial vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(8,10,22,0.55) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Top header (always visible in early phases) */}
        <AnimatePresence>
          {scrollProgress < 0.35 && (
            <motion.div
              key="hdr"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ position: "absolute", top: 72, left: 64, pointerEvents: "none", color: "#fff" }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px" }}>
                Who We Serve
              </p>
              <h2 style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-1.8px", lineHeight: 1.06, margin: 0 }}>
                Every licensed<br />institution in Nigeria.
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2 — Nigeria */}
        <AnimatePresence>
          {scrollProgress >= 0.35 && scrollProgress < 0.55 && (
            <motion.div
              key="nigeria"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", color: "#fff", pointerEvents: "none" }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>
                Federal Republic of Nigeria
              </p>
              <p style={{ fontSize: 72, fontWeight: 900, letterSpacing: "-2.4px", margin: 0, lineHeight: 1 }}>Nigeria</p>
              <p style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "16px 0 0" }}>
                1,000+ licensed financial institutions
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3 — Abuja */}
        <AnimatePresence>
          {scrollProgress >= 0.55 && scrollProgress < 0.78 && (
            <motion.div
              key="abuja"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", color: "#fff", pointerEvents: "none" }}
            >
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", margin: "0 auto 20px", animation: "locationPulse 2s ease-in-out infinite" }} />
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
                Abuja · Federal Capital Territory
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4 — CBN Street level reveal */}
        <AnimatePresence>
          {scrollProgress >= 0.78 && (
            <motion.div
              key="cbn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,10,22,0.0) 0%, rgba(8,10,22,0.55) 60%, rgba(8,10,22,0.85) 100%)" }} />
              <div style={{ position: "relative", maxWidth: 720, padding: "0 32px", textAlign: "center", color: "#fff", pointerEvents: "auto" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: 999, marginBottom: 24 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF4444", boxShadow: "0 0 12px rgba(255,68,68,0.8)" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    CBN Headquarters · Abuja
                  </span>
                </div>
                <h2 style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05, margin: "0 0 24px" }}>
                  Where your reports{" "}
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                    have to land.
                  </span>
                </h2>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: "0 0 32px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
                  Every licensed financial institution in Nigeria is legally obligated to file with this building. Missing a return costs a minimum ₦2,000,000 fine. RegCo makes sure you never miss one.
                </p>
                <a
                  href="/book-demo"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: "#0A0A0A", borderRadius: 10, padding: "14px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
                >
                  Book a Demo →
                </a>
              </div>
              <div style={{ position: "absolute", bottom: 24, left: 32, fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>
                9.0565°N  7.4879°E · CENTRAL BUSINESS DISTRICT
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll hint */}
        <AnimatePresence>
          {scrollProgress < 0.05 && (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, pointerEvents: "none" }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", color: "rgba(255,255,255,0.6)" }}>
                SCROLL TO ZOOM
              </span>
              <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.5)", transformOrigin: "top", animation: "scrollPulse 1.6s ease-in-out infinite" }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{ position: "absolute", top: 0, right: 16, bottom: 0, width: 2, background: "rgba(255,255,255,0.08)", pointerEvents: "none" }}>
          <div style={{ width: "100%", background: "rgba(255,255,255,0.7)", height: `${scrollProgress * 100}%`, transition: "height 0.05s linear" }} />
        </div>

        {/* Attribution */}
        <p style={{ position: "absolute", bottom: 6, right: 24, fontSize: 10, color: "rgba(255,255,255,0.4)", margin: 0, pointerEvents: "none" }}>
          Map © Mapbox © OpenStreetMap
        </p>
      </div>

      {/* Institution list AFTER the sticky journey */}
      <section style={{ position: "relative", background: "#080A16", color: "#fff", padding: "96px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 28px" }}>
            Licensed Institution Categories — Nigeria
          </p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${institutions.length}, 1fr)`, gap: 0, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            {institutions.map((inst, i) => (
              <div
                key={inst.id}
                style={{
                  padding: "24px 20px 0",
                  paddingLeft: i === 0 ? 0 : 20,
                  paddingRight: i === institutions.length - 1 ? 0 : 20,
                  borderRight: i < institutions.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px", fontFamily: "monospace" }}>
                  {inst.category}
                </p>
                <p style={{ fontSize: 32, fontWeight: 900, margin: "0 0 12px", letterSpacing: "-1px", lineHeight: 1 }}>
                  {inst.count}
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1.3, margin: "0 0 12px" }}>
                  {inst.headline}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 14px" }}>
                  {inst.description}
                </p>
                <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                  {inst.price}
                </p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
              Every institution above files 10–16 mandatory returns per year across 5 regulators.
            </p>
            <a href="/book-demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#0A0A0A", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Book a demo →
            </a>
          </div>
        </div>
      </section>
    </section>
  );
};

export default WhoWeServeSection;
