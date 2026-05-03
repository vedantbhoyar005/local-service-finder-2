import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2, Briefcase, Settings, MapPin } from "lucide-react";
import { serviceCategories } from "@/data/services";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<'user' | 'worker' | 'admin'>('user');
  const [service, setService] = useState("");
  const [experience, setExperience] = useState("");
  const [city, setCity] = useState("Delhi");
  const { logIn, signUp, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cities = ["Delhi", "Mumbai", "Bangalore", "Pune", "Chennai", "Kolkata", "Hyderabad"];

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === 'admin') navigate("/admin", { replace: true });
      else if (user.role === 'worker') navigate("/worker", { replace: true });
      else navigate(from === "/auth" ? "/" : from, { replace: true });
    }
  }, [user, isLoading, navigate, from]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    logIn(email, password, role);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(email, password, name, role, service, experience, city);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50/50 relative overflow-hidden">
      {/* Decorative Brand Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-3 transform transition-transform hover:rotate-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Tap-a-Task</h1>
            <p className="text-muted-foreground font-medium">Premium services at your fingertips</p>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-white/50 backdrop-blur-md border border-border rounded-2xl">
            <TabsTrigger 
              value="login" 
              className="rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold">Welcome Back</CardTitle>
                <CardDescription>Select your account type and continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Simplified & Premium Role Selection */}
                <div className="grid grid-cols-3 gap-3">
                  {(['user', 'worker', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                        role === r 
                        ? 'border-primary bg-primary/5 text-primary scale-[1.02] shadow-sm' 
                        : 'border-slate-100 bg-slate-50 text-muted-foreground hover:border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider mb-1">{r}</span>
                      {role === r && (
                        <CheckCircle2 className="w-3 h-3 absolute top-2 right-2 text-primary" />
                      )}
                    </button>
                  ))}
                </div>

                <TabsContent value="login" className="mt-0 focus-visible:outline-none">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold px-1">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" readonly className="font-semibold px-1">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl font-bold text-md mt-2 shadow-lg shadow-primary/20" disabled={isLoading}>
                      {isLoading ? "Please wait..." : "Continue"}
                      {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0 focus-visible:outline-none">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="font-semibold px-1">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          placeholder="John Doe"
                          className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="font-semibold px-1">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" readonly className="font-semibold px-1">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-city" className="font-semibold px-1">Location / City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                        <select 
                          id="signup-city"
                          className="w-full pl-10 h-11 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white transition-all outline-none text-sm font-medium"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        >
                          {cities.map(c => <option key={c} value={c}>{c}, India</option>)}
                        </select>
                      </div>
                    </div>

                    {role === 'worker' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="signup-service" className="font-semibold px-1">Service Type</Label>
                          <div className="relative">
                            <Settings className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                            <select
                              id="signup-service"
                              className="w-full pl-10 h-11 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white transition-all outline-none text-sm font-medium appearance-none"
                              value={service}
                              onChange={(e) => setService(e.target.value)}
                              required={role === 'worker'}
                            >
                              <option value="" disabled>Select a service</option>
                              {serviceCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-experience" className="font-semibold px-1">Experience</Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-experience"
                              placeholder="e.g. 5 Years"
                              className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                              value={experience}
                              onChange={(e) => setExperience(e.target.value)}
                              required={role === 'worker'}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <Button type="submit" className="w-full h-12 rounded-xl font-bold text-md mt-2 shadow-lg shadow-primary/20" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Account"}
                      {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </Tabs>
        
        <p className="text-center text-[11px] text-muted-foreground pt-4">
          By continuing, you agree to our <span className="font-bold text-primary cursor-pointer hover:underline">Terms of Service</span> and <span className="font-bold text-primary cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
