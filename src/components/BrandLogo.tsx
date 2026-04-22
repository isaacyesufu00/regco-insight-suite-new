import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** Size of the gradient square in pixels */
  size?: number;
  /** Color of the wordmark — use "light" on dark backgrounds, "dark" on light backgrounds */
  variant?: "light" | "dark";
  /** Wordmark font size class (Tailwind) */
  textClassName?: string;
  /** If provided, renders as a Link to this path. Otherwise renders a span. */
  to?: string;
  /** Hide the "RegCo" wordmark and show only the gradient square */
  markOnly?: boolean;
  className?: string;
}

/**
 * RegCo brand mark: a perfectly square gradient tile (no rounded corners)
 * with the "RegCo" wordmark beside it.
 *
 * Gradient: linear-gradient(160deg, #FF3D00 0%, #FF9A00 100%)
 */
export function BrandLogo({
  size = 28,
  variant = "dark",
  textClassName = "text-lg",
  to,
  markOnly = false,
  className,
}: BrandLogoProps) {
  const wordmarkColor = variant === "light" ? "text-white" : "text-[#0A0A0A]";

  const content = (
    <>
      <span
        aria-hidden="true"
        className="inline-block flex-shrink-0"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(160deg, #FF3D00 0%, #FF9A00 100%)",
        }}
      />
      {!markOnly && (
        <span className={cn("font-bold font-display tracking-tight", wordmarkColor, textClassName)}>
          RegCo
        </span>
      )}
    </>
  );

  const wrapperClass = cn("inline-flex items-center gap-2", className);

  if (to) {
    return (
      <Link to={to} className={wrapperClass} aria-label="RegCo home">
        {content}
      </Link>
    );
  }

  return <span className={wrapperClass}>{content}</span>;
}

export default BrandLogo;
