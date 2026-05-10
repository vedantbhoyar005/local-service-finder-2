import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Briefcase, Phone, MessageCircle, Shield, Loader2 } from "lucide-react";
import { fetchWorkerById, serviceCategories, fetchWorkerReviews, type Worker } from "@/data/services";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchWorkerById(id),
      fetchWorkerReviews(id)
    ]).then(([workerData, reviewsData]) => {
      setWorker(workerData);
      setReviews(reviewsData);
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

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Worker not found</p>
      </div>
    );
  }

  const service = serviceCategories.find((s) => s.id === worker.service);

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <div className="gradient-primary px-5 pt-12 pb-16 rounded-b-3xl relative">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-6">
          <ArrowLeft className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
              {worker.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground">{worker.name}</h1>
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground capitalize">{service?.name}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="text-sm font-semibold">{worker.rating}</span>
                  <span className="text-xs text-muted-foreground">({worker.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="text-center p-3 rounded-xl bg-secondary">
              <Briefcase className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-sm font-bold text-foreground">{worker.completedJobs}</p>
              <p className="text-[10px] text-muted-foreground">Jobs Done</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary">
              <Clock className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-sm font-bold text-foreground">{worker.experience}</p>
              <p className="text-[10px] text-muted-foreground">Experience</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary">
              <MapPin className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-sm font-bold text-foreground">{worker.distance}</p>
              <p className="text-[10px] text-muted-foreground">Away</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-5">
          <h2 className="font-semibold text-foreground mb-3">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Recent Reviews</h2>
            <span className="text-xs text-muted-foreground">{reviews.length} total</span>
          </div>
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r._id} className="p-4 rounded-xl bg-secondary">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                        {r.user?.name?.charAt(0) || "U"}
                      </div>
                      <span className="text-sm font-medium text-foreground">{r.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-warning text-warning" />
                      <span className="text-xs font-bold">{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground mb-1">{r.comment}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 bg-secondary/50 rounded-xl">
                <p className="text-xs text-muted-foreground">No reviews yet for this worker.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 px-5 py-3 bg-card border-t border-border">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex gap-2">
            <button className="w-11 h-11 rounded-xl border border-border flex items-center justify-center text-muted-foreground">
              <Phone className="w-5 h-5" />
            </button>
            <button className="w-11 h-11 rounded-xl border border-border flex items-center justify-center text-muted-foreground">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
          <Button
            onClick={() => navigate(`/booking/${worker.id}`)}
            className="flex-1 h-11 rounded-xl gradient-primary text-primary-foreground font-semibold"
            disabled={!worker.available}
          >
            {worker.available ? `Book Now · ${worker.price}` : "Currently Unavailable"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;

