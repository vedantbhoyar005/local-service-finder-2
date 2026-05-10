import DashboardLayout from "@/components/DashboardLayout";
import { 
  Users, 
  UserCheck, 
  MapPin, 
  TrendingUp, 
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Revenue", value: "₹45,200", change: "+12.5%", positive: true, icon: TrendingUp },
    { label: "Active Workers", value: "142", change: "+4.3%", positive: true, icon: UserCheck },
    { label: "Total Bookings", value: "892", change: "-2.1%", positive: false, icon: Users },
  ];

  const pendingApprovals = [
    { id: 1, name: "Karan Johar", service: "Plumber", location: "Mumbai", date: "Apr 15" },
    { id: 2, name: "Deepika P.", service: "Cleaner", location: "Bangalore", date: "Apr 16" },
    { id: 3, name: "Ranveer S.", service: "Electrician", location: "Delhi", date: "Apr 17" },
  ];

  return (
    <DashboardLayout title="Admin Portal" role="admin">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button className="flex-shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
            <Plus className="w-4 h-4" />
            Add Service
          </button>
          <button className="flex-shrink-0 flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
            <AlertCircle className="w-4 h-4" />
            Urgent Alerts
          </button>
          <button className="flex-shrink-0 flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
            <MapPin className="w-4 h-4" />
            Live Map
          </button>
        </div>

        {/* Stats Section */}
        <div className="space-y-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black">{stat.value}</h3>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
                <div className="mt-2 bg-secondary/50 p-2 rounded-xl inline-block">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Approvals */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
            <h3 className="font-bold">Pending Approvals</h3>
            <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">3 NEW</span>
          </div>
          <div className="divide-y divide-border">
            {pendingApprovals.map((worker) => (
              <div key={worker.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">{worker.name}</h4>
                  <p className="text-xs text-muted-foreground">{worker.service} • {worker.location}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-[10px] font-bold px-3 py-1 rounded-lg border border-border hover:bg-muted transition-colors">Details</button>
                  <button className="text-[10px] font-bold px-3 py-1 rounded-lg bg-primary text-primary-foreground shadow-sm">Approve</button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-3 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors border-t border-border">
            View All Marketplace Workers
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
