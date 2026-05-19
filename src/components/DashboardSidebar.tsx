import { LayoutDashboard, FileText, FilePlus, Settings, LogOut, Database, Calendar, Mail, BookOpen, Activity } from "lucide-react";
import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  companyName?: string | null;
}

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/dashboard/reports", label: "My Reports", icon: FileText },
  { path: "/dashboard/new-report", label: "Create Report", icon: FilePlus },
  { path: "/dashboard/support", label: "Compliance Mail", icon: Mail, hasBadge: true },
  { path: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { path: "/dashboard/data-sources", label: "Data Sources", icon: Database },
  { path: "/dashboard/transactions", label: "Transactions", icon: Activity },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ companyName }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("compliance_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false)
      .then(({ count }) => setUnreadCount(count || 0));

    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setFullName(data?.full_name || null));
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  const initial = (fullName || user?.email || "R").charAt(0).toUpperCase();
  const displayName = fullName || user?.email?.split("@")[0] || "User";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent
        style={{
          background: "#FFFFFF",
          borderRight: "1px solid rgba(0,0,0,0.07)",
          padding: "20px 12px",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "4px 8px", marginBottom: 24 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.5px" }}>
            RegCo
          </span>
        </div>

        {/* Institution pill */}
        {!collapsed && (
          <div
            style={{
              background: "#F5F5F0",
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 20,
              border: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            <p style={{ fontSize: 10, color: "#9B9B9B", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
              Institution
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {companyName || "RegCo"}
            </p>
          </div>
        )}

        {/* MENU label */}
        {!collapsed && (
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 }}>
            MENU
          </p>
        )}

        {/* Nav items */}
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {navItems.map((item) => {
            const active = isActive(item.path, item.end);
            const Icon = item.icon;
            const badge = item.hasBadge && unreadCount > 0 ? unreadCount : null;
            return (
              <RouterNavLink
                key={item.path}
                to={item.path}
                end={item.end}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#0A0A0A" : "#6B6B6B",
                  background: active ? "#F5F5F0" : "transparent",
                  border: active ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
                  marginBottom: 2,
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={15} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!collapsed && badge !== null && (
                  <span
                    style={{
                      background: "#0A0A0A",
                      color: "#FFFFFF",
                      borderRadius: 999,
                      padding: "1px 6px",
                      fontSize: 10,
                      fontWeight: 700,
                      minWidth: 18,
                      textAlign: "center",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </RouterNavLink>
            );
          })}
        </nav>
      </SidebarContent>

      <SidebarFooter
        style={{
          background: "#FFFFFF",
          borderRight: "1px solid rgba(0,0,0,0.07)",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          padding: "12px 12px",
        }}
      >
        <RouterNavLink
          to="/dashboard/tutorial"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 8,
            textDecoration: "none",
            color: "#6B6B6B",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <BookOpen size={15} strokeWidth={1.8} />
          {!collapsed && "How to Use RegCo"}
        </RouterNavLink>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", marginTop: 4 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#0A0A0A",
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {displayName}
              </p>
              <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>Compliance Officer</p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            style={{
              padding: 6,
              borderRadius: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#9B9B9B",
              flexShrink: 0,
            }}
            aria-label="Sign out"
          >
            <LogOut size={15} strokeWidth={1.8} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
