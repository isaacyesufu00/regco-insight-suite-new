import { ReactNode } from "react";
import { motion } from "framer-motion";
import RegCoLogo from "@/components/RegCoLogo";
import worldMap from "@/assets/world-map-dots.png";

interface AuthSplitLayoutProps {
  /** Left panel headline */
  headline: string;
  /** Left panel tagline under the headline */
  tagline: string;
  /** Three short stats shown at the bottom of the left panel */
  stats: { value: string; label: string }[];
  /** Right side form/content */
  children: ReactNode;
}

/**
 * Premium split-screen layout used by /login, /signup, /forgot-password and /book-demo.
 * Left: warm Mastercard-style orange→red gradient with halftone dot art.
 * Right: white form panel.
 */
const AuthSplitLayout = ({ headline, tagline, stats, children }: AuthSplitLayoutProps) => {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT — gradient + halftone */}
      <div
        className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #FF9A00 0%, #FFD700 40%, #FF6200 75%, #FF3D00 100%)",
        }}
      >
        {/* Halftone art — reused dotted continent asset */}
        <img
          src={worldMap}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none select-none"
          style={{ mixBlendMode: "multiply" }}
          draggable={false}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.25) 0%, transparent 55%)",
          }}
        />

        {/* Top — logo */}
        <div className="relative z-10">
          <RegCoLogo dark size="md" />
        </div>

        {/* Center — headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 max-w-md"
        >
          <h1
            className="text-3xl xl:text-4xl font-black text-white leading-tight"
            style={{ letterSpacing: "-0.02em", textShadow: "0 1px 24px rgba(0,0,0,0.15)" }}
          >
            {headline}
          </h1>
          <p className="mt-4 text-base text-white/85 leading-relaxed">{tagline}</p>
        </motion.div>

        {/* Bottom — stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative z-10 grid grid-cols-3 gap-6"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
                {s.value}
              </p>
              <p className="text-[13px] text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* RIGHT — white form panel */}
      <div className="flex items-center justify-center bg-white px-6 py-10 lg:py-0">
        <div className="w-full max-w-[380px]">{children}</div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
