import { Wrench, Zap, Droplets, Paintbrush, Wind, Hammer, Truck, Scissors } from "lucide-react";

export const serviceCategories = [
  { id: "plumber", name: "Plumber", icon: Droplets, color: "272 51% 44%" },
  { id: "electrician", name: "Electrician", icon: Zap, color: "290 60% 50%" },
  { id: "cleaner", name: "Cleaner", icon: Wind, color: "330 81% 70%" },
  { id: "painter", name: "Painter", icon: Paintbrush, color: "260 50% 65%" },
  { id: "carpenter", name: "Carpenter", icon: Hammer, color: "340 70% 65%" },
  { id: "mechanic", name: "Mechanic", icon: Wrench, color: "230 45% 55%" },
  { id: "mover", name: "Mover", icon: Truck, color: "300 40% 45%" },
  { id: "gardener", name: "Gardener", icon: Scissors, color: "280 35% 55%" },
];

export interface Worker {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  experience: string;
  price: string;
  distance: string;
  available: boolean;
  photo: string;
  skills: string[];
  completedJobs: number;
  isNew?: boolean;
  city?: string;
}

// ... (servicePricing stays same)

// Map an API worker (User document) to the frontend Worker interface
export const mapApiWorker = (apiWorker: any): Worker => {
  const joinDate = new Date(apiWorker.createdAt);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return {
    id: apiWorker._id,
    name: apiWorker.name,
    service: (apiWorker.service || "general").toLowerCase(),
    rating: apiWorker.rating || 4.5,
    reviews: apiWorker.reviewCount || 0,
    experience: apiWorker.experience || "N/A",
    price: servicePricing[(apiWorker.service || "").toLowerCase()] || "₹300/hr",
    distance: "Nearby",
    available: apiWorker.status === "active",
    photo: apiWorker.avatar || "",
    skills: apiWorker.skills || [],
    completedJobs: apiWorker.completedJobs || 0,
    isNew: joinDate > sevenDaysAgo,
    city: apiWorker.city || "Delhi",
  };
};

// Fetch real workers from the backend API
export const fetchWorkers = async (city?: string): Promise<Worker[]> => {
  try {
    const url = city ? `/api/workers?city=${city}` : "/api/workers";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch workers");
    const data = await res.json();
    return data.map(mapApiWorker);
  } catch (error) {
    console.error("Error fetching workers, using fallback:", error);
    // If city is provided, filter the mock workers to maintain UI consistency
    return city 
      ? mockWorkers.filter(w => w.city === city) 
      : mockWorkers;
  }
};

// Fetch a single worker by ID from the backend API
export const fetchWorkerById = async (id: string): Promise<Worker | null> => {
  try {
    const res = await fetch(`/api/workers/${id}`);
    if (!res.ok) throw new Error("Worker not found");
    const data = await res.json();
    return mapApiWorker(data);
  } catch (error) {
    console.error("Error fetching worker:", error);
    // Fallback to mock data
    return mockWorkers.find((w) => w.id === id) || null;
  }
};

export const fetchWorkerReviews = async (workerId: string) => {
  try {
    const res = await fetch(`/api/reviews/worker/${workerId}`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return await res.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

// Mock data kept as fallback when API is unavailable
export const mockWorkers: Worker[] = [
  { id: "1", name: "Rajesh Kumar", service: "plumber", rating: 4.8, reviews: 124, experience: "8 years", price: "₹300/hr", distance: "1.2 km", available: true, photo: "", skills: ["Pipe Fitting", "Leak Repair", "Drainage"], completedJobs: 342, city: "Delhi" },
  { id: "2", name: "Amit Sharma", service: "electrician", rating: 4.9, reviews: 98, experience: "10 years", price: "₹400/hr", distance: "0.8 km", available: true, photo: "", skills: ["Wiring", "Switchboard", "AC Repair"], completedJobs: 287, city: "Mumbai" },
  { id: "3", name: "Suresh Patel", service: "cleaner", rating: 4.6, reviews: 76, experience: "5 years", price: "₹250/hr", distance: "2.1 km", available: false, photo: "", skills: ["Deep Cleaning", "Carpet", "Kitchen"], completedJobs: 198, city: "Bangalore" },
  { id: "4", name: "Vikram Singh", service: "painter", rating: 4.7, reviews: 89, experience: "12 years", price: "₹350/hr", distance: "1.5 km", available: true, photo: "", skills: ["Interior", "Exterior", "Texture"], completedJobs: 412, city: "Pune" },
  { id: "5", name: "Manoj Verma", service: "plumber", rating: 4.5, reviews: 56, experience: "6 years", price: "₹280/hr", distance: "3.0 km", available: true, photo: "", skills: ["Water Tank", "Tap Repair", "Pipe Laying"], completedJobs: 156, city: "Chennai" },
  { id: "6", name: "Deepak Yadav", service: "electrician", rating: 4.4, reviews: 43, experience: "4 years", price: "₹350/hr", distance: "1.8 km", available: true, photo: "", skills: ["Fan Installation", "Inverter", "LED"], completedJobs: 98, city: "Kolkata" },
  { id: "7", name: "Ramesh Gupta", service: "carpenter", rating: 4.9, reviews: 112, experience: "15 years", price: "₹500/hr", distance: "0.5 km", available: true, photo: "", skills: ["Furniture", "Doors", "Cabinets"], completedJobs: 523, city: "Hyderabad" },
  { id: "8", name: "Arun Mishra", service: "mechanic", rating: 4.3, reviews: 67, experience: "7 years", price: "₹400/hr", distance: "2.5 km", available: false, photo: "", skills: ["Car Service", "Bike Repair", "AC Gas"], completedJobs: 178, city: "Delhi" },
];

