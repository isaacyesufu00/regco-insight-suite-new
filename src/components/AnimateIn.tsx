import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  className?: string;
}

export const AnimateIn = ({ children, delay = 0, direction = "up", className }: AnimateInProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: direction === "up" ? 40 : 0,
        x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
        scale: direction === "scale" ? 0.94 : 1,
      }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : undefined}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
};

interface WordRevealProps {
  text: string;
  className?: string;
}

export const WordReveal = ({ text, className }: WordRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.06 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp = ({ value, prefix = "", suffix = "", className }: CountUpProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return <span ref={ref} className={className}>{prefix}{count}{suffix}</span>;
};

import { useState, useEffect } from "react";

export default AnimateIn;
