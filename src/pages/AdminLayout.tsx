import { useEffect } from "react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import { Users, UserPlus, MessageSquare, Building2 } from "lucide-react";

const adminNav = [
  { label: "Clients", to: "/admin/clients", icon: Users },
  { label: "Onboard Client", to: "/admin/onboard", icon: UserPlus },
  { label: "Demo Requests", to: "/admin/demos", icon: MessageSquare },
];

const AdminLayout = () => {
  const { isAdmin, loading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/dashboard");
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <BackButton to="/dashboard" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <nav className="ml-8 flex gap-1">
            {adminNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
