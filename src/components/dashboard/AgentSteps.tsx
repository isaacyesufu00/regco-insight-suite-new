import { Globe, Search, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

export type AgentStep = {
  id: string;
  kind: "thinking" | "search" | "tool" | "found";
  label: string;
  detail?: string;
  state?: "active" | "done" | "error";
};

function iconFor(kind: AgentStep["kind"], state: AgentStep["state"]) {
  if (state === "active") return <Loader2 size={12} className="animate-spin text-[var(--ink-3)]" />;
  switch (kind) {
    case "search": return <Search size={12} className="text-[var(--ink-3)]" />;
    case "tool":   return <Globe size={12} className="text-[var(--ink-3)]" />;
    case "found":  return <CheckCircle2 size={12} className="text-[var(--ink-3)]" />;
    default:       return <Sparkles size={12} className="text-[var(--ink-3)]" />;
  }
}

export default function AgentSteps({ steps }: { steps: AgentStep[] }) {
  if (!steps.length) return null;
  return (
    <div className="relative pl-3 my-2 space-y-2.5" style={{ borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
      {steps.map((s) => (
        <div key={s.id} className="flex items-start gap-2 -ml-[7px]">
          <div className="w-3 h-3 mt-[3px] flex items-center justify-center bg-white rounded-full">
            {iconFor(s.kind, s.state)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] text-[var(--ink-3)] leading-[1.5]">{s.label}</p>
            {s.detail && (
              <div className="mt-1 inline-block text-[11.5px] text-[var(--ink)] bg-black/[0.04] border border-black/[0.06] rounded-md px-2 py-0.5">
                {s.detail}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
