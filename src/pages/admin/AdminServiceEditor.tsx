import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Move, 
  LayoutGrid,
  Settings2,
  ChevronRight
} from "lucide-react";
import { serviceCategories } from "@/data/services";
import { cn } from "@/lib/utils";

const AdminServiceEditor = () => {
  const [categories, setCategories] = useState(serviceCategories);

  return (
    <DashboardLayout title="Service Configuration" role="admin">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Categories</h3>
            <p className="text-xs text-muted-foreground font-medium">Manage marketplace service types</p>
          </div>
          <button className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between group shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-all cursor-move">
                  <Move className="w-4 h-4 text-muted-foreground/40" />
                </div>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <category.icon className="w-6 h-6" style={{ color: category.color }} />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{category.name}</h4>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-70">
                    ID: {category.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:border-destructive/30 hover:text-destructive transition-colors text-muted-foreground">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Settings Card */}
        <div className="bg-gradient-to-br from-card to-secondary/30 border border-border p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold">Marketplace Rules</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-card/50 p-3 rounded-xl border border-border/40">
              <span className="text-xs font-semibold">Base Commission Rate</span>
              <span className="text-sm font-black text-primary">15%</span>
            </div>
            <div className="flex justify-between items-center bg-card/50 p-3 rounded-xl border border-border/40">
              <span className="text-xs font-semibold">Min Worker Rating</span>
              <span className="text-sm font-black text-primary">3.5</span>
            </div>
          </div>
          
          <button className="w-full mt-5 py-3 text-xs font-black text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors rounded-xl">
             Configure Global Parameters
             <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminServiceEditor;
