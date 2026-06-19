import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowUp, LogOut, Calendar, Settings as SettingsIcon, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const FUNCTION_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/agent-orchestrator` : "";

// Friendly tool labels for the activity stream
const TOOL_LABEL: Record<string, string> = {
  list_transactions: "Pulling transactions",
  get_account_velocity: "Computing velocity",
  explain_alert: "Looking up rule",
  compare_to_baseline: "Comparing to baseline",
  screen_entity: "Screening entity",
  get_customer_360: "Loading customer 360",
  adverse_media_scan: "Scanning adverse media",
  get_risk_score: "Computing risk score",
  open_case: "Opening case",
  add_case_note: "Logging note",
  request_account_freeze: "Requesting freeze",
  draft_investigation_summary: "Drafting summary",
  get_audit_trail: "Reading audit trail",
  get_filing_deadline: "Checking deadline",
  check_return_readiness: "Checking return data",
  request_generate_return: "Preparing return",
  navigate_dashboard: "Switching view",
};

const MUTATING_TOOLS = new Set(["request_account_freeze", "request_generate_return", "open_case"]);

export default function AgentRail() {
  const { session, signOut } = useAuth();
  const { userInitial, userName } = useProfile();
  const navigate = useNavigate();
  const taRef = useRef<HTMLTextAreaElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const accessToken = session?.access_token;

  const transport = useMemo(() => new DefaultChatTransport({
    api: FUNCTION_URL,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(SUPABASE_PUBLISHABLE_KEY ? { apikey: SUPABASE_PUBLISHABLE_KEY } : {}),
    },
  }), [accessToken]);

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (e) => console.error("agent error", e),
  });

  // Auto-navigate when the agent calls navigate_dashboard
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    for (const part of (last.parts ?? [])) {
      const p = part as { type?: string; toolName?: string; output?: { ui_action?: string; path?: string }; state?: string };
      if (p.type?.startsWith("tool-") && p.toolName === "navigate_dashboard" && p.state === "output-available" && p.output?.ui_action === "navigate" && p.output.path) {
        navigate(p.output.path);
      }
    }
  }, [messages, navigate]);

  // Auto-scroll
  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [messages, status]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = taRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`; }
  }, [input]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || status === "submitted" || status === "streaming") return;
    sendMessage({ text });
    setInput("");
    requestAnimationFrame(() => taRef.current?.focus());
  }, [input, sendMessage, status]);

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleSignOut = async () => { await signOut(); navigate("/sign-in"); };

  const busy = status === "submitted" || status === "streaming";

  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen sticky top-0"
      style={{ width: 370, background: "var(--rail-bg)", borderRight: "1px solid var(--rail-border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--rail-border)]">
        <span className="text-[15px] font-semibold text-[var(--navy)] tracking-tight">RegCo</span>
        <div className="flex items-center gap-1 text-[var(--ink-3)]">
          <button onClick={() => navigate("/dashboard/calendar")} title="Calendar" className="p-1.5 rounded hover:bg-black/[0.04]"><Calendar size={14} /></button>
          <button onClick={() => navigate("/dashboard/settings")} title="Settings" className="p-1.5 rounded hover:bg-black/[0.04]"><SettingsIcon size={14} /></button>
        </div>
      </div>

      {/* Conversation stream */}
      <div ref={streamRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-[12.5px] text-[var(--ink-3)] leading-[1.55] font-mono">
            <p>Idle.</p>
            <p className="mt-3">Ask RegCo to screen a customer, explain an alert, draft an investigation summary, or pull velocity for an account. Say things like "show me screening" to switch dashboards.</p>
          </div>
        )}

        {messages.map((m) => (
          <MessageBlock key={m.id} message={m} />
        ))}

        {busy && (
          <div className="font-mono text-[11.5px] text-[var(--ink-3)] flex items-center gap-1.5">
            <Loader2 size={11} className="animate-spin" />
            {status === "submitted" ? "Thinking…" : "Responding…"}
          </div>
        )}

        {error && (
          <div className="text-[12px] text-red-600 border border-red-200 rounded p-2 bg-red-50">
            Something went wrong: {error.message}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="p-3">
        <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px var(--rail-border)" }}>
          <textarea
            ref={taRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={busy}
            placeholder="What do you want to know?"
            className="w-full px-3 pt-2 pb-0.5 text-[13px] text-[var(--ink)] placeholder:text-[var(--ink-3)] bg-transparent outline-none resize-none leading-[1.4] font-sans"
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <button title="Attach" className="p-1.5 rounded text-[var(--ink-3)] hover:bg-black/[0.04]"><Plus size={14} /></button>
            <button onClick={send} disabled={!input.trim() || busy} className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-[var(--navy)] text-white disabled:opacity-30">
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--rail-border)]">
        <div className="w-6 h-6 rounded-full bg-[var(--navy)] text-white flex items-center justify-center text-[11px] font-medium">{userInitial}</div>
        <div className="min-w-0 flex-1"><p className="text-[12px] text-[var(--ink)] truncate">{userName || "Officer"}</p></div>
        <button onClick={handleSignOut} title="Sign out" className="p-1.5 text-[var(--ink-3)] hover:text-[var(--ink)]"><LogOut size={13} /></button>
      </div>
    </aside>
  );
}

