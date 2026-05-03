import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BookingData {
  _id: string;
  worker: {
    _id: string;
    name: string;
    email: string;
    service: string;
  };
  service: string;
  date: string;
  time: string;
  location: string;
  status: string;
  paymentMethod: string;
  totalAmount: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratedBookings, setRatedBookings] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (error: any) {
        toast.error(error.message || "Could not load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleRateClick = (booking: BookingData) => {
    navigate(`/rating/${booking._id}`, {
      state: {
        worker: booking.worker?.name || "the worker",
        service: booking.service,
        workerId: booking.worker?._id,
        bookingId: booking._id,
      },
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage your bookings</p>
      </div>

      <div className="px-5 space-y-3">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No bookings yet</p>
            <Button onClick={() => navigate("/search")} variant="outline" className="mt-4">
              Find a Worker
            </Button>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {(b.worker?.name || "?").charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{b.worker?.name || "Worker"}</h3>
                    <p className="text-xs text-muted-foreground">{b.service}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[b.status] || ""}`}>
                  {b.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(b.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{b.time}</span>
                </div>
                <span className="ml-auto text-sm font-semibold text-primary">{b.totalAmount}</span>
              </div>
              {b.status === "completed" && !ratedBookings.has(b._id) && (
                <div className="mt-4 pt-3 border-t border-border flex justify-end">
                  <Button size="sm" variant="outline" className="w-full text-xs font-semibold h-8 rounded-lg border-primary text-primary hover:bg-primary/5" onClick={() => handleRateClick(b)}>
                    Rate Worker
                  </Button>
                </div>
              )}
              {b.status === "completed" && ratedBookings.has(b._id) && (
                <div className="mt-4 pt-3 border-t border-border flex justify-center text-xs text-success font-medium">
                  ★ You rated this worker
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingsPage;

