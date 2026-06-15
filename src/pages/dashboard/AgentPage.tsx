import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search, PanelLeft, Home, Activity, FileText, Clock, Folder,
  Newspaper, ClipboardCheck, Settings, HelpCircle, ChevronDown,
  Paperclip, Database, Mic, SlidersHorizontal, ArrowUp, Share2,
  Shield,
} from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";

type Step = { label: string; done: boolean };
type Action = { label: string; onClick: () => void };
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  steps?: Step[];
  actions?: Action[];
};
type Conversation = { id: string; title: string; timeLabel: string };

/* -------- LEFT SIDEBAR -------- */
const AgentSidebar = ({
  institutionName,
  userInitial,
  conversations,
  activeId,
  onSelect,
  onNew,
}: {
  institutionName: string;
  userInitial: string;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (c: Conversation) => void;
  onNew: () => void;
}) => {
  const navigate = useNavigate();
  const navItems = [
    { icon: Home, label: "Agent", action: onNew },
    { icon: Activity, label: "Live Monitoring", action: () => navigate("/dashboard/transactions") },
    { icon: FileText, label: "Reports", action: () => navigate("/dashboard/reports") },
    { icon: Clock, label: "History", action: () => {} },
    { icon: Folder, label: "My Reports", action: () => navigate("/dashboard/reports") },
    { icon: Newspaper, label: "Regulatory News", action: () => navigate("/dashboard/regulatory-intelligence") },
    { icon: ClipboardCheck, label: "Audit", action: () => navigate("/dashboard/audit-tracker") },
  ];
  const bottomItems = [
    { icon: Settings, label: "Settings", action: () => navigate("/dashboard/settings") },
    { icon: HelpCircle, label: "Help", action: () => (window.location.href = "mailto:support@regco.com.ng") },
  ];

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 8px" }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: 6, background: "#0A0A0A",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: "#FFFFFF" }}>{userInitial}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "rgba(0,0,0,0.45)" }}>
            <Search size={15} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "rgba(0,0,0,0.45)" }}>
            <PanelLeft size={15} />
          </button>
        </div>
      </div>

      <div style={{ padding: "4px 16px 12px" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", margin: 0, letterSpacing: "-0.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {institutionName || "Your Institution"}
        </p>
      </div>

      <div style={{ padding: "0 12px 12px" }}>
        <button
          onClick={onNew}
          style={{
            width: "100%",
            height: 32,
            background: "transparent",
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 500,
            color: "#0A0A0A",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.04)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
        >
          Create
        </button>
      </div>

      <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 0 6px" }} />

      <nav style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
        {navItems.map((item, idx) => (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 10px",
              borderRadius: 7,
              background: idx === 0 ? "rgba(0,0,0,0.05)" : "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 13.5,
              color: idx === 0 ? "#0A0A0A" : "rgba(0,0,0,0.65)",
              fontFamily: "var(--font-sans)",
              textAlign: "left",
              marginBottom: 1,
              fontWeight: idx === 0 ? 500 : 400,
            }}
            onMouseEnter={(e) => {
              if (idx !== 0) {
                (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLElement).style.color = "#0A0A0A";
              }
            }}
            onMouseLeave={(e) => {
              if (idx !== 0) {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.65)";
              }
            }}
          >
            <item.icon size={15} strokeWidth={1.7} />
            <span>{item.label}</span>
          </button>
        ))}

        {conversations.length > 0 && (
          <>
            <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "14px 10px 6px", margin: 0 }}>
              Recent
            </p>
            {conversations.slice(0, 8).map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "6px 10px",
                  borderRadius: 7,
                  background: activeId === c.id ? "rgba(0,0,0,0.05)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12.5,
                  color: "rgba(0,0,0,0.7)",
                  fontFamily: "var(--font-sans)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginBottom: 1,
                }}
              >
                {c.title}
              </button>
            ))}
          </>
        )}
      </nav>

      <div style={{ padding: 8, borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        {bottomItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "7px 10px", borderRadius: 7, background: "transparent",
              border: "none", cursor: "pointer", fontSize: 13.5,
              color: "rgba(0,0,0,0.5)", fontFamily: "var(--font-sans)", marginBottom: 1,
              textAlign: "left",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.05)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <item.icon size={15} strokeWidth={1.7} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

/* -------- INPUT CARD -------- */
const InputCard = ({
  value, onChange, onSubmit, isLoading, compact,
}: {
  value: string;
  onChange: (s: string) => void;
  onSubmit: (s: string) => void;
  isLoading: boolean;
  compact?: boolean;
}) => {
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    taRef.current?.focus();
  }, []);
  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = "auto";
      taRef.current.style.height = `${Math.min(taRef.current.scrollHeight, 180)}px`;
    }
  }, [value]);

  const submit = () => {
    if (value.trim() && !isLoading) onSubmit(value.trim());
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 720,
        background: "#F4F3EE",
        border: "1px solid rgba(0,0,0,0.09)",
        borderRadius: 14,
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px 0" }}>
        <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "rgba(0,0,0,0.5)", fontFamily: "var(--font-sans)" }}>
          Regulator <ChevronDown size={13} />
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "rgba(0,0,0,0.5)", fontFamily: "var(--font-sans)" }}>
          Prompts <ChevronDown size={13} />
        </button>
      </div>

      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Ask RegCo Agent anything. Type @ to attach a CBS file."
        rows={compact ? 2 : 3}
        style={{
          width: "100%",
          padding: "10px 16px 6px",
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: 15,
          color: "#0A0A0A",
          fontFamily: "var(--font-sans)",
          resize: "none",
          lineHeight: 1.6,
          boxSizing: "border-box",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px 12px" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { icon: Paperclip, label: "Files" },
            { icon: Database, label: "Sources" },
          ].map((b) => (
            <button
              key={b.label}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, color: "rgba(0,0,0,0.55)", padding: "6px 10px",
                borderRadius: 6, fontFamily: "var(--font-sans)",
              }}
            >
              <b.icon size={14} />
              {b.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "rgba(0,0,0,0.45)" }}>
            <SlidersHorizontal size={14} />
          </button>
          <div style={{ width: 1, height: 16, background: "rgba(0,0,0,0.1)" }} />
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "rgba(0,0,0,0.45)" }}>
            <Mic size={14} />
          </button>
          <button
            onClick={submit}
            disabled={!value.trim() || isLoading}
            style={{
              background: value.trim() && !isLoading ? "#0A0A0A" : "rgba(0,0,0,0.08)",
              color: value.trim() && !isLoading ? "#FFFFFF" : "rgba(0,0,0,0.3)",
              border: "none",
              borderRadius: 7,
              padding: 7,
              cursor: value.trim() && !isLoading ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              marginLeft: 4,
            }}
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------- SOURCE CHIPS -------- */
const SOURCES = [
  { label: "CBS Vault", color: "#0A0A0A" },
  { label: "CBN Circulars", color: "#1E40AF" },
  { label: "NFIU Sanctions", color: "#DC2626" },
  { label: "Audit Trail", color: "#7C3AED" },
];