function MessageBlock({ message }: { message: any }) {
  const isUser = message.role === "user";
  const text = (message.parts ?? []).filter((p: any) => p.type === "text").map((p: any) => p.text).join("");
  const toolParts = (message.parts ?? []).filter((p: any) => typeof p.type === "string" && p.type.startsWith("tool-"));

  if (isUser) {
    return (
      <div className="text-[13px] text-[var(--ink)] leading-[1.5]">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-3)] block mb-1">You</span>
        {text}
      </div>
    );
  }
  return (
    <div className="pt-2 pb-3 border-b border-[var(--rail-border)] space-y-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-3)] block">RegCo</span>
      {toolParts.map((p: any, i: number) => <ToolChip key={i} part={p} />)}
      {text && (
        <div className="text-[13px] text-[var(--ink)] leading-[1.55] prose prose-sm max-w-none prose-p:my-1 prose-strong:font-semibold">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

function ToolChip({ part }: { part: any }) {
  const toolName: string = part.toolName ?? part.type?.replace(/^tool-/, "") ?? "tool";
  const label = TOOL_LABEL[toolName] ?? toolName;
  const state: string = part.state ?? "input-streaming";
  const isMutating = MUTATING_TOOLS.has(toolName);

  if (state === "input-streaming" || state === "input-available") {
    return (
      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--ink-3)] bg-black/[0.03] border border-[var(--rail-border)] rounded-full px-2 py-1">
        <Loader2 size={10} className="animate-spin" /> {label}…
      </div>
    );
  }

  const output = part.output ?? {};
  const isError = state === "output-error" || output?.error;

  return (
    <div className="space-y-1.5">
      <div className={`inline-flex items-center gap-1.5 font-mono text-[11px] rounded-full px-2 py-1 border ${isError ? "text-red-600 border-red-200 bg-red-50" : "text-[var(--ink)] border-[var(--rail-border)] bg-black/[0.03]"}`}>
        {isError ? <XCircle size={10} /> : <CheckCircle2 size={10} />} {label}
      </div>
      {isMutating && output?.requires_approval && (
        <MutationApproval toolName={toolName} output={output} />
      )}
    </div>
  );
}

function MutationApproval({ toolName, output }: { toolName: string; output: any }) {
  const [state, setState] = useState<"pending" | "approved" | "rejected" | "working">("pending");

  const approve = async () => {
    setState("working");
    try {
      if (toolName === "request_account_freeze" && output.action_id) {
        await supabase.from("account_actions").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", output.action_id);
      } else if (toolName === "request_generate_return" && output.request_id) {
        await supabase.from("report_requests").update({ status: "approved" }).eq("id", output.request_id);
      }
      setState("approved");
    } catch { setState("pending"); }
  };
  const reject = async () => {
    setState("working");
    try {
      if (toolName === "request_account_freeze" && output.action_id) {
        await supabase.from("account_actions").update({ status: "rejected" }).eq("id", output.action_id);
      } else if (toolName === "request_generate_return" && output.request_id) {
        await supabase.from("report_requests").update({ status: "rejected" }).eq("id", output.request_id);
      }
      setState("rejected");
    } catch { setState("pending"); }
  };

  if (state === "approved") return <p className="text-[11.5px] text-green-700 font-mono">✓ Approved</p>;
  if (state === "rejected") return <p className="text-[11.5px] text-[var(--ink-3)] font-mono">✕ Cancelled</p>;

  return (
    <div className="flex items-center gap-2">
      <button onClick={approve} disabled={state === "working"} className="text-[11px] font-mono px-2 py-1 rounded bg-[var(--navy)] text-white hover:opacity-90 disabled:opacity-40">Approve</button>
      <button onClick={reject} disabled={state === "working"} className="text-[11px] font-mono px-2 py-1 rounded border border-[var(--rail-border)] text-[var(--ink)] hover:bg-black/[0.04] disabled:opacity-40">Cancel</button>
    </div>
  );
}
