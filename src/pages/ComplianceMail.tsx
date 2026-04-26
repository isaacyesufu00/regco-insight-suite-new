import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Mail as MailIcon, Pin, Search } from "lucide-react";

interface Message {
  id: string;
  sender_name: string;
  subject: string;
  body: string;
  category: string;
  is_read: boolean;
  is_pinned: boolean;
  created_at: string;
}

const CATEGORIES = ["All", "CBN Notice", "Reports Ready", "NFIU", "SCUML", "Errors"];

const categoryColor = (cat: string) => {
  switch (cat) {
    case "CBN Notice":
      return { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" };
    case "Reports Ready":
      return { bg: "#ECFDF5", color: "#047857", border: "#A7F3D0" };
    case "NFIU":
      return { bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" };
    case "SCUML":
      return { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" };
    case "Errors":
      return { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" };
    default:
      return { bg: "#F5F5F5", color: "#555", border: "#E0E0E0" };
  }
};

const formatRelative = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return d.toLocaleDateString();
};

const initialOf = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

const ComplianceMail = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("compliance_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setMessages(data as Message[]);
          if (data.length > 0) setActiveId(data[0].id);
        }
        setLoading(false);
      });

    const channel = supabase
      .channel("compliance-mail")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "compliance_messages", filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") setMessages((p) => [payload.new as Message, ...p]);
          else if (payload.eventType === "UPDATE") {
            const u = payload.new as Message;
            setMessages((p) => p.map((m) => (m.id === u.id ? u : m)));
          } else if (payload.eventType === "DELETE") {
            setMessages((p) => p.filter((m) => m.id !== (payload.old as { id: string }).id));
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("compliance_messages").update({ is_read: true }).eq("id", id);
    setMessages((p) => p.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
  };

  const handleSelect = (m: Message) => {
    setActiveId(m.id);
    if (!m.is_read) markRead(m.id);
  };

  const filtered = messages.filter((m) => {
    if (filter !== "All" && m.category !== filter) return false;
    if (search && !`${m.subject} ${m.body} ${m.sender_name}`.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const active = messages.find((m) => m.id === activeId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#FF6200" }} />
      </div>
    );
  }

  const cardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid #EEEEEE",
    borderRadius: 14,
  };

  return (
    <div style={{ height: "calc(100vh - 88px)" }} className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-3">
      {/* Thread list */}
      <div style={{ ...cardStyle, overflow: "hidden" }} className="flex flex-col min-h-0">
        {/* Search + filters */}
        <div className="p-4 border-b" style={{ borderColor: "#F0F0F0" }}>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color="#AAAAAA" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mail…"
              style={{
                width: "100%",
                background: "#F8F8F8",
                border: "1px solid #EEEEEE",
                borderRadius: 10,
                padding: "8px 12px 8px 32px",
                fontSize: 13,
                color: "#0A0A0A",
                outline: "none",
              }}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => {
              const active = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 500,
                    background: active ? "#0A0A0A" : "#F5F5F5",
                    color: active ? "#FFFFFF" : "#555555",
                    border: "1px solid",
                    borderColor: active ? "#0A0A0A" : "#E8E8E8",
                    transition: "all 0.15s",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Threads */}
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-6">
              <MailIcon className="mx-auto mb-3" size={32} color="#CCCCCC" />
              <p style={{ fontSize: 13, color: "#888" }}>No messages</p>
            </div>
          ) : (
            filtered.map((m) => {
              const isActive = m.id === activeId;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m)}
                  className="w-full text-left transition-colors"
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #F8F8F8",
                    background: isActive ? "#FFF7ED" : "transparent",
                    borderLeft: isActive ? "3px solid #FF6200" : "3px solid transparent",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #FF9A00 0%, #FF3D00 100%)",
                        color: "#FFFFFF",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {initialOf(m.sender_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="truncate"
                          style={{
                            fontSize: 14,
                            fontWeight: m.is_read ? 500 : 700,
                            color: "#0A0A0A",
                          }}
                        >
                          {m.sender_name}
                        </p>
                        <span style={{ fontSize: 11, color: "#AAAAAA", flexShrink: 0 }}>
                          {formatRelative(m.created_at)}
                        </span>
                      </div>
                      <p
                        className="truncate mt-0.5"
                        style={{
                          fontSize: 13,
                          fontWeight: m.is_read ? 400 : 600,
                          color: m.is_read ? "#555555" : "#0A0A0A",
                        }}
                      >
                        {m.subject}
                      </p>
                      <p
                        className="truncate mt-0.5"
                        style={{ fontSize: 12, color: "#999999" }}
                      >
                        {m.body}
                      </p>
                    </div>
                    {!m.is_read && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#FF6200",
                          flexShrink: 0,
                          marginTop: 6,
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Viewer */}
      <div style={{ ...cardStyle, overflow: "hidden" }} className="flex flex-col min-h-0">
        {active ? (
          <>
            <div className="p-6 border-b" style={{ borderColor: "#F0F0F0" }}>
              <div className="flex items-center gap-2 mb-3">
                {(() => {
                  const c = categoryColor(active.category);
                  return (
                    <span
                      style={{
                        background: c.bg,
                        color: c.color,
                        border: `1px solid ${c.border}`,
                        borderRadius: 999,
                        padding: "3px 10px",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {active.category}
                    </span>
                  );
                })()}
                {active.is_pinned && <Pin size={14} color="#FF6200" />}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                {active.subject}
              </h2>
              <div className="flex items-center gap-3 mt-3">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #FF9A00 0%, #FF3D00 100%)",
                    color: "#FFFFFF",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {initialOf(active.sender_name)}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{active.sender_name}</p>
                  <p style={{ fontSize: 12, color: "#888" }}>
                    {new Date(active.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <p
                style={{
                  fontSize: 15,
                  color: "#333333",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {active.body}
              </p>
            </div>
            <div className="p-4 border-t" style={{ borderColor: "#F0F0F0", background: "#FAFAFA" }}>
              <p style={{ fontSize: 12, color: "#888888" }}>
                Replies to compliance notices are handled outside RegCo. This view is read-only.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MailIcon size={40} color="#CCCCCC" />
            <p className="mt-3" style={{ fontSize: 14, color: "#888" }}>
              Select a message to read
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceMail;
