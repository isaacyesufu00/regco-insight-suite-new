import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowUp, LogOut, Calendar, Settings as SettingsIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";

type Entry =
  | { id: string; kind: "thought"; text: string }
  | { id: string; kind: "user";    text: string }
  | { id: string; kind: "output";  text: string };

type AiMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are RegCo Agent — a compliance copilot for Nigerian licensed financial institutions (CBN, NFIU, SCUML, NDIC, FIRS, PENCOM).
Keep replies to 2-4 short sentences. Be direct, professional, no emojis.
Speak in plain English. When asked to take an action (file a return, screen a customer, open a case), describe what you would do briefly.`;

const THINKING_STAGES = [
  "Reading your request",
  "Checking compliance context",
  "Compiling response",
];

export default function AgentRail() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [history, setHistory] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const entriesRef = useRef<Entry[]>([]);
  const historyRef = useRef<AiMessage[]>([]);
  const busyRef = useRef(false);
  const streamRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const { session, signOut } = useAuth();
  const { userInitial, userName, institutionName } = useProfile();
  const navigate = useNavigate();

  const pushEntry = useCallback((e: Entry) => {
    entriesRef.current = [...entriesRef.current, e];
    setEntries(entriesRef.current);
  }, []);

  const replaceLastThought = useCallback((text: string) => {
    const list = [...entriesRef.current];
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].kind === "thought") {
        list[i] = { ...list[i], text } as Entry;
        entriesRef.current = list;
        setEntries(list);
        return;
      }
    }
  }, []);

  const removeLastThoughtIfEmpty = useCallback(() => {
    const list = [...entriesRef.current];
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].kind === "thought") {
        list.splice(i, 1);
        entriesRef.current = list;
        setEntries(list);
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [entries]);

  useEffect(() => {
    const ta = taRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`; }
  }, [input]);

  const submit = useCallback(async (text: string) => {
    const message = text.trim();
    if (!message || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);

    pushEntry({ id: `u-${Date.now()}`, kind: "user", text: message });
    historyRef.current = [...historyRef.current, { role: "user", content: message }];
    setHistory(historyRef.current);
    setInput("");

    const thoughtId = `t-${Date.now()}`;
    pushEntry({ id: thoughtId, kind: "thought", text: `${THINKING_STAGES[0]}…` });

    let stage = 0;
    const interval = setInterval(() => {
      stage = Math.min(stage + 1, THINKING_STAGES.length - 1);
      replaceLastThought(`${THINKING_STAGES[stage]}…`);
    }, 700);

    try {
      if (!session?.access_token) throw new Error("Session expired. Please sign in again.");

      const { data, error } = await supabase.functions.invoke("agent-chat", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: {
          system: `${SYSTEM_PROMPT}\n\nInstitution: ${institutionName || "Unknown"}\nOfficer: ${userName || "Unknown"}`,
          messages: historyRef.current,
        },
      });

      clearInterval(interval);

      const payload = data as { content?: string; error?: string } | null;
      if (error || !payload?.content) {
        throw new Error(payload?.error || error?.message || "Agent unavailable");
      }

      const reply = payload.content
        .replace(/\[GENERATE_REPORT:[a-z_]+\]/g, "")
        .replace(/\[SHOW_DATA:[a-z_]+\]/g, "")
        .replace(/\[NEED_INPUT:[^\]]+\]/g, "")
        .trim();

      removeLastThoughtIfEmpty();
      pushEntry({ id: `o-${Date.now()}`, kind: "output", text: reply });
      historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
      setHistory(historyRef.current);
    } catch (err) {
      clearInterval(interval);
      removeLastThoughtIfEmpty();
      const msg = err instanceof Error ? err.message : "Connection error";
      pushEntry({ id: `e-${Date.now()}`, kind: "output", text: `Something went wrong: ${msg}` });
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, [pushEntry, replaceLastThought, removeLastThoughtIfEmpty, session?.access_token, institutionName, userName]);

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  const handleSignOut = async () => { await signOut(); navigate("/sign-in"); };

  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen sticky top-0"
      style={{
        width: 370,
        background: "var(--rail-bg)",
        borderRight: "1px solid var(--rail-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--rail-border)]">
        <span className="text-[15px] font-semibold text-[var(--navy)] tracking-tight">RegCo</span>
        <div className="flex items-center gap-1 text-[var(--ink-3)]">
          <button onClick={() => navigate("/dashboard/calendar")} title="Calendar" className="p-1.5 rounded hover:bg-black/[0.04]">
            <Calendar size={14} />
          </button>
          <button onClick={() => navigate("/dashboard/settings")} title="Settings" className="p-1.5 rounded hover:bg-black/[0.04]">
            <SettingsIcon size={14} />
          </button>
        </div>
      </div>

      {/* Ledger stream */}
      <div ref={streamRef} className="flex-1 overflow-y-auto px-5 py-4">
        {entries.length === 0 && (
          <div className="text-[12.5px] text-[var(--ink-3)] leading-[1.55] font-mono">
            <p>Idle.</p>
            <p className="mt-3">Ask RegCo to generate a return, screen a customer, review alerts, or open a case. Switch dashboards by saying things like "show me identity" or "switch to returns".</p>
          </div>
        )}
        <ul className="space-y-2.5">
          {entries.map((e) => {
            if (e.kind === "thought") {
              return (
                <li key={e.id} className="font-mono text-[12px] text-[var(--ink-3)] leading-[1.5]">
                  <span className="opacity-60">›</span> {e.text}
                </li>
              );
            }
            if (e.kind === "user") {
              return (
                <li key={e.id} className="text-[13px] text-[var(--ink)] leading-[1.5] pt-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-3)] block mb-1">You</span>
                  {e.text}
                </li>
              );
            }
            return (
              <li key={e.id} className="text-[13px] text-[var(--ink)] leading-[1.55] pt-2 pb-3 border-b border-[var(--rail-border)] whitespace-pre-wrap">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-3)] block mb-1">RegCo</span>
                {e.text}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Pinned composer */}
      <div className="p-3">
        <div
          className="bg-white rounded-lg overflow-hidden"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px var(--rail-border)" }}
        >
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
            <button
              title="Attach"
              className="p-1.5 rounded text-[var(--ink-3)] hover:bg-black/[0.04]"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => submit(input)}
              disabled={!input.trim() || busy}
              className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-[var(--navy)] text-white disabled:opacity-30"
            >
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* User footer */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--rail-border)]">
        <div className="w-6 h-6 rounded-full bg-[var(--navy)] text-white flex items-center justify-center text-[11px] font-medium">
          {userInitial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-[var(--ink)] truncate">{userName || "Officer"}</p>
        </div>
        <button onClick={handleSignOut} title="Sign out" className="p-1.5 text-[var(--ink-3)] hover:text-[var(--ink)]">
          <LogOut size={13} />
        </button>
      </div>
    </aside>
  );
}
