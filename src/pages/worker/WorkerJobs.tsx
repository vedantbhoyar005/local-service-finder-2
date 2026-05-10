import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Filter,
  User as UserIcon,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const WorkerJobs = () => {
  const [activeTab, setActiveTab] = useState<'confirmed' | 'pending' | 'completed'>('confirmed');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch('/api/bookings/worker', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success(`Booking ${newStatus === 'confirmed' ? 'accepted' : newStatus === 'rejected' ? 'declined' : newStatus}`);
      // Refresh bookings
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredJobs = bookings.filter(job => {
    if (activeTab === 'confirmed') return job.status === 'confirmed';
    if (activeTab === 'pending') return job.status === 'pending';
    if (activeTab === 'completed') return job.status === 'completed';
    return false;
  });

  return (
    <DashboardLayout title="My Assignments" role="worker">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex bg-secondary/50 p-1 rounded-xl">
          {(['confirmed', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize",
                activeTab === tab 
                  ? "bg-card text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === 'confirmed' ? 'Active' : tab}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">
            Showing {filteredJobs.length} {activeTab === 'confirmed' ? 'active' : activeTab} jobs
          </p>
          <button className="flex items-center gap-1 text-xs font-bold text-primary">
            <Filter className="w-3 h-3" />
            Recently Added
          </button>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job._id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                        "w-2 h-2 rounded-full",
                        job.status === 'confirmed' ? "bg-green-500" : 
                        job.status === 'pending' ? "bg-amber-500" : "bg-muted-foreground/30"
                      )} />
                      <h3 className="font-bold text-base">{job.service}</h3>
                    </div>
                    <span className="font-black text-primary">{job.totalAmount}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{job.date} at {job.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{job.user?.name || "Customer"} • {job.user?.phone || "No phone"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 flex gap-2">
                  {job.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(job._id, 'confirmed')}
                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-black shadow-sm"
                      >
                        Accept Job
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(job._id, 'rejected')}
                        className="px-4 border border-border py-2 rounded-xl text-xs font-bold text-muted-foreground"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {job.status === 'confirmed' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(job._id, 'completed')}
                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark Completed
                      </button>
                      <a 
                        href={`tel:${job.user?.phone || ""}`}
                        className="w-10 flex items-center justify-center border border-border rounded-xl text-primary"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </>
                  )}
                  {job.status === 'completed' && (
                    <button className="flex-1 border border-border py-2 rounded-xl text-xs font-bold text-muted-foreground flex items-center justify-center gap-2">
                       Job Completed
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div>
                <h4 className="font-bold text-muted-foreground">No {activeTab === 'confirmed' ? 'active' : activeTab} jobs</h4>
                <p className="text-xs text-muted-foreground/60 max-w-[200px] mt-1">
                  When you have new tasks, they will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerJobs;
