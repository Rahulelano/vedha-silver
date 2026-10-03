import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist | Vedhav Silvers" },
      {
        name: "description",
        content: "The sterling silver pieces you have saved from the Vedhav Silvers collection.",
      },
      { property: "og:title", content: "Your Wishlist | Vedhav Silvers" },
      { property: "og:description", content: "Silver pieces saved for later." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useShop();
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDbProducts(data);
      })
      .catch(() => {});
  }, []);

  const items = dbProducts.filter((p) => wishlist.includes(p._id || p.id));

  return (
    <PageShell>
      <PageHeader
        eyebrow="Saved for later"
        title="Your Wishlist"
        subtitle="Keep track of the pieces you love. Your list is stored on this device."
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">You haven't saved any pieces yet.</p>
            <Link
              to="/shop"
              className="mt-6 inline-block rounded-md bg-charcoal px-8 py-3 text-sm tracking-[0.14em] uppercase text-charcoal-foreground"
            >
              Explore the collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {items.map((p) => (
              <ProductCard key={p._id || p.id} product={{ ...p, id: p._id || p.id, gallery: [] }} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
