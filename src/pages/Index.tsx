import { useState, useEffect } from "react";
import { MapPin, Bell, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "@/components/ServiceCard";
import WorkerCard from "@/components/WorkerCard";
import { serviceCategories, fetchWorkers, type Worker } from "@/data/services";

const Index = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Delhi");

  const cities = ["Delhi", "Mumbai", "Bangalore", "Pune", "Chennai", "Kolkata", "Hyderabad"];

  useEffect(() => {
    setIsLoading(true);
    fetchWorkers(selectedCity).then((data) => {
      setWorkers(data);
      setIsLoading(false);
    });
  }, [selectedCity]);

  const topWorkers = workers.filter((w) => w.available).slice(0, 4);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="gradient-primary px-5 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-primary-foreground/70 text-sm">Your Location</p>
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-primary-foreground font-semibold outline-none appearance-none cursor-pointer"
              >
                {cities.map(city => <option key={city} value={city} className="text-foreground">{city}, India</option>)}
              </select>
            </div>
          </div>
          <button className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Search Bar */}
        <button
          onClick={() => navigate("/search")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20"
        >
          <Search className="w-5 h-5 text-primary-foreground/60" />
          <span className="text-primary-foreground/60 text-sm">Search for services...</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="px-5 mt-6">
        <h2 className="text-lg font-bold text-foreground mb-3">All Services</h2>
        <div className="grid grid-cols-4 gap-3">
          {serviceCategories.map((s) => (
            <ServiceCard key={s.id} id={s.id} name={s.name} icon={s.icon} color={s.color} />
          ))}
        </div>
      </div>

      {/* New Workers Section */}
      {!isLoading && workers.some(w => w.isNew) && (
        <div className="mt-8">
          <div className="px-5 flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Newly Joined</h2>
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">FRESH TALENT</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2">
            {workers.filter(w => w.isNew).map((w) => (
              <div key={w.id} className="min-w-[200px]">
                <WorkerCard worker={w} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Workers */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">Top Workers Nearby</h2>
          <button onClick={() => navigate("/search")} className="text-sm font-medium text-primary">
            See All
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {topWorkers.map((w) => (
              <WorkerCard key={w.id} worker={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

