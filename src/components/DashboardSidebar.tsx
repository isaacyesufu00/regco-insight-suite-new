import { LayoutDashboard, FileText, FilePlus, Settings, LogOut, Database, Calendar, Newspaper, BookOpen, Activity, Users, Shield, FileCheck, ClipboardCheck } from "lucide-react";
import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import type { FeatureSet } from "@/config/featureTiers";
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

type NavItem = {
  path: string;
  label: string;
  icon: any;
  end?: boolean;
  hasBadge?: boolean;
  feature?: keyof FeatureSet | null;
};

const allNavItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true, feature: null },
  { path: "/dashboard/reports", label: "My Reports", icon: FileText, feature: null },
  { path: "/dashboard/new-report", label: "Create Report", icon: FilePlus, feature: "reportGeneration" },
  { path: "/dashboard/customers", label: "Customer 360", icon: Users, feature: "customerIntelligence" },
  { path: "/dashboard/transactions", label: "Transactions", icon: Activity, feature: "transactionMonitor" },
  { path: "/dashboard/screening", label: "Risk Screening", icon: Shield, feature: "sanctionsScreening" },
  { path: "/dashboard/board-pack", label: "Board Pack", icon: FileCheck, feature: "boardPack" },
  { path: "/dashboard/audit-tracker", label: "Audit Tracker", icon: ClipboardCheck, feature: "auditTracker" },
  { path: "/dashboard/regulatory-intelligence", label: "Regulatory Intel", icon: Newspaper, hasBadge: true, feature: "regulatoryIntelligence" },
  { path: "/dashboard/calendar", label: "Calendar", icon: Calendar, feature: null },
  { path: "/dashboard/data-sources", label: "Data Sources", icon: Database, feature: "dataIngestion" },
  { path: "/dashboard/settings", label: "Settings", icon: Settings, feature: null },
];

export function DashboardSidebar({ companyName }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const { institutionName, userName, userInitial } = useProfile();
  const { canAccess } = useFeatureAccess();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const navItems = allNavItems.filter((item) => !item.feature || canAccess(item.feature));

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: news } = await supabase
        .from("regulatory_news")
        .select("id")
        .order("published_at", { ascending: false })
        .limit(50);
      const ids = (news || []).map((n: any) => n.id);
      if (ids.length === 0) {
        setUnreadCount(0);
        return;
      }
      const { data: reads } = await supabase
        .from("news_read_status")
        .select("news_id")
        .eq("user_id", user.id)
        .in("news_id", ids);
      const readSet = new Set((reads || []).map((r: any) => r.news_id));
      setUnreadCount(ids.filter((id) => !readSet.has(id)).length);
    })();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  const initial = userInitial;
  const displayName = userName;
  const shownCompany = companyName || institutionName;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent
        style={{
          background: "#FFFFFF",
          borderRight: "1px solid rgba(0,0,0,0.07)",
          padding: collapsed ? "16px 6px" : "20px 12px",
          transition: "padding 0.2s ease",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? "4px 0" : "4px 8px",
            marginBottom: collapsed ? 18 : 24,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#0A0A0A",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: "-0.5px",
              }}
            >
              R
            </div>
          ) : (
            <span style={{ fontSize: 16, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.5px" }}>
              RegCo
            </span>
          )}
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
              {shownCompany || "RegCo"}
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
        <nav style={{ display: "flex", flexDirection: "column", gap: collapsed ? 4 : 0 }}>
          {navItems.map((item) => {
            const active = isActive(item.path, item.end);
            const Icon = item.icon;
            const badge = item.hasBadge && unreadCount > 0 ? unreadCount : null;
            return (
              <RouterNavLink
                key={item.path}
                to={item.path}
                end={item.end}
                title={collapsed ? item.label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: collapsed ? 0 : 10,
                  padding: collapsed ? "9px 0" : "8px 10px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#0A0A0A" : "#6B6B6B",
                  background: active ? "#F5F5F0" : "transparent",
                  border: active ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
                  marginBottom: collapsed ? 0 : 2,
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
              >
                <Icon size={collapsed ? 17 : 15} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
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
                {collapsed && badge !== null && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#DC2626",
                      border: "1.5px solid #FFFFFF",
                    }}
                  />
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
