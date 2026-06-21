import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, ArrowUp, LogOut, Settings as SettingsIcon, CheckCircle2, XCircle, Loader2, FileText, X,
  Upload, FileSignature, UserSearch, AlertTriangle, FileBarChart, SearchX, BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const FUNCTION_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/agent-orchestrator` : "";

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

const ACCEPT = ".pdf,.xlsx,.xls,.csv,.docx,.txt,.md,.json";
const MAX_FILES = 5;
const MAX_BYTES = 20 * 1024 * 1024;
const MAX_CHARS_PER_FILE = 40_000;

type Attachment = {
  id: string;
  name: string;
  size: number;
  text: string;
  parsing: boolean;
  error?: string;
};

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function truncate(s: string) {
  if (s.length <= MAX_CHARS_PER_FILE) return s;
  return s.slice(0, MAX_CHARS_PER_FILE) + "\n…[truncated]";
}

async function parseFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    const pdfjs: any = await import("pdfjs-dist");
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    const buf = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: buf }).promise;
    let out = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const tc = await page.getTextContent();
      out += tc.items.map((it: any) => it.str).join(" ") + "\n\n";
      if (out.length > MAX_CHARS_PER_FILE) break;
    }
    return out.trim();
  }
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    const XLSX: any = await import("xlsx");
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const parts: string[] = [];
    for (const sheetName of wb.SheetNames) {
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName]);
      parts.push(`=== Sheet: ${sheetName} ===\n${csv}`);
    }
    return parts.join("\n\n");
  }
  if (name.endsWith(".docx")) {
    const mammoth: any = await import("mammoth");
    const buf = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
    return value;
  }
  return await file.text();
}

export default function AgentRail() {
  const { session, signOut } = useAuth();
  const { userInitial, userName } = useProfile();
  const navigate = useNavigate();
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [quickOpen, setQuickOpen] = useState(false);
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

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    for (const part of (last.parts ?? [])) {
      const p = part as { type?: string; toolName?: string; output?: { ui_action?: string; path?: string }; state?: string };
      const toolName = p.toolName ?? (p.type?.startsWith("tool-") ? p.type.slice(5) : undefined);
      if (toolName === "navigate_dashboard" && p.state === "output-available" && p.output?.ui_action === "navigate" && p.output.path) {
        navigate(p.output.path);
      }
    }
  }, [messages, navigate]);

  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [messages, status]);

  useEffect(() => {
    const ta = taRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`; }
  }, [input]);

  // Auto-dismiss error attachments
  useEffect(() => {
    const errored = attachments.filter(a => a.error);
    if (!errored.length) return;
    const t = setTimeout(() => {
      setAttachments(prev => prev.filter(a => !a.error));
    }, 5000);
    return () => clearTimeout(t);
  }, [attachments]);

  const addFiles = useCallback(async (files: FileList | null) => {
    if (!files || !files.length) return;
    const incoming = Array.from(files);
    const slots = MAX_FILES - attachments.filter(a => !a.error).length;
    const accepted: File[] = [];
    const errors: Attachment[] = [];

    for (const f of incoming) {
      if (accepted.length >= slots) {
        errors.push({ id: crypto.randomUUID(), name: f.name, size: f.size, text: "", parsing: false, error: `Max ${MAX_FILES} files` });
        continue;
      }
      if (f.size > MAX_BYTES) {
        errors.push({ id: crypto.randomUUID(), name: f.name, size: f.size, text: "", parsing: false, error: "Over 20MB" });
        continue;
      }
      const lower = f.name.toLowerCase();
      const ok = ACCEPT.split(",").some(ext => lower.endsWith(ext.trim()));
      if (!ok) {
        errors.push({ id: crypto.randomUUID(), name: f.name, size: f.size, text: "", parsing: false, error: "Unsupported type" });
        continue;
      }
      accepted.push(f);
    }

    const pending: Attachment[] = accepted.map(f => ({
      id: crypto.randomUUID(), name: f.name, size: f.size, text: "", parsing: true,
    }));
    setAttachments(prev => [...prev, ...pending, ...errors]);

    for (let i = 0; i < accepted.length; i++) {
      const file = accepted[i];
      const id = pending[i].id;
      try {
        const text = truncate(await parseFile(file));
        setAttachments(prev => prev.map(a => a.id === id ? { ...a, text, parsing: false } : a));
      } catch (e: any) {
        setAttachments(prev => prev.map(a => a.id === id ? { ...a, parsing: false, error: e?.message || "Parse failed" } : a));
      }
    }
  }, [attachments]);

  const removeAttachment = (id: string) => setAttachments(prev => prev.filter(a => a.id !== id));

  const parsingAny = attachments.some(a => a.parsing);
  const validAtt = attachments.filter(a => !a.error && !a.parsing);

  const handleSignOut = async () => { await signOut(); navigate("/sign-in"); };

  const busy = status === "submitted" || status === "streaming";

  const send = useCallback((overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if ((!text && !validAtt.length) || busy || parsingAny) return;
    let payload = text;
    if (validAtt.length) {
      const blocks = validAtt.map(a => `--- ${a.name} ---\n${a.text}`).join("\n\n");
      payload = `[Attached files]\n\n${blocks}\n\n---\n${text}`;
    }
    sendMessage({ text: payload });
    setInput("");
    setAttachments([]);
    requestAnimationFrame(() => taRef.current?.focus());
  }, [input, sendMessage, busy, parsingAny, validAtt]);

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const QUICK_ACTIONS: { icon: typeof Upload; label: string; run: () => void }[] = [
    { icon: Upload,         label: "Import a file",     run: () => { setQuickOpen(false); fileRef.current?.click(); } },
    { icon: FileBarChart,   label: "Generate a return", run: () => { setQuickOpen(false); send("Generate a regulatory return — list which returns are due this cycle and ask me which one to prepare."); } },
    { icon: UserSearch,     label: "Check a customer",  run: () => { setQuickOpen(false); send("Open Customer 360 — ask me for the customer name or BVN, then pull their identity, accounts, screening status, and any open cases."); } },
    { icon: FileSignature,  label: "File an STR",       run: () => { setQuickOpen(false); send("Help me file a Suspicious Transaction Report. Ask which case or transaction it relates to, then draft the NFIU narrative and log a case event."); } },
    { icon: AlertTriangle,  label: "Review an alert",   run: () => { setQuickOpen(false); send("Show my pending AML alerts ordered by priority, explain the top one, and recommend whether to approve, escalate, or close it."); } },
    { icon: SearchX,        label: "Find missing data", run: () => { setQuickOpen(false); send("Run a readiness check on my upcoming returns and list any missing or incomplete data fields I need to fix before filing."); } },
    { icon: BookOpen,       label: "Explain a rule",    run: () => { setQuickOpen(false); send("Explain a compliance rule — ask me which rule (CTR threshold, structuring, CAR, single obligor, etc.) and give a 3-sentence plain-English explanation with the citation."); } },
  ];

  // Close popover on outside click
  useEffect(() => {
    if (!quickOpen) return;
    const h = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest?.("[data-quick-popover]") && !t.closest?.("[data-quick-trigger]")) setQuickOpen(false);
    };
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, [quickOpen]);

  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen sticky top-0"
      style={{ width: 370, background: "var(--rail-bg)", borderRight: "1px solid var(--rail-border)" }}
    >
      <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--rail-border)]">
        <span className="text-[15px] font-semibold text-[var(--navy)] tracking-tight">RegCo</span>
        <div className="flex items-center gap-1 text-[var(--ink-3)]">
          <button onClick={() => navigate("/dashboard/settings")} title="Settings" className="p-1.5 rounded hover:bg-black/[0.04]"><SettingsIcon size={14} /></button>
        </div>
      </div>

      <div ref={streamRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 && (
          <div className="text-[12.5px] text-[var(--ink-3)] leading-[1.55] px-1">
            <p>Hi, how can I help today?</p>
            <p className="mt-3">Ask RegCo to screen a customer, explain an alert, draft an investigation summary, or pull velocity for an account. Use the + button for quick actions.</p>
          </div>
        )}

        {messages.map((m) => (<MessageBlock key={m.id} message={m} />))}

        {busy && (
          <div className="text-[11.5px] text-[var(--ink-3)] flex items-center gap-1.5 px-1 pt-2">
            <Loader2 size={11} className="animate-spin" />
            {status === "submitted" ? "Thinking…" : "Responding…"}
          </div>
        )}

        {!FUNCTION_URL && (
          <div className="text-[12px] text-red-600 border border-red-200 rounded p-2 bg-red-50">
            Agent backend not configured: VITE_SUPABASE_URL is missing.
          </div>
        )}

        {error && (
          <div className="text-[12px] text-red-600 border border-red-200 rounded p-2 bg-red-50">
            Something went wrong: {error.message}
          </div>
        )}
      </div>

      <div className="p-3 relative">
        {/* Quick-action popover, anchored above + button */}
        {quickOpen && (
          <div
            data-quick-popover
            className="absolute bottom-[calc(100%-4px)] left-3 right-3 bg-white border border-[var(--rail-border)] rounded-xl shadow-lg overflow-hidden z-30"
          >
            <div className="px-3 py-2 text-[10.5px] uppercase tracking-[0.15em] text-[var(--ink-3)] border-b border-[var(--rail-border)]">
              Quick actions
            </div>
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={a.run}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--ink)] hover:bg-black/[0.04] text-left"
                >
                  <Icon size={14} className="text-[var(--ink-3)]" />
                  {a.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px var(--rail-border)" }}>
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-2 pt-2">
              {attachments.map(a => (
                <div
                  key={a.id}
                  className={`inline-flex items-center gap-1.5 text-[11px] rounded-full px-2 py-1 border ${
                    a.error ? "text-red-600 border-red-200 bg-red-50"
                    : a.parsing ? "text-[var(--ink-3)] border-[var(--rail-border)] bg-black/[0.03]"
                    : "text-[var(--ink)] border-[var(--rail-border)] bg-black/[0.03]"
                  }`}
                  title={a.error || a.name}
                >
                  {a.parsing ? <Loader2 size={10} className="animate-spin" /> : <FileText size={10} />}
                  <span className="max-w-[140px] truncate">{a.name}</span>
                  {a.error
                    ? <span className="opacity-70">· {a.error}</span>
                    : !a.parsing && <span className="opacity-60">· {fmtSize(a.size)}</span>}
                  <button onClick={() => removeAttachment(a.id)} className="ml-0.5 opacity-60 hover:opacity-100"><X size={10} /></button>
                </div>
              ))}
            </div>
          )}

          <textarea
            ref={taRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={busy}
            placeholder="How can I help you?"
            className="w-full px-3 pt-3 pb-1 text-[13.5px] text-[var(--ink)] placeholder:text-[var(--ink-3)] bg-transparent outline-none resize-none leading-[1.45]"
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <input
              ref={fileRef}
              type="file"
              multiple
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => { addFiles(e.target.files); if (fileRef.current) fileRef.current.value = ""; }}
            />
            <button
              data-quick-trigger
              title="Quick actions"
              onClick={() => setQuickOpen(v => !v)}
              className={`p-1.5 rounded text-[var(--ink-3)] hover:bg-black/[0.04] transition-transform ${quickOpen ? "rotate-45" : ""}`}
            >
              <Plus size={15} />
            </button>
            <button
              onClick={() => send()}
              disabled={(!input.trim() && !validAtt.length) || busy || parsingAny}
              className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-[var(--ink)] text-white disabled:opacity-30"
            >
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--rail-border)]">
        <div className="w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[11px] font-medium">{userInitial}</div>
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
    // Hide huge attached-files block from the visible bubble
    const display = text.startsWith("[Attached files]")
      ? (() => {
          const idx = text.lastIndexOf("\n---\n");
          const tail = idx >= 0 ? text.slice(idx + 5).trim() : "";
          const fileCount = (text.match(/\n--- .+? ---\n/g) ?? []).length;
          return `${tail || "(no message)"}\n\n📎 ${fileCount} attached file${fileCount === 1 ? "" : "s"}`;
        })()
      : text;
    return (
      <div className="text-[13px] text-[var(--ink)] leading-[1.5] whitespace-pre-wrap">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-3)] block mb-1">You</span>
        {display}
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
  const [urls, setUrls] = useState<Record<string, string> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [override, setOverride] = useState(false);

  const approve = async () => {
    setState("working");
    setErrorMsg(null);
    try {
      if (toolName === "request_account_freeze" && output.action_id) {
        await supabase.from("account_actions").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", output.action_id);
        setState("approved");
      } else if (toolName === "request_generate_return" && output.request_id) {
        await supabase.from("report_requests").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", output.request_id);
        const { data, error } = await supabase.functions.invoke("generate-return", { body: { request_id: output.request_id, override_readiness: override } });
        if (error) throw error;
        if (data?.ready === false && !override) {
          setOverride(true);
          setErrorMsg(`Missing: ${(data.readiness?.missing_fields ?? []).map((m: any) => m.field).join(", ") || "data"}. Approve again to override and generate anyway.`);
          setState("pending");
          return;
        }
        if (data?.urls) setUrls(data.urls);
        setState("approved");
      } else {
        setState("approved");
      }
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Failed");
      setState("pending");
    }
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

  if (state === "approved") {
    return (
      <div className="space-y-1">
        <p className="text-[11.5px] text-green-700 font-mono">✓ Approved</p>
        {urls && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(urls).map(([k, href]) => (
              <a key={k} href={href} target="_blank" rel="noreferrer" className="text-[11px] font-mono underline text-[var(--navy)]">
                ⬇ {k.replace("_url", "").toUpperCase()}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }
  if (state === "rejected") return <p className="text-[11.5px] text-[var(--ink-3)] font-mono">✕ Cancelled</p>;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <button onClick={approve} disabled={state === "working"} className="text-[11px] font-mono px-2 py-1 rounded bg-[var(--navy)] text-white hover:opacity-90 disabled:opacity-40">Approve</button>
        <button onClick={reject} disabled={state === "working"} className="text-[11px] font-mono px-2 py-1 rounded border border-[var(--rail-border)] text-[var(--ink)] hover:bg-black/[0.04] disabled:opacity-40">Cancel</button>
      </div>
      {errorMsg && <p className="text-[11px] font-mono text-red-700">{errorMsg}</p>}
    </div>
  );
}
