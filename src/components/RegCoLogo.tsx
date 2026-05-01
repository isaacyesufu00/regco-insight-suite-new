import { cn } from "@/lib/utils";

interface RegCoLogoProps {
  dark?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  sm: "text-[14px]",
  md: "text-[18px]",
  lg: "text-[24px]",
  xl: "text-[32px]",
};

export const RegCoLogo = ({ dark = false, size = "md", className }: RegCoLogoProps) => (
  <span
    className={cn(
      "inline-flex items-center select-none leading-none font-semibold",
      SIZE_MAP[size],
      dark ? "text-[#F5F5F7]" : "text-[#1D1D1F]",
      className,
    )}
    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif" }}
    aria-label="RegCo"
  >
    RegCo
  </span>
);

export default RegCoLogo;
