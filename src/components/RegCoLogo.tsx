import { cn } from "@/lib/utils";

interface RegCoLogoProps {
  /** When true, renders for dark backgrounds (white wordmark). */
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

/**
 * RegCo wordmark with a sharp gradient square mark anchored at the top-right
 * of the last letter. Use `dark` prop on dark surfaces.
 */
export const RegCoLogo = ({
  dark = false,
  size = "md",
  className,
}: RegCoLogoProps) => {
  const s = SIZE_MAP[size];
  return (
    <span
      className={cn(
        "relative inline-flex items-center select-none font-black tracking-tight leading-none",
        s.font,
        dark ? "text-white" : "text-[#0A0A0A]",
        className,
      )}
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      aria-label="RegCo"
    >
      <span className="relative">
        RegCo
        <span
          aria-hidden="true"
          className={cn("absolute bg-brand-gradient", s.mark)}
        />
      </span>
    </span>
  );
};

export default RegCoLogo;
