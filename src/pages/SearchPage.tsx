import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import WorkerCard from "@/components/WorkerCard";
import { serviceCategories, fetchWorkers, type Worker } from "@/data/services";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const [query, setQuery] = useState("");
  const [selectedService, setSelectedService] = useState(initialService);
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

  const filtered = useMemo(() => {
    return workers.filter((w) => {
      const matchesService = !selectedService || w.service === selectedService;
      const matchesQuery = !query || w.name.toLowerCase().includes(query.toLowerCase()) || w.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));
      return matchesService && matchesQuery;
    });
  }, [query, selectedService, workers]);

  return (
    <div className="min-h-screen pb-20">
      {/* Search Header */}
      <div className="px-5 pt-12 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black italic tracking-tighter">Search</h1>
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs font-bold bg-secondary px-2 py-1 rounded-lg outline-none border-none cursor-pointer"
          >
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary border border-border">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search workers or skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Service Filters */}
      <div className="px-5 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedService("")}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              !selectedService ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            All
          </button>
          {serviceCategories.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedService(selectedService === s.id ? "" : s.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedService === s.id ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-5">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-3">{filtered.length} workers found</p>
            <div className="space-y-3">
              {filtered.map((w) => (
                <WorkerCard key={w.id} worker={w} />
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No workers found</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

