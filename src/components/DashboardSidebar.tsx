import { Home, FileText, FilePlus, Settings, LogOut, Database, CalendarDays, LifeBuoy } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { RegCoLogo } from "@/components/RegCoLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-background">
      <SidebarContent className="bg-background">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-border">
          {collapsed ? (
            <div className="flex justify-center">
              <div className="w-7 h-7 bg-brand-gradient rounded-sm" />
            </div>
          ) : (
            <div>
              <RegCoLogo size={22} />
              {companyName && (
                <p className="mt-2 text-[12px] text-[#999] truncate">{companyName}</p>
              )}
            </div>
          )}
        </div>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#AAA] px-3 pt-4">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 rounded-md">
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="relative flex items-center gap-3 px-3 text-[14px] font-medium text-[#555] transition-colors"
                      activeClassName="!text-foreground !bg-[#F8F8F8] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-brand-gradient before:rounded-r"
                    >
                      <item.icon className="h-4 w-4" strokeWidth={1.5} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="h-10 rounded-md text-[14px] font-medium text-[#555] hover:text-foreground hover:bg-[#F8F8F8]"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
