import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'worker' | 'admin';
  phone?: string;
  avatar?: string;
  service?: string;
  experience?: string;
  skills?: string[];
  city?: string;
  bio?: string;
  hourlyRate?: number;
  availability?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logIn: (email: string, password: string, role?: 'user' | 'worker' | 'admin') => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: 'user' | 'worker' | 'admin', service?: string, experience?: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch current user if token exists
  const loadUser = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Session expired");
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("auth_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logIn = async (email: string, password: string, selectedRole?: 'user' | 'worker' | 'admin') => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to login");

      localStorage.setItem("auth_token", data.token);
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        service: data.service,
        experience: data.experience,
        skills: data.skills,
        city: data.city,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        availability: data.availability,
        phone: data.phone,
        avatar: data.avatar
      });
      toast.success(`Welcome back, ${data.role}!`);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, selectedRole?: 'user' | 'worker' | 'admin', service?: string, experience?: string, city?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: selectedRole || 'user', service, experience, city })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to sign up");

      localStorage.setItem("auth_token", data.token);
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        service: data.service,
        experience: data.experience,
        skills: data.skills,
        city: data.city,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        availability: data.availability,
        phone: data.phone,
        avatar: data.avatar
      });
      toast.success(`Account created as ${data.role}!`);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    toast.success("Logged out successfully");
  };

  const updateUserProfile = async (data: Partial<User>) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      const updatedData = await res.json();
      
      if (!res.ok) throw new Error(updatedData.message || "Failed to update profile");
      
      setUser(updatedData);
      if (updatedData.token) localStorage.setItem("auth_token", updatedData.token);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logIn, signUp, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
