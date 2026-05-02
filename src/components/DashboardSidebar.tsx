import { Home, FileText, FilePlus, Settings, LogOut, Database, CalendarDays, LifeBuoy } from "lucide-react";
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
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "My Reports", url: "/dashboard/reports", icon: FileText },
  { title: "Create New Report", url: "/dashboard/new-report", icon: FilePlus },
  { title: "Data Sources", url: "/dashboard/data-sources", icon: Database },
  { title: "Calendar", url: "/dashboard/calendar", icon: CalendarDays },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Support", url: "/dashboard/support", icon: LifeBuoy },
];

interface DashboardSidebarProps {
  companyName?: string | null;
}

export function DashboardSidebar({ companyName }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
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

  return (
    <Sidebar collapsible="icon">
      <SidebarContent
        style={{
          background: "white",
          borderRight: "1px solid rgba(0,0,0,0.06)",
          width: collapsed ? undefined : 260,
        }}
      >
        {/* Institution card */}
        <div style={{ padding: 16 }}>
          <div
            style={{
              background: "#1D1D1F",
              borderRadius: 14,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#2D2D2F",
                color: "white",
                fontSize: 16,
              }}
            >
              ✦
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Team</p>
                <p
                  className="truncate"
                  style={{ fontSize: 15, fontWeight: 600, color: "white" }}
                >
                  {companyName || "RegCo"}
                </p>
              </div>
            )}
            {!collapsed && (
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>›</span>
            )}
          </div>
        </div>

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
                          gap: 10,
                          padding: "10px 16px",
                          borderRadius: 10,
                          margin: "2px 8px",
                          background: active ? "#F5F5F7" : "transparent",
                          border: active ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
                          textDecoration: "none",
                          transition: "all 0.2s",
                        }}
                        className="hover:!bg-[#F5F5F7]"
                        activeClassName=""
                      >
                        <item.icon
                          size={18}
                          strokeWidth={1.5}
                          style={{ color: active ? "#1D1D1F" : "#AAAAAA" }}
                        />
                        {!collapsed && (
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: active ? 600 : 400,
                              color: active ? "#1D1D1F" : "#888888",
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

      <SidebarFooter style={{ background: "white", borderRight: "1px solid rgba(0,0,0,0.06)" }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                margin: "2px 8px",
                borderRadius: 10,
                color: "#888888",
                fontSize: 14,
                cursor: "pointer",
              }}
              className="hover:!bg-red-50 hover:!text-red-500"
            >
              <LogOut size={18} strokeWidth={1.5} />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
