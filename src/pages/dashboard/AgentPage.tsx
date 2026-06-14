import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, PanelLeftClose, PanelLeft, Zap, Users, Shield, Newspaper,
  FileCheck, FileText, Settings, Paperclip, CornerDownLeft, Loader2,
  Sparkles, Mic, SlidersHorizontal,
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
type Conversation = { id: string; title: string; lastMessageAgo: string };

const SUGGESTED = [
  "Generate my CBN MFB return for this month",
  "Show me all critical AML flags",
  "Screen Adamu Musa against sanctions lists",
  "Draft an STR for the Emeka Okafor transaction",
  "Generate May 2026 compliance board pack",
  "What returns are due this week?",
];

const AgentSidebar = ({
  conversations, activeId, onSelect, onNew, collapsed, setCollapsed,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (c: Conversation) => void;
  onNew: () => void;
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { profile, institutionName } = useProfile();
  const userName = profile?.compliance_lead_name || profile?.full_name || "User";
  const userInitial = userName[0]?.toUpperCase() || "U";

  const navItems = [
    { icon: Zap, label: "Live Monitoring", path: "/dashboard/transactions" },
    { icon: Users, label: "Customer 360", path: "/dashboard/customers" },
    { icon: Shield, label: "Screening", path: "/dashboard/screening" },
    { icon: Newspaper, label: "Regulatory News", path: "/dashboard/regulatory-intelligence" },
    { icon: FileCheck, label: "Audit & Board", path: "/dashboard/board-pack" },
    { icon: FileText, label: "Reports", path: "/dashboard/reports" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div
      style={{
        width: collapsed ? 52 : 240,
        transition: "width 0.2s ease",
        background: "#111111",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: collapsed ? "16px 10px" : 16,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
        }}
      >
        {!collapsed ? (
          <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.3px" }}>RegCo</span>
        ) : (
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#000000" }}>R</span>
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4 }}>
            <PanelLeftClose size={15} />
          </button>
        )}
      </div>

      {!collapsed && (
        <div style={{ padding: 12 }}>
          <button
            onClick={onNew}
            style={{
              width: "100%",
              height: 34,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingLeft: 12,
            }}
          >
            <Plus size={13} />
            New conversation
          </button>
        </div>
      )}

      {!collapsed && (
        <div style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "10px 4px 6px" }}>
            Recent
          </p>
          {conversations.length === 0 && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "8px 4px", margin: 0 }}>No conversations yet.</p>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv)}
              style={{
                width: "100%",
                background: activeId === conv.id ? "rgba(255,255,255,0.07)" : "transparent",
                border: "none",
                borderRadius: 7,
                padding: "8px 10px",
                cursor: "pointer",
                textAlign: "left",
                marginBottom: 2,
              }}
            >
              <p style={{ fontSize: 13, color: "#FFFFFF", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.title}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>{conv.lastMessageAgo}</p>
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {!collapsed && (
          <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 4px 8px" }}>
            Workspace
          </p>
        )}
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : undefined}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              borderRadius: 7,
              padding: collapsed ? 8 : "7px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: collapsed ? 0 : 8,
              marginBottom: 2,
              justifyContent: collapsed ? "center" : "flex-start",
              color: "rgba(255,255,255,0.5)",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
            }}
          >
            <item.icon size={14} strokeWidth={1.8} />
            {!collapsed && <span style={{ fontSize: 13, fontWeight: 400 }}>{item.label}</span>}
          </button>
        ))}
      </div>

      <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#000000" }}>{userInitial}</span>
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden", flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {institutionName}
            </p>
          </div>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 12, display: "flex", justifyContent: "center" }}>
          <PanelLeft size={15} />
        </button>
      )}
    </div>
  );
};