const SourceChips = () => (
  <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
    {SOURCES.map((s) => (
      <button
        key={s.label}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 10, padding: "8px 14px", cursor: "pointer",
          fontSize: 13, color: "rgba(0,0,0,0.7)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <span style={{ width: 14, height: 14, borderRadius: 4, background: s.color }} />
        {s.label}
        <span style={{ color: "rgba(0,0,0,0.35)", marginLeft: 4 }}>+</span>
      </button>
    ))}
  </div>
);

/* -------- HOME STATE -------- */
const HomeState = ({
  institutionName, inputValue, onInputChange, onSubmit, isLoading, conversations,
}: {
  institutionName: string;
  inputValue: string;
  onInputChange: (s: string) => void;
  onSubmit: (s: string) => void;
  isLoading: boolean;
  conversations: Conversation[];
}) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px", overflowY: "auto", background: "#FFFFFF" }}>
    <div style={{ width: "100%", maxWidth: 760, display: "flex", justifyContent: "flex-end", padding: "16px 0" }}>
      <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "rgba(0,0,0,0.5)", fontFamily: "var(--font-sans)" }}>
        <Share2 size={13} />
        Shared returns
      </button>
    </div>

    <div style={{ marginTop: 64, marginBottom: 28, textAlign: "center" }}>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(44px, 6vw, 68px)",
          fontWeight: 600,
          color: "#0A0A0A",
          letterSpacing: "-2px",
          margin: 0,
          lineHeight: 1,
        }}
      >
        RegCo
      </h1>
    </div>

    <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
      {[
        { icon: FileText, label: "Generate Return" },
        { icon: Shield, label: "Screen Customer" },
        { icon: Activity, label: "View Alerts" },
      ].map((a) => (
        <button
          key={a.label}
          onClick={() => onInputChange(a.label)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 999, padding: "8px 16px",
            fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.7)",
            cursor: "pointer", fontFamily: "var(--font-sans)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.3)";
            (e.currentTarget as HTMLElement).style.color = "#0A0A0A";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.12)";
            (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.7)";
          }}
        >
          <a.icon size={13} strokeWidth={1.8} />
          {a.label}
        </button>
      ))}
    </div>

    <InputCard value={inputValue} onChange={onInputChange} onSubmit={onSubmit} isLoading={isLoading} />
    <SourceChips />

    {conversations.length > 0 && (
      <div style={{ width: "100%", maxWidth: 720, marginTop: 96, paddingBottom: 48 }}>
        <p style={{ fontSize: 13, color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-sans)", margin: "0 0 12px" }}>Recent</p>
        {conversations.slice(0, 6).map((c) => (
          <div
            key={c.id}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <span style={{ fontSize: 14, color: "#0A0A0A", fontFamily: "var(--font-sans)" }}>{c.title}</span>
            <span style={{ fontSize: 13, color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-sans)" }}>{c.timeLabel}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* -------- CONVERSATION STATE -------- */
const ConversationState = ({
  messages, isLoading, inputValue, onInputChange, onSubmit, title,
}: {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  onInputChange: (s: string) => void;
  onSubmit: (s: string) => void;
  title: string;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", overflow: "hidden" }}>
      <div style={{ height: 52, borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", padding: "0 24px", flexShrink: 0 }}>
        <span style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", fontFamily: "var(--font-sans)" }}>{title}</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 8px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}
            >
              {msg.role === "user" ? (
                <div style={{ background: "#F0F0EE", borderRadius: 12, padding: "12px 16px", maxWidth: "75%" }}>
                  <p style={{ fontSize: 14, color: "#0A0A0A", margin: 0, lineHeight: 1.65, fontFamily: "var(--font-sans)" }}>{msg.content}</p>
                </div>
              ) : (
                <div style={{ maxWidth: "85%" }}>
                  {msg.steps?.map((s, si) => (
                    <motion.div
                      key={si}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: si * 0.1 }}
                      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.done ? "#16A34A" : "#0A0A0A", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", fontFamily: "var(--font-sans)" }}>{s.label}</span>
                    </motion.div>
                  ))}
                  <p style={{ fontSize: 15, color: "#0A0A0A", margin: 0, lineHeight: 1.75, fontFamily: "var(--font-sans)", whiteSpace: "pre-wrap" }}>{msg.content}</p>
                  {msg.actions && msg.actions.length > 0 && (
                    <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                      {msg.actions.map((a) => (
                        <button
                          key={a.label}
                          onClick={a.onClick}
                          style={{
                            fontSize: 13, fontWeight: 500, color: "#0A0A0A",
                            background: "#F4F3EE", border: "1px solid rgba(0,0,0,0.1)",
                            borderRadius: 6, padding: "6px 14px", cursor: "pointer",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <div style={{ display: "flex", gap: 5, padding: "8px 0" }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: "#0A0A0A" }}
                />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div style={{ padding: "16px 24px 24px", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <InputCard value={inputValue} onChange={onInputChange} onSubmit={onSubmit} isLoading={isLoading} compact />
      </div>
    </div>
  );
};

/* -------- PAGE -------- */
const AgentPage = () => {
  const navigate = useNavigate();
  const { profile, institutionName } = useProfile();
  const userName = profile?.compliance_lead_name || profile?.full_name || "User";
  const userInitial = userName[0]?.toUpperCase() || "U";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isInConversation = messages.length > 0;

  const createNew = () => {
    setActiveId(null);
    setMessages([]);
    setInput("");
  };

  const handleSubmit = async (text: string) => {
    let convId = activeId;
    if (!convId) {
      convId = Date.now().toString();
      const conv: Conversation = {
        id: convId,
        title: text.length > 48 ? text.slice(0, 48) + "…" : text,
        timeLabel: "Today",
      };
      setConversations((p) => [conv, ...p]);
      setActiveId(convId);
    } else {
      setConversations((p) =>
        p.map((c) => (c.id === convId ? { ...c, title: c.title === "New conversation" ? text.slice(0, 48) : c.title } : c))
      );
    }

    setMessages((p) => [...p, { id: `u-${Date.now()}`, role: "user", content: text }]);
    setInput("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 850));

    const lower = text.toLowerCase();
    let assistant: Message;

    if (/\b(generate|create|draft|file).*(return|report|cbn|nfiu|vat|paye|str|board)/.test(lower)) {
      assistant = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          "I'll generate that return for you. Confirm the reporting period and which CBS file I should read from, and I'll prepare a submission-ready filing.",
        steps: [
          { label: "Identifying return type from your request", done: true },
          { label: "Checking for the latest CBS file upload", done: true },
        ],
        actions: [
          { label: "Open Create Report", onClick: () => navigate("/dashboard/new-report") },
          { label: "Tell me the period", onClick: () => setInput("The period is ") },
        ],
      };
    } else if (/\b(alert|flag|aml)\b/.test(lower)) {
      assistant = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: "I can pull your pending AML flags from Live Monitoring. Want me to open the queue or summarise the critical ones here?",
        steps: [{ label: "Fetching pending AML flags from transaction monitor", done: true }],
        actions: [
          { label: "Open Live Monitoring", onClick: () => navigate("/dashboard/transactions") },
          { label: "Summarise critical flags", onClick: () => setInput("Summarise my critical AML flags") },
        ],
      };
    } else if (/\b(screen|sanction|pep)\b/.test(lower)) {
      assistant = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: "I can screen any customer or entity against all 5 sanctions lists and our Nigerian PEP database. What name should I screen?",
        actions: [{ label: "Open Screening", onClick: () => navigate("/dashboard/screening") }],
      };
    } else if (/\b(deadline|due|calendar|upcoming)\b/.test(lower)) {
      assistant = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: "Your upcoming deadlines are in the Compliance Calendar. I can open it or list the next 5 here.",
        actions: [{ label: "Open Calendar", onClick: () => navigate("/dashboard/calendar") }],
      };
    } else {
      assistant = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          "I'm RegCo Agent — your compliance copilot for CBN, NFIU, SCUML, NDIC, FIRS, and PENCOM obligations. Ask me to generate a return, screen a customer, review AML flags, draft an STR, or explain any Nigerian regulatory requirement.",
        actions: [
          { label: "Generate a return", onClick: () => setInput("Generate my CBN MFB return for this month") },
          { label: "Review AML flags", onClick: () => setInput("Show me all critical AML flags") },
        ],
      };
    }

    setMessages((p) => [...p, assistant]);
    setIsLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#FFFFFF",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}
    >
      <AgentSidebar
        institutionName={institutionName}
        userInitial={userInitial}
        conversations={conversations}
        activeId={activeId}
        onSelect={(c) => {
          setActiveId(c.id);
          setMessages([]);
        }}
        onNew={createNew}
      />

      <AnimatePresence mode="wait">
        {isInConversation ? (
          <motion.div
            key="conv"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
          >
            <ConversationState
              messages={messages}
              isLoading={isLoading}
              inputValue={input}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              title={conversations.find((c) => c.id === activeId)?.title || "New conversation"}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
          >
            <HomeState
              institutionName={institutionName}
              inputValue={input}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              conversations={conversations}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentPage;
