import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, X, Loader2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Notification {
  _id: string;
  type: 'new_booking' | 'booking_cancelled' | 'new_review';
  title: string;
  message: string;
  booking?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

const NotificationPanel = ({ isOpen, onClose, onUnreadCountChange }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
      
      const unreadCount = data.filter((n: Notification) => !n.read).length;
      if (onUnreadCountChange) onUnreadCountChange(unreadCount);
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Initial count check
  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, read: true } : n)
        );
        const newUnreadCount = notifications.filter(n => !n.read && n._id !== id).length;
        if (onUnreadCountChange) onUnreadCountChange(newUnreadCount);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) markAsRead(notification._id);
    
    if (notification.type === 'new_booking' || notification.type === 'booking_cancelled') {
      navigate("/worker/jobs");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-5 w-80 max-h-[80vh] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-top-4 duration-300">
      <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Notifications
        </h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 px-6 text-center">
            <p className="text-xs text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-muted/50",
                  !n.read && "bg-primary/5"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  n.type === 'new_booking' ? "bg-success/10 text-success" : 
                  n.type === 'booking_cancelled' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                )}>
                  {n.type === 'new_booking' ? <Calendar className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={cn("text-xs font-bold truncate", !n.read ? "text-foreground" : "text-muted-foreground")}>
                      {n.title}
                    </p>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full shrink-0"></span>}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-1">
                    {n.message}
                  </p>
                  <p className="text-[9px] text-muted-foreground font-medium">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border bg-secondary/10">
        <button 
          onClick={async () => {
            const token = localStorage.getItem("auth_token");
            try {
              const res = await fetch("/api/notifications/read-all", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
              });
              if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                if (onUnreadCountChange) onUnreadCountChange(0);
                toast.success("All caught up!");
              }
            } catch (error) {
              console.error("Error marking all read:", error);
            }
          }}
          className="w-full py-2 text-[10px] font-black uppercase tracking-wider text-primary hover:bg-primary/5 rounded-xl transition-colors"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
