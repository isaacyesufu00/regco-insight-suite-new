import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const WordReveal = ({ text }: { text: string }) => {
  const words = text.split(" ");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <p ref={ref} style={{ fontSize: 32, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.4, letterSpacing: "-0.5px", maxWidth: 800, margin: 0 }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.15 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0.15 }}
          transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", marginRight: 8 }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

type CountUpProps = { end: number; prefix?: string; suffix?: string; style?: React.CSSProperties };

const CountUp = ({ end, prefix = "", suffix = "", style }: CountUpProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress >= 1) {
        setCount(end);
        clearInterval(timer);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);
  return <span ref={ref} style={style}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const missionCards = [
  {
    label: "OUR MISSION",
    title: "Automate compliance. Protect institutions.",
    body: "regulated financial institutions face an increasing volume of mandatory regulatory filings across five regulators. RegCo automates every mandatory return — from CBN monthly filings to FIRS annual tax returns — so compliance teams can focus on what matters: serving their customers and growing their institution.",
  },
  {
    label: "OUR VISION",
    title: "Zero regulatory penalties.",
    body: "We believe no regulated financial institution should ever pay a ₦2,000,000 CBN fine for a late or incorrect filing when the technology to prevent it exists. RegCo is building the infrastructure layer that makes regulatory compliance as simple as pressing a button.",
  },
];

const stats: { number: number; prefix?: string; suffix?: string; label: string }[] = [
  { number: 1000, suffix: "+", label: "Licensed institutions" },
  { number: 16, label: "Mandatory returns per institution" },
  { number: 2, prefix: "₦", suffix: "M", label: "Minimum CBN fine per late filing" },
  { number: 5, suffix: " min", label: "Average RegCo generation time" },
];

const AboutUsSection = () => (
  <section id="about" style={{ background: "#F5F5F0", padding: "96px 0" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 80 }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>ABOUT REGCO</p>
        <WordReveal text="RegCo exists so that every licensed financial institution in our market can meet its regulatory obligations — without friction, without fear, and without three sleepless days before every CBN deadline." />
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 80 }}>
        {missionCards.map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)", padding: 32 }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, marginTop: 0 }}>{card.label}</p>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.5px", marginBottom: 14, marginTop: 0, lineHeight: 1.25 }}>{card.title}</h3>
            <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7, margin: 0 }}>{card.body}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ background: "#0A0A0A", borderRadius: 16, padding: "48px 64px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: "center" }}
          >
            <CountUp
              end={stat.number}
              prefix={stat.prefix}
              suffix={stat.suffix}
              style={{ fontSize: 48, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-2px", display: "block", marginBottom: 8 }}
            />
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutUsSection;
