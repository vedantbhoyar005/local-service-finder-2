import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Power,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WorkerDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState([
    { title: "Total Earnings", value: "₹0", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { title: "Active Jobs", value: "0", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Rating", value: "4.5", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
  ]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch('/api/bookings/worker', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      
      setRecentJobs(data.slice(0, 3));
      
      const activeCount = data.filter((j: any) => j.status === 'confirmed').length;
      const completed = data.filter((j: any) => j.status === 'completed');
      const earnings = completed.reduce((acc: number, j: any) => {
        const amount = parseFloat(j.totalAmount.replace(/[^0-9.]/g, '')) || 0;
        return acc + amount;
      }, 0);

      setStats([
        { title: "Total Earnings", value: `₹${earnings.toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
        { title: "Active Jobs", value: activeCount.toString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { title: "Rating", value: (user?.rating || 4.5).toString(), icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
      ]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout title="Worker Hub" role="worker">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Availability Toggle - Premium Card */}
        <div className={`relative overflow-hidden transition-all duration-500 p-6 rounded-3xl shadow-xl ${
          isOnline ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
        }`}>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">{isOnline ? "You're Online" : "Currently Offline"}</h2>
              <p className={`text-sm font-medium ${isOnline ? 'text-primary-foreground/80' : 'text-muted-foreground/60'}`}>
                {isOnline ? "Tap to pause receiving new jobs" : "Toggle to start accepting bookings"}
              </p>
            </div>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                isOnline ? 'bg-white text-primary' : 'bg-primary text-primary-foreground'
              }`}
            >
              <Power className="w-7 h-7" />
            </button>
          </div>
          
          <div className="mt-6 flex items-center gap-3">
             <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 ${isOnline ? 'border-primary' : 'border-background'} bg-muted/20 flex items-center justify-center text-[10px] font-bold overflow-hidden`}>
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
             </div>
             <p className="text-[11px] font-bold uppercase tracking-wider">
               {isOnline ? "Customers looking for your services nearby" : "Go online to see demand"}
             </p>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-card p-4 rounded-2xl border border-border flex flex-col items-center text-center shadow-sm hover:scale-105 transition-transform">
              <div className={`${stat.bg} ${stat.color} p-2 rounded-xl mb-2`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xl font-black">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">{stat.title}</span>
            </div>
          ))}
        </div>

        {/* Recent Jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight">Recent Assignments</h3>
            <button 
              onClick={() => navigate("/worker/jobs")}
              className="text-xs font-bold text-primary flex items-center"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div key={job._id} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between hover:border-primary/50 transition-all shadow-sm group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight">{job.service}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{job.user?.name || "Customer"} • {job.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-sm mb-1">{job.totalAmount}</div>
                    <div className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${
                      job.status === 'completed' ? "bg-green-100 text-green-700" : 
                      job.status === 'confirmed' ? "bg-blue-100 text-blue-700" : 
                      job.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {job.status === 'confirmed' ? 'active' : job.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-border rounded-2xl">
                <p className="text-xs text-muted-foreground">No recent assignments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
