import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bell,
  LogOut,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  Search,
  Package,
  ShoppingBag,
} from "lucide-react";

const ownerNav = [
  { label: "Dashboard", path: "/owner/dashboard", icon: LayoutDashboard },
  { label: "My Contracts", path: "/owner/contracts", icon: FileText },
  { label: "Proposals", path: "/owner/proposals", icon: MessageSquare },
  { label: "Settings", path: "/settings", icon: Settings },
];

const mfrNav = [
  {
    label: "Dashboard",
    path: "/manufacturer/dashboard",
    icon: LayoutDashboard,
  },
  { label: "Browse Licenses", path: "/manufacturer/browse", icon: Search },
  {
    label: "My Proposals",
    path: "/manufacturer/proposals",
    icon: MessageSquare,
  },
  { label: "My Products", path: "/manufacturer/products", icon: Package },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const nav = user?.role === "owner" ? ownerNav : mfrNav;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold tracking-tight">
              <span className="text-gradient">IP</span>Chain
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const active =
                  location.pathname === item.path ||
                  location.pathname.startsWith(item.path + "/");
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
                {user?.name?.[0] || "U"}
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                  {user?.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
