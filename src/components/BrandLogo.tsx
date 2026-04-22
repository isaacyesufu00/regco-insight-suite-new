type BrandLogoProps = {
  size?: number;
  className?: string;
};

const BrandLogo = ({ size = 28, className = "" }: BrandLogoProps) => (
  <span
    aria-hidden
    className={`inline-block shrink-0 ${className}`}
    style={{
      width: size,
      height: size,
      backgroundImage: "var(--gradient-primary)",
    }}
  />
);

export default BrandLogo;
