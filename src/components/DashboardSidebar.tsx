import { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard, FileText, FilePlus, Users, Activity,
  Shield, BarChart2, FileCheck, ClipboardCheck, Newspaper,
  Calendar, Settings, HelpCircle,
  PanelLeftClose, PanelLeft, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import type { FeatureSet } from "@/config/featureTiers";

interface DashboardSidebarProps {
  companyName?: string | null;
}

export function DashboardSidebar({ companyName }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { institutionName, userName, userInitial } = useProfile();
  const { canAccess } = useFeatureAccess();

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("regco_sidebar_collapsed") === "true"; }
    catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem("regco_sidebar_collapsed", String(collapsed)); }
    catch {}
  }, [collapsed]);

  const toggle = () => setCollapsed((p) => !p);

  const navItems: { path: string; label: string; icon: any; feature: keyof FeatureSet | null; exact?: boolean; isNew?: boolean }[] = ([
    { path: "/dashboard",                       label: "Dashboard",       icon: LayoutDashboard,  feature: null,                     exact: true },
    { path: "/dashboard/reports",               label: "My Reports",      icon: FileText,         feature: null },
    { path: "/dashboard/new-report",            label: "Create Report",   icon: FilePlus,         feature: "reportGeneration" },
    { path: "/dashboard/customers",             label: "Customer 360",    icon: Users,            feature: "customerIntelligence",   isNew: true },
    { path: "/dashboard/transactions",          label: "Transactions",    icon: Activity,         feature: "transactionMonitor" },
    { path: "/dashboard/screening",             label: "Risk Screening",  icon: Shield,           feature: "sanctionsScreening",     isNew: true },
    { path: "/dashboard/board-pack",            label: "Board Pack",      icon: FileCheck,        feature: "boardPack" },
    { path: "/dashboard/audit-tracker",         label: "Audit Tracker",   icon: ClipboardCheck,   feature: "auditTracker" },
    { path: "/dashboard/regulatory-intelligence", label: "Regulatory Intel", icon: Newspaper,     feature: "regulatoryIntelligence" },
    { path: "/dashboard/calendar",              label: "Calendar",        icon: Calendar,         feature: null },
    { path: "/dashboard/settings",              label: "Settings",        icon: Settings,         feature: null },
    { path: "/dashboard/tutorial",              label: "How to Use RegCo",icon: HelpCircle,       feature: null },
  ] as { path: string; label: string; icon: any; feature: keyof FeatureSet | null; exact?: boolean; isNew?: boolean }[]).filter((i) => !i.feature || canAccess(i.feature));

  const isActive = (item: { path: string; exact?: boolean }) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const shownCompany = companyName || institutionName;

  return (
    <aside
      style={{
        width: collapsed ? 56 : 220,
        minHeight: "100vh",
        background: "#FAFAF8",
        borderRight: "1px solid rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.22s ease",
        overflow: "hidden",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 12px" : "0 16px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          flexShrink: 0,
          overflow: "hidden",
          transition: "padding 0.22s ease",
        }}
      >
        {collapsed ? (
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: "#0A0A0A",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            color: "#FFFFFF", fontSize: 13, fontWeight: 800,
          }}>R</div>
        ) : (
          <span style={{ fontSize: 16, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.4px", whiteSpace: "nowrap" }}>
            RegCo
          </span>
        )}
      </div>

      {/* Institution pill */}
      {!collapsed && (
        <div style={{
          margin: "12px 10px 4px", padding: "8px 10px",
          background: "rgba(0,0,0,0.04)", borderRadius: 8, flexShrink: 0,
        }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
            INSTITUTION
          </p>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {shownCompany || "RegCo"}
          </p>
        </div>
      )}

      {!collapsed && (
        <p style={{ fontSize: 9, fontWeight: 700, color: "#9B9B9B", letterSpacing: "0.12em", padding: "12px 14px 4px", margin: 0 }}>
          MENU
        </p>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: collapsed ? "6px 6px" : "0 8px" }}>
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: collapsed ? 0 : 9,
                padding: collapsed ? "9px 0" : "8px 10px",
                borderRadius: 8,
                marginBottom: 1,
                background: active ? (collapsed ? "rgba(0,0,0,0.07)" : "#FFFFFF") : "transparent",
                boxShadow: active && !collapsed ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                textDecoration: "none",
                transition: "background 0.15s, box-shadow 0.15s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {active && !collapsed && (
                <div style={{
                  position: "absolute", left: 0, top: "20%", bottom: "20%",
                  width: 2, borderRadius: 999, background: "#0A0A0A",
                }} />
              )}
              <Icon size={15} strokeWidth={active ? 2.2 : 1.8} color={active ? "#0A0A0A" : "#6B6B6B"} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  color: active ? "#0A0A0A" : "#525252",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1,
                }}>
                  {item.label}
                </span>
              )}
              {!collapsed && item.isNew && (
                <span style={{
                  fontSize: 9, fontWeight: 700, background: "#0A0A0A",
                  color: "#FFFFFF", borderRadius: 999, padding: "1px 6px",
                  letterSpacing: "0.04em", flexShrink: 0,
                }}>NEW</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: user + collapse */}
      <div style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        padding: collapsed ? "8px 6px" : "8px",
        flexShrink: 0,
      }}>
        {/* User */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: collapsed ? 0 : 9,
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "6px 0" : "6px 8px",
          borderRadius: 8, marginBottom: 4,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", background: "#0A0A0A",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            color: "#FFFFFF", fontSize: 12, fontWeight: 700,
          }}>
            {userInitial}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userName}
              </p>
              <p style={{ fontSize: 10, color: "#9B9B9B", margin: 0 }}>Compliance Officer</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleSignOut}
              title="Sign out"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0, display: "flex", alignItems: "center", color: "#9B9B9B" }}
            >
              <LogOut size={14} />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            width: "100%", height: 32,
            display: "flex", alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 8,
            padding: collapsed ? 0 : "0 10px",
            borderRadius: 7, border: "none",
            background: "transparent", cursor: "pointer",
            transition: "background 0.15s", color: "#9B9B9B",
            fontSize: 12, fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {collapsed ? <PanelLeft size={14} /> : (<><PanelLeftClose size={14} /><span>Collapse</span></>)}
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
