import { useState, useEffect } from "react";
import { Star, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const RatingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const workerName = location.state?.worker || "the worker";
  const serviceName = location.state?.service || "service";
  const workerId = location.state?.workerId;
  const bookingId = location.state?.bookingId || id;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-redirect back to bookings after submitting
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate("/bookings");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  const handleRateSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);

    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please log in to submit a review");
      navigate("/auth");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workerId: workerId || id,
          bookingId: bookingId,
          rating,
          comment: reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");

      setIsSubmitted(true);
      toast.success("Review submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="px-5 pt-12 pb-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Rate Service</h1>
          <p className="text-xs text-muted-foreground">Share your feedback</p>
        </div>
      </div>

      <div className="px-5 mt-6">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 fill-success text-success" />
            </div>
            <h2 className="text-xl font-bold mb-2">Thank You!</h2>
            <p className="text-sm text-muted-foreground text-center">Your rating for {workerName} has been submitted.</p>
          </div>
        ) : (
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold font-heading">How was your experience?</h2>
              <p className="text-sm text-muted-foreground/80">Rate your {serviceName.toLowerCase()} service with {workerName}</p>
            </div>

            <div className="flex items-center justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      (hoverRating || rating) >= star
                        ? "fill-primary text-primary drop-shadow-[0_2px_10px_rgba(var(--primary),0.3)]"
                        : "fill-muted text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="w-full space-y-2">
              <label className="text-xs font-semibold text-foreground ml-1 block">Write a review (optional)</label>
              <Textarea
                placeholder="Share more about your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="resize-none h-32 rounded-2xl bg-secondary border-none placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/50 text-sm"
              />
            </div>

            <Button
              className="w-full h-12 rounded-xl font-semibold shadow-lg shadow-primary/25 disabled:shadow-none"
              onClick={handleRateSubmit}
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingPage;

