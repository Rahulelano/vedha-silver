import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All Silver Jewellery | Vedhav Silvers Chennai" },
      {
        name: "description",
        content:
          "Browse hallmarked 925 sterling silver necklaces, jhumkas, bangles, rings, anklets and kids jewellery, hand-finished in Mylapore, Chennai.",
      },
      { property: "og:title", content: "Shop All Silver Jewellery | Vedhav Silvers" },
      {
        property: "og:description",
        content: "Hallmarked 925 sterling silver for women and children, hand-finished in Chennai.",
      },
    ],
  }),
  component: ShopPage,
});

type Sort = "featured" | "low" | "high" | "rating";

function ShopPage() {
  const [cat, setCat] = useState<string | "all">("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [query, setQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q");
    if (q) setQuery(q);

    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDbProducts(data);
      })
      .catch(() => {});

    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  const products = useMemo(() => {
    let list = dbProducts.filter((p) => (cat === "all" ? true : p.category === cat));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }
    const sorted = [...list];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    // if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating); // ratings not dynamically seeded yet
    return sorted;
  }, [cat, sort, query, inStockOnly, dbProducts]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="The Collection"
        title="Shop All Jewellery"
        subtitle="Every piece is hallmarked 925 sterling silver, hand-finished by our Mylapore artisans and shipped in a keepsake box."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {(["all", ...categories.map((c) => c.slug)]).map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setCat(slug)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-xs tracking-[0.14em] uppercase transition-colors",
                  cat === slug
                    ? "border-charcoal bg-charcoal text-charcoal-foreground"
                    : "border-border hover:bg-secondary",
                )}
              >
                {slug === "all" ? "All" : categories.find((c) => c.slug === slug)?.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <label className="sr-only" htmlFor="search">
              Search jewellery
            </label>
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jewellery…"
              className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-56 lg:flex-none"
            />
            
            <label className="flex items-center gap-2 text-sm text-muted-foreground mr-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={inStockOnly} 
                onChange={(e) => setInStockOnly(e.target.checked)} 
                className="accent-charcoal"
              />
              In Stock
            </label>

            <label className="sr-only" htmlFor="sort">
              Sort products
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 rounded-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">{products.length} pieces</p>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted-foreground">No pieces match your search.</p>
            <Link to="/shop" onClick={() => setQuery("")} className="mt-4 inline-block underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {products.map((p, i) => (
              <Reveal key={p._id || p.id} delay={(i % 4) * 70}>
                <ProductCard product={{ ...p, id: p._id || p.id, gallery: [] }} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
