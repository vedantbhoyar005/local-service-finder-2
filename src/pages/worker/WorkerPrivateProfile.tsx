import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Shield, CheckCircle2, Star, Calendar, ArrowRight, Phone, Wrench, X, Plus, Loader2, MapPin, Briefcase, IndianRupee, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { serviceCategories } from "@/data/services";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const WorkerPrivateProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Predefined options
  const cities = ["Delhi", "Mumbai", "Bangalore", "Pune", "Chennai", "Kolkata", "Hyderabad"];
  const commonSkills = [
    "AC Gas", "AC Repair", "Bike Repair", "Cabinets", "Car Service", "Carpet", "Deep Cleaning", 
    "Doors", "Drainage", "Exterior", "Fan Installation", "Furniture", "Interior", "Inverter", 
    "Kitchen", "LED", "Leak Repair", "Pipe Fitting", "Pipe Laying", "Switchboard", "Tap Repair", 
    "Texture", "Water Tank", "Wiring"
  ];

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.city || "Delhi");
  const [service, setService] = useState(user?.service || "");
  const [experience, setExperience] = useState(user?.experience || "");
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate?.toString() || "");
  const [availability, setAvailability] = useState<string[]>(user?.availability || []);
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
      await updateUserProfile({ 
        name, phone, skills, city, service, experience, availability, 
        hourlyRate: hourlyRate ? Number(hourlyRate) : undefined 
      });
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

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Location / City</p>
                  {isEditing ? (
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-8 mt-1 rounded-md border border-input bg-background px-3 py-1 text-sm font-bold"
                    >
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <p className="font-bold text-sm">{user?.city || "Not provided"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Service Type</p>
                  {isEditing ? (
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full h-8 mt-1 rounded-md border border-input bg-background px-3 py-1 text-sm font-bold"
                    >
                      <option value="" disabled>Select a service</option>
                      {serviceCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  ) : (
                    <p className="font-bold text-sm capitalize">{user?.service || "Not provided"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Experience</p>
                  {isEditing ? (
                    <Input value={experience} onChange={(e) => setExperience(e.target.value)} className="h-8 mt-1 font-bold" placeholder="e.g. 5 Years" />
                  ) : (
                    <p className="font-bold text-sm">{user?.experience || "Not provided"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Hourly Rate (₹)</p>
                  {isEditing ? (
                    <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="h-8 mt-1 font-bold" placeholder="e.g. 500" />
                  ) : (
                    <p className="font-bold text-sm">{user?.hourlyRate ? `₹${user.hourlyRate}/hr` : "Not set"}</p>
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
                 <select
                   value={newSkill}
                   onChange={(e) => setNewSkill(e.target.value)}
                   className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                 >
                   <option value="" disabled>Select a skill to add</option>
                   {commonSkills.map(skill => (
                     <option key={skill} value={skill} disabled={skills.includes(skill)}>
                       {skill}
                     </option>
                   ))}
                 </select>
                 <Button onClick={handleAddSkill} size="icon" className="h-9 w-9 shrink-0" disabled={!newSkill}>
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
                <p className="text-lg font-black italic">{user?.rating || "0.0"}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Global Rating ({user?.reviewCount || 0})</p>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-secondary/50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-primary mb-1" />
                <p className="text-lg font-black italic">{user?.completedJobs || 0}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Jobs Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section for Worker */}
        <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
           <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground border-b pb-2 flex items-center justify-between">
             <span>Recent Reviews</span>
             <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{user?.reviewCount || 0}</span>
           </h3>
           <div className="space-y-3">
             <ReviewsList workerId={user?.id} />
           </div>
        </div>

        {/* Availability Schedule */}
        <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
           <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground border-b pb-2 flex items-center gap-2">
             <Calendar className="w-4 h-4" /> Availability Schedule
           </h3>
           <div className="flex flex-wrap gap-2">
             {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
               const isAvailable = availability.includes(day);
               return (
                 <button
                   key={day}
                   disabled={!isEditing}
                   onClick={() => {
                     if (isAvailable) setAvailability(availability.filter(d => d !== day));
                     else setAvailability([...availability, day]);
                   }}
                   className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                     isAvailable 
                       ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" 
                       : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"
                   } ${!isEditing && "opacity-80 cursor-not-allowed"}`}
                 >
                   {day.slice(0, 3)}
                 </button>
               );
             })}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const ReviewsList = ({ workerId }: { workerId?: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!workerId) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/worker/${workerId}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [workerId]);

  if (isLoading) return <div className="text-center py-4 text-xs text-muted-foreground animate-pulse">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="text-center py-4 text-xs text-muted-foreground italic">No reviews yet</div>;

  return (
    <>
      {reviews.map((r) => (
        <div key={r._id} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                {r.user?.name?.charAt(0) || "U"}
              </div>
              <span className="text-xs font-bold">{r.user?.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-warning text-warning" />
              <span className="text-xs font-black">{r.rating}</span>
            </div>
          </div>
          <p className="text-xs text-foreground/80 line-clamp-3">{r.comment}</p>
          <p className="text-[10px] text-muted-foreground mt-2 font-medium">
            {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
          </p>
        </div>
      ))}
    </>
  );
};

export default WorkerPrivateProfile;

