import { Home, FileText, PlusSquare, Mail, Calendar, Database, Settings, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardSidebarProps { companyName?: string | null; pendingCount?: number; unreadMail?: number; }
interface NavItem { label: string; to: string; icon: typeof Home; badgeKey?: "pending" | "unread"; end?: boolean; }

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: Home, end: true },
  { label: "My Reports", to: "/dashboard/reports", icon: FileText, badgeKey: "pending" },
  { label: "Create Report", to: "/dashboard/new-report", icon: PlusSquare },
  { label: "Compliance Mail", to: "/dashboard/mail", icon: Mail, badgeKey: "unread" },
  { label: "Calendar", to: "/dashboard/calendar", icon: Calendar },
  { label: "Data Sources", to: "/dashboard/data-sources", icon: Database },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ companyName, pendingCount = 0, unreadMail = 0 }: DashboardSidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => { await signOut(); navigate("/login"); };
  const isActive = (item: NavItem) => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
  const getBadge = (item: NavItem): number => { if (item.badgeKey === "pending") return pendingCount; if (item.badgeKey === "unread") return unreadMail; return 0; };

  return (
    <aside className="hidden lg:flex flex-col flex-shrink-0" style={{ width: 260, background: "#FFFFFF", borderRight: "1px solid rgba(0,0,0,0.08)", padding: "20px 16px" }}>
      <Link to="/dashboard" className="text-[18px] font-semibold text-[#1D1D1F] mb-1 px-3" style={{ backgroundImage: "none" }}>RegCo</Link>
      <p className="text-[13px] text-[#6E6E73] px-3 mb-6 truncate">{companyName || "Your Institution"}</p>

      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV.map((item) => {
          const active = isActive(item);
          const badge = getBadge(item);
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className="flex items-center gap-3 h-[40px] px-3 rounded-lg transition-colors" style={{ background: active ? "#F5F5F7" : "transparent", fontWeight: active ? 600 : 400, color: active ? "#1D1D1F" : "#6E6E73", fontSize: 15, backgroundImage: "none" }}>
              <Icon size={18} strokeWidth={1.5} />
              <span className="flex-1">{item.label}</span>
              {badge > 0 && <span className="text-[12px] font-medium text-white bg-[#0066CC] rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5">{badge}</span>}
            </Link>
          );
        })}
      </nav>

      <button onClick={handleSignOut} className="flex items-center gap-3 h-[40px] px-3 rounded-lg text-[15px] text-[#6E6E73] hover:text-[#FF3B30] hover:bg-[rgba(255,59,48,0.06)] transition-colors mt-2">
        <LogOut size={18} strokeWidth={1.5} /><span>Sign out</span>
      </button>
    </aside>
  );
}
