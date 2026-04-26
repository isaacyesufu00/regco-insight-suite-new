import { cn } from "@/lib/utils";

interface RegCoLogoProps {
  /** When true, renders for dark backgrounds (light wordmark). */
  dark?: boolean;
  /** Visual size. Defaults to 'md' (navbar-sized). */
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  sm: { font: "text-base", mark: "w-2 h-2 -top-0.5 -right-1.5" },
  md: { font: "text-lg", mark: "w-2.5 h-2.5 -top-0.5 -right-2" },
  lg: { font: "text-2xl", mark: "w-3.5 h-3.5 -top-1 -right-2.5" },
  xl: { font: "text-4xl", mark: "w-5 h-5 -top-1.5 -right-4" },
};

export const RegCoLogo = ({
  dark = false,
  size = "md",
  className,
}: RegCoLogoProps) => {
  const s = SIZE_MAP[size];
  return (
    <span
      className={cn(
        "relative inline-flex items-center select-none tracking-tight leading-none font-semibold",
        s.font,
        dark ? "text-[#F5F5F7]" : "text-[#1D1D1F]",
        className,
      )}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      }}
      aria-label="RegCo"
    >
      RegCo
    </span>
  );
};

export default RegCoLogo;
