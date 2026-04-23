interface RegCoLogoProps {
  /** Approximate height of the wordmark in pixels. Default 28. */
  size?: number;
  className?: string;
  /** When true, swap the black wordmark for white (used on dark backgrounds). */
  inverted?: boolean;
}

/**
 * RegCoLogo — bold "RegCo" wordmark with a sharp orange-red gradient
 * square overlapping the top-right of the final "o".
 *
 * The SVG is laid out so that the wordmark height ≈ size, and the
 * gradient square is ~30% of that height, anchored at the upper-right
 * of the "o".
 */
export const RegCoLogo = ({ size = 28, className, inverted = false }: RegCoLogoProps) => {
  // Aspect ratio chosen so the wordmark + overlapping square sit comfortably.
  const width = size * 3.4;
  const height = size * 1.15;

  return (
    <svg
      viewBox="0 0 340 115"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="RegCo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="regco-mark-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9A00" />
          <stop offset="100%" stopColor="#FF3D00" />
        </linearGradient>
      </defs>

      {/* Wordmark */}
      <text
        x="0"
        y="86"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="100"
        letterSpacing="-4"
        fill={inverted ? "#FFFFFF" : "#0A0A0A"}
      >
        RegCo
      </text>

      {/* Gradient square overlapping the upper-right of the final "o" */}
      <rect
        x="278"
        y="14"
        width="34"
        height="34"
        fill="url(#regco-mark-gradient)"
      />
    </svg>
  );
};

/**
 * Just the gradient-square mark (no text) — useful for favicons,
 * decorative bullets, and feature tile accents.
 */
export const RegCoMark = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    role="img"
    aria-label="RegCo mark"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id={`regco-square-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9A00" />
        <stop offset="100%" stopColor="#FF3D00" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="24" height="24" fill={`url(#regco-square-${size})`} />
  </svg>
);

export default RegCoLogo;
