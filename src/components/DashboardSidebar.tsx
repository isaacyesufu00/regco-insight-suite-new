import { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard, FileText, FilePlus, Users, Activity,
  Shield, FileCheck, ClipboardCheck, Newspaper,
  Calendar, Settings, HelpCircle,
  PanelLeftClose, PanelLeft, LogOut, ShieldAlert, History, FileWarning
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import type { FeatureSet } from "@/config/featureTiers";

interface DashboardSidebarProps { companyName?: string | null; }

type NavItem = { path: string; label: string; icon: any; feature: keyof FeatureSet | null; exact?: boolean; group: string };

const ITEMS: NavItem[] = [
  { path: "/dashboard",                          label: "Overview",           icon: LayoutDashboard, feature: null,                       exact: true, group: "Workspace" },
  { path: "/dashboard/reports",                  label: "Reports",            icon: FileText,        feature: null,                                    group: "Reporting" },
  { path: "/dashboard/new-report",               label: "New report",         icon: FilePlus,        feature: "reportGeneration",                      group: "Reporting" },
  { path: "/dashboard/calendar",                 label: "Calendar",           icon: Calendar,        feature: null,                                    group: "Reporting" },
  { path: "/dashboard/customers",                label: "Customers",          icon: Users,           feature: "customerIntelligence",                  group: "Intelligence" },
  { path: "/dashboard/transactions",             label: "Monitoring",         icon: Activity,        feature: "transactionMonitor",                    group: "Intelligence" },
  { path: "/dashboard/screening",                label: "Screening",          icon: Shield,          feature: "sanctionsScreening",                    group: "Intelligence" },
  { path: "/dashboard/aml-rules",                 label: "Rules & alerts",     icon: ShieldAlert,     feature: "transactionMonitor",                    group: "Intelligence" },
  { path: "/dashboard/board-pack",               label: "Board pack",         icon: FileCheck,       feature: "boardPack",                             group: "Governance" },
  { path: "/dashboard/audit-tracker",            label: "Audit",              icon: ClipboardCheck,  feature: "auditTracker",                          group: "Governance" },
  { path: "/dashboard/audit-log",                  label: "Audit log",          icon: History,         feature: "auditTracker",                          group: "Governance" },
  { path: "/dashboard/nfiu-reports",               label: "NFIU reports",       icon: FileWarning,     feature: "auditTracker",                          group: "Governance" },
  { path: "/dashboard/regulatory-intelligence",  label: "Intelligence",       icon: Newspaper,       feature: "regulatoryIntelligence",                group: "Governance" },
  { path: "/dashboard/settings",                 label: "Settings",           icon: Settings,        feature: null,                                    group: "Account" },
  { path: "/dashboard/tutorial",                 label: "Help",               icon: HelpCircle,      feature: null,                                    group: "Account" },
];

export function DashboardSidebar({ companyName }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { institutionName, userName, userInitial } = useProfile();
  const { canAccess } = useFeatureAccess();

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("regco_sidebar_collapsed") === "true"; } catch { return false; }
  });
  useEffect(() => { try { localStorage.setItem("regco_sidebar_collapsed", String(collapsed)); } catch {} }, [collapsed]);

  const items = ITEMS.filter((i) => !i.feature || canAccess(i.feature));
  const groups = Array.from(new Set(items.map((i) => i.group)));

  const isActive = (item: NavItem) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const handleSignOut = async () => { await signOut(); navigate("/sign-in"); };
  const shownCompany = companyName || institutionName;

  return (
    <aside
      className="flex flex-col flex-shrink-0 sticky top-0"
      style={{
        width: collapsed ? 64 : 248,
        height: "100vh",
        background: "var(--paper)",
        borderRight: "1px solid rgba(13,13,13,0.08)",
        transition: "width 0.22s ease",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Wordmark */}
      <div className="flex items-center px-5 h-16 border-b border-ink-10 overflow-hidden">
        {collapsed ? (
          <span className="font-serif text-2xl text-ink">R</span>
        ) : (
          <span className="font-serif text-2xl text-ink whitespace-nowrap">
            Reg<span className="text-rust">Co</span>
          </span>
        )}
      </div>

      {/* Institution */}
      {!collapsed && shownCompany && (
        <div className="px-5 pt-5 pb-3 border-b border-ink-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">Institution</p>
          <p className="mt-1 text-[13.5px] text-ink truncate font-serif">{shownCompany}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {groups.map((group) => (
          <div key={group} className="mb-5">
            {!collapsed && (
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted px-3 mb-1.5">{group}</p>
            )}
            {items.filter((i) => i.group === group).map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  title={collapsed ? item.label : undefined}
                  className={`relative flex items-center ${collapsed ? "justify-center px-0" : "gap-3 px-3"} py-2 rounded-md text-[13.5px] transition-colors
                    ${active ? "text-ink bg-[var(--paper-2)]" : "text-ink-muted hover:text-ink hover:bg-[var(--paper-2)]/60"}`}
                >
                  {active && !collapsed && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-[var(--rust)]" />
                  )}
                  <Icon size={15} strokeWidth={1.6} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + collapse */}
      <div className="border-t border-ink-10 p-3">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-2"} py-2`}>
          <div className="w-7 h-7 rounded-full bg-ink text-[var(--paper)] flex items-center justify-center text-[12px] font-medium flex-shrink-0">
            {userInitial}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] text-ink truncate">{userName}</p>
                <p className="text-[10.5px] text-ink-muted">Compliance officer</p>
              </div>
              <button onClick={handleSignOut} title="Sign out" className="text-ink-muted hover:text-rust transition-colors p-1">
                <LogOut size={14} />
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setCollapsed((p) => !p)}
          title={collapsed ? "Expand" : "Collapse"}
          className={`mt-2 w-full flex items-center ${collapsed ? "justify-center" : "gap-2 px-2"} py-2 rounded-md text-[11.5px] text-ink-muted hover:text-ink hover:bg-[var(--paper-2)]/60 transition-colors`}
        >
          {collapsed ? <PanelLeft size={13} /> : (<><PanelLeftClose size={13} /><span>Collapse</span></>)}
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
