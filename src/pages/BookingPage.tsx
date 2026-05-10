import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, Banknote, CheckCircle2, Loader2 } from "lucide-react";
import { fetchWorkerById, serviceCategories, type Worker } from "@/data/services";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [booked, setBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchWorkerById(id).then((data) => {
      setWorker(data);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!worker) return null;

  const service = serviceCategories.find((s) => s.id === worker.service);
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const handleConfirmBooking = async () => {
    if (!selectedTime) return;
    setIsSubmitting(true);

    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please log in to make a booking");
      navigate("/auth");
      return;
    }

    try {
      const selectedDateObj = dates[selectedDate];
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workerId: id,
          service: service?.name || worker.service,
          date: selectedDateObj.toISOString().split("T")[0],
          time: selectedTime,
          location: "123 Main Street, New Delhi, 110001",
          paymentMethod,
          totalAmount: worker.price,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      setBooked(true);
      toast.success("Booking created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (booked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-accent-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground text-center mb-2">
          {worker.name} will arrive at your location
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          {dates[selectedDate].toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })} at {selectedTime}
        </p>
        <Button onClick={() => navigate("/bookings")} className="w-full max-w-xs h-12 rounded-xl gradient-primary text-primary-foreground font-semibold">
          View My Bookings
        </Button>
        <button onClick={() => navigate("/")} className="mt-3 text-sm text-primary font-medium">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Book Service</h1>
        </div>

        {/* Worker Summary */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
            {worker.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{worker.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{service?.name} · {worker.price}</p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="px-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Select Date</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {dates.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(i)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl min-w-[60px] transition-colors ${
                selectedDate === i ? "gradient-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              <span className="text-[10px] font-medium opacity-70">{d.toLocaleDateString("en", { weekday: "short" })}</span>
              <span className="text-lg font-bold">{d.getDate()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Select Time</h2>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${
                selectedTime === t ? "gradient-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Service Location</h2>
        </div>
        <div className="p-4 rounded-xl bg-secondary">
          <p className="text-sm text-foreground font-medium">Home</p>
          <p className="text-xs text-muted-foreground mt-0.5">123 Main Street, New Delhi, 110001</p>
        </div>
      </div>

      {/* Payment */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Payment Method</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPaymentMethod("cash")}
            className={`flex-1 flex items-center gap-2 p-4 rounded-xl border transition-colors ${
              paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-border bg-card"
            }`}
          >
            <Banknote className={`w-5 h-5 ${paymentMethod === "cash" ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${paymentMethod === "cash" ? "text-primary" : "text-foreground"}`}>Cash</span>
          </button>
          <button
            onClick={() => setPaymentMethod("online")}
            className={`flex-1 flex items-center gap-2 p-4 rounded-xl border transition-colors ${
              paymentMethod === "online" ? "border-primary bg-primary/5" : "border-border bg-card"
            }`}
          >
            <CreditCard className={`w-5 h-5 ${paymentMethod === "online" ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${paymentMethod === "online" ? "text-primary" : "text-foreground"}`}>Online</span>
          </button>
        </div>
      </div>

      {/* Summary & Book */}
      <div className="fixed bottom-16 left-0 right-0 px-5 py-3 bg-card border-t border-border">
        <div className="flex items-center justify-between mb-3 max-w-lg mx-auto">
          <div>
            <p className="text-xs text-muted-foreground">Estimated Total</p>
            <p className="text-lg font-bold text-foreground">{worker.price}</p>
          </div>
          <Button
            onClick={handleConfirmBooking}
            disabled={!selectedTime || isSubmitting}
            className="h-12 px-8 rounded-xl gradient-primary text-primary-foreground font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
