import { useState, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Heart, MapPin, Package, Phone, LogOut } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/Layout";
import { BRAND, formatINR } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "My Account | Vedhav Silvers" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, token, login, logout } = useAuth();
  const { wishlist, count } = useShop();

  // Auth States
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Dashboard States
  const [orders, setOrders] = useState<any[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "", address: "", city: "", zip: ""
  });

  useEffect(() => {
    if (user && token) {
      setProfileData({
        name: user.name || "",
        address: (user as any).address || "",
        city: (user as any).city || "",
        zip: (user as any).zip || ""
      });
      // Fetch user's actual orders
      fetch("/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setOrders(data); })
      .catch(() => {});
    }
  }, [user, token]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLoginView ? "/api/auth/login" : "/api/auth/register";
    const body = isLoginView ? { email, password } : { name, email, password };
    
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.token) {
      login(data.token, data);
    } else {
      alert(data.message || "Authentication failed");
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(profileData),
    });
    if (res.ok) {
      const updatedUser = await res.json();
      login(token!, updatedUser);
      setEditingProfile(false);
    } else {
      alert("Failed to update profile");
    }
  };

  if (!user) {
    return (
      <PageShell>
        <PageHeader eyebrow="Account" title={isLoginView ? "Sign In" : "Create Account"} subtitle="Access your orders and saved items" />
        <div className="mx-auto max-w-sm px-4 py-16">
          <form onSubmit={handleAuth} className="flex flex-col gap-4 border border-border p-6 rounded-lg bg-card shadow-sm">
            {!isLoginView && (
              <label className="flex flex-col text-sm text-muted-foreground gap-1">Full Name
                <input required value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded text-foreground" />
              </label>
            )}
            <label className="flex flex-col text-sm text-muted-foreground gap-1">Email
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded text-foreground" />
            </label>
            <label className="flex flex-col text-sm text-muted-foreground gap-1">Password
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded text-foreground" />
            </label>
            <button type="submit" className="bg-charcoal text-white py-2 rounded font-semibold mt-2 hover:bg-charcoal/90 transition-colors">
              {isLoginView ? "Sign In" : "Register"}
            </button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              {isLoginView ? "New to Vedhav Silvers?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => setIsLoginView(!isLoginView)} className="text-charcoal font-semibold hover:underline">
                {isLoginView ? "Create an account" : "Sign in here"}
              </button>
            </p>
          </form>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome, ${user.name}`}
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <Package className="size-5" />
          <h2 className="mt-4 text-lg">My Orders</h2>
          {orders.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm h-64 overflow-y-auto">
              {orders.map((o) => (
                <li key={o._id} className="flex justify-between border-b border-border pb-3">
                  <span>
                    <span className="font-price font-semibold">Order #{o._id.substring(o._id.length - 6).toUpperCase()}</span>
                    <span className={cn("ml-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full",
                      o.isDelivered ? "bg-green-100 text-green-700 font-bold" : "bg-orange-100 text-orange-700 font-semibold"
                    )}>
                      {o.isDelivered ? "Delivered" : "Processing"}
                    </span>
                    <br />
                    <span className="text-xs text-muted-foreground mt-1 inline-block">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")} · {o.orderItems.reduce((acc: number, item: any) => acc + item.qty, 0)} items
                    </span>
                  </span>
                  <span className="font-price font-semibold text-charcoal">{formatINR(o.totalPrice)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-6 flex flex-col items-start h-fit">
          <MapPin className="size-5" />
          <h2 className="mt-4 text-lg">My Address</h2>
          
          {editingProfile ? (
            <form onSubmit={updateProfile} className="mt-4 flex flex-col gap-3 w-full">
              <input value={profileData.name} onChange={r => setProfileData({...profileData, name: r.target.value})} placeholder="Full Name" required className="border p-2 rounded text-sm w-full" />
              <input value={profileData.address} onChange={r => setProfileData({...profileData, address: r.target.value})} placeholder="Street Address" required className="border p-2 rounded text-sm w-full" />
              <div className="flex gap-2">
                <input value={profileData.city} onChange={r => setProfileData({...profileData, city: r.target.value})} placeholder="City" required className="border p-2 rounded text-sm w-1/2" />
                <input value={profileData.zip} onChange={r => setProfileData({...profileData, zip: r.target.value})} placeholder="PIN Code" required className="border p-2 rounded text-sm w-1/2" />
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="bg-charcoal text-white text-xs font-semibold py-2 px-4 rounded w-1/2">Save</button>
                <button type="button" onClick={() => setEditingProfile(false)} className="bg-gray-200 text-charcoal text-xs font-semibold py-2 px-4 rounded w-1/2">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">
              {profileData.address ? (
                 <p className="leading-relaxed">
                   <strong>{user.name}</strong><br/>
                   {profileData.address},<br/>
                   {profileData.city}, {profileData.zip}
                 </p>
              ) : (
                 <p>No address saved yet.</p>
              )}
              <button onClick={() => setEditingProfile(true)} className="mt-4 bg-secondary text-sm font-semibold px-4 py-1.5 rounded text-charcoal hover:bg-secondary/80">Edit Profile</button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-border bg-card p-6">
            <Heart className="size-5" />
            <h2 className="mt-4 text-lg">Saved & Bag</h2>
            <p className="mt-2 text-sm text-muted-foreground">
                {wishlist.length} saved pieces · {count} items in bag
            </p>
            <div className="mt-5 flex gap-2">
                <Link to="/wishlist" className="rounded-md border border-border px-4 py-2 text-xs uppercase tracking-[0.14em] hover:bg-secondary transition-colors">Wishlist</Link>
                <Link to="/cart" className="rounded-md border border-border px-4 py-2 text-xs uppercase tracking-[0.14em] hover:bg-secondary transition-colors">Bag</Link>
            </div>
            </div>

            <button onClick={logout} className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-red-600 flex items-center gap-3 transition-colors hover:bg-red-100/50 w-full">
                <LogOut className="size-4" /> <span className="text-sm font-semibold">Sign out of account</span>
            </button>
        </div>

      </div>
    </PageShell>
  );
}
