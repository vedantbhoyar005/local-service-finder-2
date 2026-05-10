import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Star,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AdminWorkerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'pending' | 'suspended' | 'rejected'>('all');
  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/workers');
      if (!res.ok) throw new Error("Failed to fetch workers");
      const data = await res.json();
      setWorkers(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/workers/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Worker status updated to ${newStatus}`);
      // Optimistically update the UI
      setWorkers(workers.map(w => w._id === id ? { ...w, status: newStatus } : w));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = (worker.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (worker.service || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || worker.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout title="Marketplace Management" role="admin">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search workers or services..." 
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex bg-secondary/30 p-1 rounded-xl overflow-x-auto scrollbar-none gap-1">
            {(['all', 'active', 'pending', 'suspended', 'rejected'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "flex-1 py-1.5 px-3 text-[10px] font-black rounded-lg transition-all capitalize whitespace-nowrap",
                  activeFilter === filter 
                    ? "bg-card text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Workers List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">
              Total {activeFilter} ({filteredWorkers.length})
            </h3>
          </div>

          <div className="grid gap-3">
            {isLoading ? (
              <div className="text-center py-10 text-muted-foreground text-sm font-medium">Loading workers...</div>
            ) : filteredWorkers.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm font-medium">No workers found based on filters.</div>
            ) : (
              filteredWorkers.map((worker) => (
                <div key={worker._id} className="bg-card border border-border p-4 rounded-2xl shadow-sm hover:border-primary/30 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary font-black text-lg">
                        {worker.name.charAt(0)}
                      </div>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center",
                        worker.status === 'active' ? "bg-green-500" : 
                        worker.status === 'pending' ? "bg-amber-500" : "bg-destructive"
                      )}>
                        {worker.status === 'active' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                        {worker.status === 'pending' && <Clock className="w-2.5 h-2.5 text-white" />}
                        {(worker.status === 'suspended' || worker.status === 'rejected') && <XCircle className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{worker.name}</h4>
                        <button className="text-muted-foreground p-1 rounded-lg hover:bg-secondary transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize font-medium">{worker.service || "Unspecified Service"} • {worker.experience || "No Experience info"}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-[10px] font-bold">New</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-bold">0 Jobs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {worker.status === 'pending' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                      <button 
                        onClick={() => handleUpdateStatus(worker._id, 'active')}
                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-[11px] font-black shadow-sm"
                      >
                        Approve Worker
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(worker._id, 'rejected')}
                        className="flex-1 border border-border py-2 rounded-xl text-[11px] font-bold text-destructive hover:bg-destructive/5"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {worker.status === 'active' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                      <button 
                        onClick={() => handleUpdateStatus(worker._id, 'suspended')}
                        className="w-full border border-border py-2 rounded-xl text-[11px] font-bold text-muted-foreground hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive transition-colors"
                      >
                        Suspend Worker
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminWorkerManagement;
