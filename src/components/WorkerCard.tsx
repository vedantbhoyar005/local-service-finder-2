import { Star, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Worker } from "@/data/services";

const WorkerCard = ({ worker }: { worker: Worker }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/workers/${worker.id}`)}
      className="w-full flex items-start gap-3 p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-all duration-200 text-left active:scale-[0.98]"
    >
      <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
        {worker.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{worker.name}</h3>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded capitalize shrink-0">
              {worker.service}
            </span>
            {worker.isNew && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-foreground shrink-0 animate-pulse">
                NEW
              </span>
            )}
          </div>
          {worker.available ? (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-success/10 text-success shrink-0">Online</span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">Offline</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            <span className="text-xs font-medium text-foreground">{worker.rating}</span>
            <span className="text-xs text-muted-foreground">({worker.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">{worker.distance}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{worker.experience} exp</span>
          </div>
          <span className="text-sm font-semibold text-primary">{worker.price}</span>
        </div>
      </div>
    </button>
  );
};

export default WorkerCard;
