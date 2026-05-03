import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Power
} from "lucide-react";

const WorkerDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);

  const stats = [
    { title: "Today's Earnings", value: "₹1,250", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { title: "Active Jobs", value: "3", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Rating", value: "4.9", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  const recentJobs = [
    { id: 1, service: "Plumbing Leak", customer: "John Doe", time: "10:30 AM", status: "completed", price: "₹450" },
    { id: 2, service: "Tap Repair", customer: "Sarah Smith", time: "12:45 PM", status: "in-progress", price: "₹300" },
    { id: 3, service: "Pipe Fitting", customer: "Mike Ross", time: "03:00 PM", status: "pending", price: "₹800" },
  ];

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
               {isOnline ? "3 Customers looking nearby" : "Go online to see demand"}
             </p>
          </div>

          {/* Abstract pattern background */}
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
            <h3 className="text-lg font-black tracking-tight">Active Assignments</h3>
            <button className="text-xs font-bold text-primary flex items-center">
              History <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentJobs.slice(0, 2).map((job) => (
              <div key={job.id} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between hover:border-primary/50 transition-all shadow-sm group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">{job.service}</h4>
                    <p className="text-xs text-muted-foreground font-medium">{job.customer} • {job.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm mb-1">{job.price}</div>
                  <div className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${
                    job.status === 'completed' ? "bg-green-100 text-green-700" : 
                    job.status === 'in-progress' ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                  }`}>
                    {job.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
