import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, PageShell } from "@/components/site/Layout";
import { HeroManager } from "@/components/admin/HeroManager";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { OrdersManager } from "@/components/admin/OrdersManager";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | Vedhav Silvers" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } else {
      alert(data.message);
    }
  };

  if (!token) {
    return (
      <PageShell>
        <PageHeader title="Admin Login" />
        <div className="mx-auto max-w-sm px-4 py-20">
          <form onSubmit={login} className="flex flex-col gap-4 bg-card p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-2">Sign in</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              required
              className="border p-2 rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="border p-2 rounded"
            />
            <button type="submit" className="bg-charcoal text-white py-2 rounded font-semibold mt-2">
              Login
            </button>
          </form>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader title="Admin Dashboard" subtitle="Manage your settings, categories, products and orders" />
      <div className="mx-auto max-w-7xl px-4 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["hero", "categories", "products", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded capitalize font-semibold transition-colors ${
                activeTab === tab ? "bg-charcoal text-white" : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={() => {
              setToken("");
              localStorage.removeItem("token");
            }}
            className="px-6 py-2 rounded font-semibold text-red-500 hover:bg-red-50 ml-auto transition-colors"
          >
            Logout
          </button>
        </div>
        
        {/* Active Tab Content */}
        {activeTab === "hero" && <HeroManager token={token} />}
        {activeTab === "categories" && <CategoriesManager token={token} />}
        {activeTab === "products" && <ProductsManager token={token} />}
        {activeTab === "orders" && <OrdersManager token={token} />}
        
      </div>
    </PageShell>
  );
}
