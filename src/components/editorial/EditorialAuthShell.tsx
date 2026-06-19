import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  quote?: string;
  attribution?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function EditorialAuthShell({
  title, subtitle, quote, attribution, children, footer,
}: Props) {
  return (
    <div className="min-h-screen flex bg-[var(--paper)] text-ink">
      {/* Left — editorial panel */}
      <div className="hidden md:flex flex-col justify-between p-12 lg:p-16 w-[45%] border-r border-ink-10">
        <Link to="/" className="font-serif text-3xl text-ink">
          Reg<span className="text-rust">Co</span>
        </Link>

        <div className="max-w-md">
          <p className="font-serif italic text-[26px] lg:text-[30px] leading-[1.3] text-ink">
            "{quote || "Regulatory reporting should never be the reason a bank faces sanctions. It should be a quiet, predictable function."}"
          </p>
          <p className="mt-6 text-[12px] tracking-[0.18em] uppercase text-ink-muted">
            {attribution || "From the RegCo manifesto"}
          </p>
        </div>

        <p className="text-[12px] text-ink-muted">
          © {new Date().getFullYear()} RegCo · Abuja, Nigeria
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-10">
            <Link to="/" className="font-serif text-2xl text-ink">
              Reg<span className="text-rust">Co</span>
            </Link>
          </div>

          <h1 className="font-serif text-[40px] leading-[1.1] text-ink">{title}</h1>
          {subtitle && <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">{subtitle}</p>}

          <div className="mt-10">{children}</div>

          {footer && <div className="mt-8 text-[14px] text-ink-muted">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
