import { Home, FileText, FilePlus, Settings, LogOut, Database, CalendarDays, Mail, GraduationCap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "My Reports", url: "/dashboard/reports", icon: FileText },
  { title: "Create Report", url: "/dashboard/new-report", icon: FilePlus },
  { title: "Compliance Mail", url: "/dashboard/support", icon: Mail },
  { title: "Calendar", url: "/dashboard/calendar", icon: CalendarDays },
  { title: "Data Sources", url: "/dashboard/data-sources", icon: Database },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  companyName?: string | null;
}

export function DashboardSidebar({ companyName }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (url: string) => {
    if (url === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(url);
  };

  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : "RC";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent
        style={{
          background: "#FAFAFA",
          borderRight: "1px solid rgba(0,0,0,0.07)",
          width: collapsed ? undefined : 252,
        }}
      >
        {/* Institution switcher card */}
        <div style={{ padding: "14px 14px 0" }}>
          <div
            className="hover:bg-[#2D2D2F] transition-colors cursor-pointer"
            style={{
              background: "#1D1D1F",
              borderRadius: 12,
              padding: "13px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 34, height: 34, borderRadius: "50%", background: "#2D2D2F", color: "white", fontSize: 15 }}
            >
              ✦
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Institution</p>
                <p className="truncate" style={{ fontSize: 14, fontWeight: 600, color: "white" }}>
                  {companyName || "RegCo"}
                </p>
              </div>
            )}
            {!collapsed && (
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>⇅</span>
            )}
          </div>
        </div>

        {/* Menu label */}
        {!collapsed && (
          <p style={{ fontSize: 10, color: "#BBBBBB", textTransform: "uppercase", letterSpacing: "0.08em", padding: "20px 18px 6px" }}>
            MENU
          </p>
        )}

        {/* Nav items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 11,
                          padding: "9px 12px",
                          borderRadius: 9,
                          margin: "2px 8px",
                          background: active ? "#FFFFFF" : "transparent",
                          border: active ? "1px solid rgba(0,0,0,0.09)" : "1px solid transparent",
                          boxShadow: active ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                          textDecoration: "none",
                          transition: "all 0.15s",
                        }}
                        className={active ? "" : "hover:!bg-[rgba(0,0,0,0.04)]"}
                        activeClassName=""
                      >
                        <item.icon
                          size={17}
                          strokeWidth={1.5}
                          style={{ color: active ? "#1D1D1F" : "#AAAAAA", transition: "color 0.15s" }}
                        />
                        {!collapsed && (
                          <span
                            className="flex-1"
                            style={{
                              fontSize: 13,
                              fontWeight: active ? 600 : 400,
                              color: active ? "#1D1D1F" : "#777777",
                              transition: "color 0.15s",
                            }}
                          >
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter style={{ background: "#FAFAFA", borderRight: "1px solid rgba(0,0,0,0.07)", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            className="flex items-center justify-center shrink-0"
            style={{ width: 32, height: 32, borderRadius: "50%", background: "#1D1D1F", color: "white", fontSize: 12, fontWeight: 600 }}
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize: 12, fontWeight: 600, color: "#333333" }}>{user?.email || "User"}</p>
              <p style={{ fontSize: 11, color: "#AAAAAA" }}>Compliance Officer</p>
            </div>
          )}
          <SidebarMenuButton
            onClick={handleSignOut}
            style={{ padding: 6, borderRadius: 8, cursor: "pointer", color: "#AAAAAA", flexShrink: 0 }}
            className="hover:!bg-red-50 hover:!text-red-500"
          >
            <LogOut size={16} strokeWidth={1.5} />
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
