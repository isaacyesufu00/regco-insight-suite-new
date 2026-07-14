import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  // legacy props kept for back-compat; ignored visually in B/W mode
  quote?: string;
  attribution?: string;
}

export default function EditorialAuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen flex bg-white text-ink">
      {/* Left panel — quiet B/W brand panel */}
      <div className="hidden md:flex flex-col justify-between p-12 lg:p-16 w-[42%] border-r border-[var(--line)]">
        <Link to="/" className="text-[20px] font-semibold text-ink">RegCo<span style={{color:"#CA0101"}}>.</span></Link>

        <div className="max-w-md">
          <p className="text-[28px] leading-[1.15] font-semibold tracking-tight text-ink">
            Regulatory infrastructure for regulated financial institutions.
          </p>
          <p className="mt-4 text-[13.5px] text-ink-3 leading-relaxed">
            Returns, screening, monitoring, and audit — in one system, on the regulator's calendar.
          </p>
        </div>

        <p className="text-[11px] text-ink-3 font-mono uppercase tracking-[0.15em]">
          © {new Date().getFullYear()} · RegCo · Abuja
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          <div className="md:hidden mb-8">
            <Link to="/" className="text-[18px] font-semibold text-ink">RegCo<span style={{color:"#CA0101"}}>.</span></Link>
          </div>

          <h1 className="text-[32px] leading-[1.1] font-semibold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-3 text-[14px] text-ink-3 leading-relaxed">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-[13.5px] text-ink-3">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
