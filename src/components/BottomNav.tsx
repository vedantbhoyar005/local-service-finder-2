import { Home, Search, Calendar, User, LayoutDashboard } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Hide BottomNav only on dashboard pages
  const isDashboard = location.pathname === "/worker" || 
                     location.pathname.startsWith("/worker/jobs") || 
                     location.pathname.startsWith("/worker/profile") ||
                     location.pathname.startsWith("/admin");

  if (isDashboard) {
    return null;
  }

  const tabs = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/bookings", icon: Calendar, label: "Bookings" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  // If user is worker or admin, add a shortcut to their dashboard
  if (user?.role === 'worker') {
    tabs.splice(3, 0, { path: "/worker", icon: LayoutDashboard, label: "Worker" });
  } else if (user?.role === 'admin') {
    tabs.splice(3, 0, { path: "/admin", icon: LayoutDashboard, label: "Admin" });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.slice(0, 5).map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
