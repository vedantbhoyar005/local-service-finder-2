import { User as UserIcon, Settings, HelpCircle, LogOut, ChevronRight, MapPin, CreditCard, Bell, Shield, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Mock Addresses State
  const [addresses, setAddresses] = useState([
    { id: "1", type: "Home", address: "H-24, Green Park, New Delhi" },
    { id: "2", type: "Office", address: "Cyber Hub, Gurugram, Haryana" },
  ]);
  const [newAddress, setNewAddress] = useState({ type: "", address: "" });

  // Mock Payments State
  const [payments, setPayments] = useState([
    { id: "1", type: "Visa", number: "•••• 4242", expiry: "12/26" },
    { id: "2", type: "Mastercard", number: "•••• 5555", expiry: "10/25" },
  ]);

  // Mock Notifications State
  const [notifs, setNotifs] = useState({
    bookings: true,
    offers: false,
    updates: true,
  });

  const handleUpdateProfile = () => {
    updateUserProfile(profileData);
    setActiveSheet(null);
  };

  const handleAddAddress = () => {
    if (newAddress.type && newAddress.address) {
      setAddresses([...addresses, { ...newAddress, id: Date.now().toString() }]);
      setNewAddress({ type: "", address: "" });
    }
  };

  const menuItems = [
    { id: "profile", icon: UserIcon, label: "Edit Profile", desc: "Update your personal info" },
    { id: "addresses", icon: MapPin, label: "My Addresses", desc: "Manage saved locations" },
    { id: "payments", icon: CreditCard, label: "Payment Methods", desc: "Cards, UPI & wallets" },
    { id: "notifications", icon: Bell, label: "Notifications", desc: "Manage your alerts" },
    { id: "privacy", icon: Shield, label: "Privacy & Security", desc: "Account protection" },
    { id: "help", icon: HelpCircle, label: "Help & Support", desc: "FAQs and contact us" },
    { id: "settings", icon: Settings, label: "Settings", desc: "App preferences" },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="gradient-primary px-5 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">{user?.name || "Guest User"}</h1>
            <p className="text-sm text-primary-foreground/70">{user?.email || "Connect your account"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-5">
          <div className="flex-1 text-center p-3 rounded-xl bg-primary-foreground/10">
            <p className="text-lg font-bold text-primary-foreground">12</p>
            <p className="text-[10px] text-primary-foreground/70">Bookings</p>
          </div>

          <div className="flex-1 text-center p-3 rounded-xl bg-primary-foreground/10">
            <p className="text-lg font-bold text-primary-foreground">₹5.2K</p>
            <p className="text-[10px] text-primary-foreground/70">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mt-5 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveSheet(item.id)}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-sm transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-left mt-4"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <span className="text-sm font-medium text-destructive">Log Out</span>
        </button>
      </div>

      {/* Sheet: Edit Profile */}
      <Sheet open={activeSheet === "profile"} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[80vh]">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>Update your personal information here.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                placeholder="+91 98765 43210"
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button onClick={handleUpdateProfile} className="w-full h-12 rounded-xl text-md">Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Sheet: My Addresses */}
      <Sheet open={activeSheet === "addresses"} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>My Addresses</SheetTitle>
            <SheetDescription>Manage your saved service locations.</SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="flex items-start gap-3 p-4 rounded-xl border border-border">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{addr.type}</p>
                    <p className="text-xs text-muted-foreground">{addr.address}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-4 border-t border-border">
              <p className="text-sm font-bold">Add New Address</p>
              <div className="space-y-3">
                <Input
                  placeholder="Label (e.g. Home, Office)"
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                />
                <Input
                  placeholder="Street Address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                />
                <Button onClick={handleAddAddress} variant="secondary" className="w-full gap-2">
                  <Plus className="w-4 h-4" /> Add Address
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet: Payment Methods */}
      <Sheet open={activeSheet === "payments"} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[80vh]">
          <SheetHeader>
            <SheetTitle>Payment Methods</SheetTitle>
            <SheetDescription>Manage your cards and other payment options.</SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-4">
            {payments.map((card) => (
              <div key={card.id} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                <div className="w-10 h-7 rounded bg-secondary flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{card.type} • {card.number}</p>
                  <p className="text-xs text-muted-foreground">Expires {card.expiry}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
            <Button variant="outline" className="w-full h-12 rounded-xl border-dashed gap-2 mt-4">
              <Plus className="w-4 h-4" /> Add Payment Method
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet: Notifications */}
      <Sheet open={activeSheet === "notifications"} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[60vh]">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>Control which alerts you receive.</SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Booking Updates</p>
                <p className="text-xs text-muted-foreground">Get notified about your service status.</p>
              </div>
              <Switch checked={notifs.bookings} onCheckedChange={(v) => setNotifs({ ...notifs, bookings: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Promotional Offers</p>
                <p className="text-xs text-muted-foreground">Receive special deals and discounts.</p>
              </div>
              <Switch checked={notifs.offers} onCheckedChange={(v) => setNotifs({ ...notifs, offers: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Service Reminders</p>
                <p className="text-xs text-muted-foreground">Reminders before your scheduled service.</p>
              </div>
              <Switch checked={notifs.updates} onCheckedChange={(v) => setNotifs({ ...notifs, updates: v })} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProfilePage;
