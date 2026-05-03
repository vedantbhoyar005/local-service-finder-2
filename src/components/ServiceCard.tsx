import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

const ServiceCard = ({ id, name, icon: Icon, color }: ServiceCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/search?service=${id}`)}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border hover:shadow-md transition-all duration-200 active:scale-95"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: `hsl(${color} / 0.15)` }}
      >
        <Icon className="w-6 h-6" style={{ color: `hsl(${color})` }} />
      </div>
      <span className="text-xs font-medium text-foreground">{name}</span>
    </button>
  );
};

export default ServiceCard;
