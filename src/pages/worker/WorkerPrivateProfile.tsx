import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Shield, CheckCircle2, Star, Calendar, ArrowRight, Phone, Wrench, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const WorkerPrivateProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({ name, phone, skills });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout title="My Profile" role="worker">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        {/* Profile Info Header */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm overflow-hidden relative">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-black text-3xl mb-4 ring-4 ring-background">
              {user?.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-black italic tracking-tight">{user?.name}</h2>
            <div className="flex items-center gap-1.5 mt-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              Verified Professional
            </div>
            <p className="text-sm text-muted-foreground mt-2 capitalize">{user?.service || "General Worker"}</p>
          </div>
          
          {/* Background decoration */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
               <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground">Account Details</h3>
               {!isEditing ? (
                 <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm" className="text-xs font-bold text-primary h-7">Edit Profile</Button>
               ) : (
                 <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving} size="sm" className="text-xs font-bold h-7">
                      {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="text-xs font-bold h-7">Cancel</Button>
                 </div>
               )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</p>
                  {isEditing ? (
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 mt-1 font-bold" />
                  ) : (
                    <p className="font-bold text-sm">{user?.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Email Address</p>
                  <p className="font-bold text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</p>
                  {isEditing ? (
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-8 mt-1 font-bold" placeholder="Add phone number" />
                  ) : (
                    <p className="font-bold text-sm">{user?.phone || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
             <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground border-b pb-2">My Skills</h3>
             
             {isEditing && (
               <div className="flex gap-2 mb-2">
                 <Input 
                   value={newSkill} 
                   onChange={(e) => setNewSkill(e.target.value)} 
                   placeholder="Add a skill (e.g. Pipe Repair)" 
                   className="h-9"
                   onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                 />
                 <Button onClick={handleAddSkill} size="icon" className="h-9 w-9 shrink-0">
                   <Plus className="w-4 h-4" />
                 </Button>
               </div>
             )}

             <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center gap-2">
                      {skill}
                      {isEditing && (
                        <button onClick={() => handleRemoveSkill(skill)} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">No skills added yet</p>
                )}
             </div>
          </div>

          <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
            <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground border-b pb-2">Professional Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 p-3 bg-secondary/50 rounded-xl">
                <Star className="w-5 h-5 text-warning mb-1" />
                <p className="text-lg font-black italic">4.9</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Global Rating</p>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-secondary/50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-primary mb-1" />
                <p className="text-lg font-black italic">342</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Jobs Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Settings */}
        <div className="bg-card p-5 rounded-2xl border border-border">
          <Button variant="outline" className="w-full justify-between h-12 rounded-xl mb-3">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-bold">Security Settings</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="outline" className="w-full justify-between h-12 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-bold">Availability Schedule</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerPrivateProfile;

