import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Briefcase, 
  UserCircle, 
  ChevronLeft, 
  LogOut,
  Users,
  Settings,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationPanel from "./NotificationPanel";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  role: 'worker' | 'admin';
}

const DashboardLayout = ({ children, title, role }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const workerLinks = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/worker" },
    { title: "My Jobs", icon: Briefcase, path: "/worker/jobs" },
    { title: "Profile", icon: UserCircle, path: "/worker/profile" },
  ];

  const adminLinks = [
    { title: "Overview", icon: LayoutDashboard, path: "/admin" },
    { title: "Workers", icon: Users, path: "/admin/workers" },
    { title: "Services", icon: Settings, path: "/admin/services" },
  ];

  const links = role === 'admin' ? adminLinks : workerLinks;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-40 glass-card px-5 py-4 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/")}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setIsNotiOpen(!isNotiOpen)}
            className="relative w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          <NotificationPanel 
            isOpen={isNotiOpen} 
            onClose={() => setIsNotiOpen(false)} 
            onUnreadCountChange={setUnreadCount}
          />

          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            {user?.name.charAt(0)}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-5 pt-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation for Dashboard */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-card border-t border-border px-6 py-3 flex items-center justify-between z-20">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon className={cn("w-6 h-6", isActive && "fill-primary/10")} />
              <span className="text-[10px] font-medium">{link.title}</span>
            </button>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardLayout;