const AgentInput = ({
  value, onChange, onSubmit, isLoading, showSuggestions,
}: {
  value: string;
  onChange: (s: string) => void;
  onSubmit: (s: string) => void;
  isLoading: boolean;
  showSuggestions: boolean;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      if (value.trim()) onSubmit(value.trim());
    }
  };

  return (
    <div style={{ padding: "16px 24px 20px" }}>
      {showSuggestions && !value && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, justifyContent: "center" }}>
          {SUGGESTED.map((p) => (
            <button
              key={p}
              onClick={() => onSubmit(p)}
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 999,
                padding: "5px 12px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)";
                (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Harvey-style input — light, floating, rounded card */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          maxWidth: 820,
          margin: "0 auto",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask RegCo Agent anything. Type @ to add sources."
          disabled={isLoading}
          rows={1}
          style={{
            width: "100%",
            padding: "18px 22px 14px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#FFFFFF",
            fontSize: 14,
            lineHeight: 1.6,
            resize: "none",
            fontFamily: "Inter, -apple-system, sans-serif",
            maxHeight: 200,
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px 12px" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { icon: Paperclip, label: "Files" },
              { icon: FileText, label: "Sources" },
              { icon: Sparkles, label: "Improve" },
            ].map((b) => (
              <button
                key={b.label}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  padding: "6px 10px",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12.5,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
              >
                <b.icon size={14} />
                <span>{b.label}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 6, borderRadius: 6 }}>
              <SlidersHorizontal size={14} />
            </button>
            <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 6, borderRadius: 6 }}>
              <Mic size={14} />
            </button>
            <button
              onClick={() => {
                if (value.trim() && !isLoading) onSubmit(value.trim());
              }}
              disabled={!value.trim() || isLoading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: value.trim() && !isLoading ? "#FFFFFF" : "rgba(255,255,255,0.1)",
                color: value.trim() && !isLoading ? "#000000" : "rgba(255,255,255,0.25)",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: value.trim() && !isLoading ? "pointer" : "default",
                transition: "all 0.15s",
                letterSpacing: "-0.1px",
                marginLeft: 4,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Working
                </>
              ) : (
                <>
                  Run <CornerDownLeft size={12} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 8 }}>
        RegCo Agent · Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
};

const MessageList = ({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: "#000000" }}>R</span>
        </div>
        <h1
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: "#FFFFFF",
            margin: "0 0 12px",
            letterSpacing: "-1px",
            fontFamily: "'Instrument Serif', Georgia, serif",
          }}
        >
          RegCo
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0, textAlign: "center", maxWidth: 380, lineHeight: 1.65 }}>
          Ask me to generate returns, review AML alerts, screen customers, draft STRs, or explain any compliance requirement.
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: 820, width: "100%", margin: "0 auto" }}
        >
          {msg.role === "assistant" ? (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", maxWidth: "85%" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#000000" }}>R</span>
              </div>
              <div style={{ flex: 1 }}>
                {msg.steps && msg.steps.length > 0 && (
                  <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                    {msg.steps.map((step, si) => (
                      <div key={si} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "7px 12px" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: step.done ? "#4ADE80" : "#FFFFFF", flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ background: "transparent", padding: "4px 0" }}>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                  {msg.actions && msg.actions.length > 0 && (
                    <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                      {msg.actions.map((action) => (
                        <button
                          key={action.label}
                          onClick={action.onClick}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#FFFFFF",
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 6,
                            padding: "6px 12px",
                            cursor: "pointer",
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", maxWidth: "75%" }}>
              <p style={{ fontSize: 14, color: "#FFFFFF", margin: 0, lineHeight: 1.65 }}>{msg.content}</p>
            </div>
          )}
        </motion.div>
      ))}

      {isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 10, alignItems: "flex-start", maxWidth: 820, width: "100%", margin: "0 auto" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#000000" }}>R</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            {[0, 0.15, 0.3].map((d, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }}
              />
            ))}
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

const AgentPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const ensureConversation = () => {
    if (activeId) return activeId;
    const id = Date.now().toString();
    const conv: Conversation = { id, title: "New conversation", lastMessageAgo: "just now" };
    setConversations((p) => [conv, ...p]);
    setActiveId(id);
    return id;
  };

  const createNew = () => {
    setActiveId(null);
    setMessages([]);
    setInput("");
  };

  const handleSubmit = async (text: string) => {
    const id = ensureConversation();
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsLoading(true);

    // Update conv title if first message
    setConversations((p) =>
      p.map((c) => (c.id === id ? { ...c, title: text.length > 42 ? text.slice(0, 42) + "…" : text, lastMessageAgo: "just now" } : c))
    );

    const lower = text.toLowerCase();

    await new Promise((r) => setTimeout(r, 900));

    let assistant: Message;

    if (/\b(generate|create|draft).*(return|report|cbn|nfiu|vat|paye|str|board)/.test(lower)) {
      assistant = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'll generate that return for you. Let me confirm the details before I begin — which reporting period, and which CBS file should I read from?",
        steps: [
          { label: "Identifying return type from your request", done: true },
          { label: "Checking for the latest CBS file upload", done: true },
        ],
        actions: [
          { label: "→ Open Create Report", onClick: () => navigate("/dashboard/new-report") },
          { label: "Tell me the period first", onClick: () => setInput("The period is ") },
        ],
      };
    } else if (/\b(alert|flag|aml)\b/.test(lower)) {
      assistant = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I can pull your pending AML flags from Live Monitoring. Want me to open the queue, or summarise the critical ones here first?",
        steps: [{ label: "Fetching pending AML flags from transaction monitor", done: true }],
        actions: [
          { label: "→ Open Live Monitoring", onClick: () => navigate("/dashboard/transactions") },
          { label: "Summarise critical flags", onClick: () => setInput("Summarise my critical AML flags") },
        ],
      };
    } else if (/\b(screen|sanction|pep)\b/.test(lower)) {
      assistant = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I can screen any customer or entity against all 5 sanctions lists and our Nigerian PEP database. What name should I screen?",
        actions: [{ label: "→ Open Screening", onClick: () => navigate("/dashboard/screening") }],
      };
    } else if (/\b(deadline|due|calendar|upcoming)\b/.test(lower)) {
      assistant = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Your upcoming deadlines are in the Compliance Calendar. I can open it for you, or list the next 5 here.",
        actions: [{ label: "→ Open Calendar", onClick: () => navigate("/dashboard/calendar") }],
      };
    } else {
      assistant = {
        id: (Date.now() + 1).toString(),
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
    <div style={{ display: "flex", height: "100vh", background: "#0A0A0A", overflow: "hidden", fontFamily: "Inter, -apple-system, sans-serif" }}>
      <AgentSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(c) => {
          setActiveId(c.id);
          setMessages([]); // demo: messages are not persisted across conversations
        }}
        onNew={createNew}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <div
          style={{
            height: 52,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            {activeId ? conversations.find((c) => c.id === activeId)?.title : "New conversation"}
          </span>
        </div>
        <MessageList messages={messages} isLoading={isLoading} />
        <AgentInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          showSuggestions={messages.length === 0}
        />
      </div>
    </div>
  );
};

export default AgentPage;
