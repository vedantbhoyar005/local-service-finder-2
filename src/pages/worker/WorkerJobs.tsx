import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const WorkerJobs = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed'>('active');

  const jobs = [
    { 
      id: 1, 
      service: "Tap Repair", 
      customer: "Sarah Smith", 
      location: "BTM Layout, Bangalore", 
      time: "12:45 PM", 
      status: "active", 
      price: "₹300",
      description: "Kitchen tap is leaking from the base. Needs washers replaced."
    },
    { 
      id: 2, 
      service: "Pipe Fitting", 
      customer: "Mike Ross", 
      location: "Indiranagar, Bangalore", 
      time: "03:00 PM", 
      status: "pending", 
      price: "₹800",
      description: "Installation of new bathroom fittings for a renovation project."
    },
    { 
      id: 3, 
      service: "Plumbing Leak", 
      customer: "John Doe", 
      location: "Koramangala, Bangalore", 
      time: "Yesterday", 
      status: "completed", 
      price: "₹450",
      description: "Main line leak repair near the water tank."
    },
  ];

  const filteredJobs = jobs.filter(job => job.status === activeTab);

  return (
    <DashboardLayout title="My Assignments" role="worker">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex bg-secondary/50 p-1 rounded-xl">
          {(['active', 'pending', 'completed'] as const).map((tab) => (
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
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">
            Showing {filteredJobs.length} {activeTab} jobs
          </p>
          <button className="flex items-center gap-1 text-xs font-bold text-primary">
            <Filter className="w-3 h-3" />
            Recently Added
          </button>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                        "w-2 h-2 rounded-full",
                        job.status === 'active' ? "bg-green-500" : 
                        job.status === 'pending' ? "bg-amber-500" : "bg-muted-foreground/30"
                      )} />
                      <h3 className="font-bold text-base">{job.service}</h3>
                    </div>
                    <span className="font-black text-primary">{job.price}</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{job.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <UserCircle className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{job.customer}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 flex gap-2">
                  {job.status === 'pending' && (
                    <>
                      <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-black shadow-sm">
                        Accept Job
                      </button>
                      <button className="px-4 border border-border py-2 rounded-xl text-xs font-bold text-muted-foreground">
                        Decline
                      </button>
                    </>
                  )}
                  {job.status === 'active' && (
                    <>
                      <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Mark Completed
                      </button>
                      <button className="w-10 flex items-center justify-center border border-border rounded-xl text-primary">
                        <Phone className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {job.status === 'completed' && (
                    <button className="flex-1 border border-border py-2 rounded-xl text-xs font-bold text-muted-foreground flex items-center justify-center gap-2">
                       View Receipt
                       <ChevronRight className="w-4 h-4" />
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
                <h4 className="font-bold text-muted-foreground">No {activeTab} jobs</h4>
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

// Placeholder icons if not already in scope
const UserCircle = (props: any) => (
  <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export default WorkerJobs;
