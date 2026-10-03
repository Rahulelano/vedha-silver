import { useState, useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, Heart, Minus, Plus, RefreshCcw, Ruler, Star, Truck } from "lucide-react";
import { PageShell } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { formatINR } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    try {
      const res = await fetch("/api/products");
      const products = await res.json();
      const product = products.find((p: any) => p.slug === params.slug);
      if (!product) throw notFound();
      return { product, products };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Piece unavailable | Vedhav Silvers" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.product;
    const title = `${p.name} — ${p.purity || '925 Sterling Silver'} | Vedhav Silvers`;
    const description = p.description?.slice(0, 155) || "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, products } = Route.useLoaderData();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  
  // Provide defaults for UI fields missing in backend simple schema
  const sizes = product.sizes?.length ? product.sizes : (product.variants?.options || ["Standard"]);
  const colors = product.colors?.length ? product.colors : [];

  const purity = product.purity || "925 Sterling Silver";
  const weight = product.weight || "10 g";
  const rating = product.rating || 4.5;
  const reviewsCount = product.reviews || 0;
  const additionalImages = product.images?.length > 0 ? product.images : (product.gallery || []);
  const gallery = [product.image, ...additionalImages].filter(Boolean);

  const [sz, setSz] = useState(sizes[0] || "");
  const [col, setCol] = useState(colors[0] || "");
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  const related = products.filter((p: any) => p._id !== product._id && p.category === product.category)
    .concat(products.filter((p: any) => p._id !== product._id && p.category !== product.category))
    .slice(0, 4);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="px-2">/</span>
          <Link to="/shop" className="hover:underline">Shop</Link>
          <span className="px-2">/</span>
          <Link to="/category/$slug" params={{ slug: product.category }} className="hover:underline capitalize">{product.category}</Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="overflow-hidden rounded-lg bg-secondary">
              <img
                src={gallery[active] ?? product.image}
                alt={product.name}
                width={900}
                height={1100}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
                <div className="mt-3 flex gap-3">
                {gallery.map((g: string, i: number) => (
                    <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    className={cn(
                        "size-20 overflow-hidden rounded-md border transition-colors",
                        active === i ? "border-charcoal" : "border-border",
                    )}
                    >
                    <img
                        src={g}
                        alt=""
                        loading="lazy"
                        width={900}
                        height={1100}
                        className="h-full w-full object-cover"
                    />
                    </button>
                ))}
                </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <p className="eyebrow text-muted-foreground">{purity}</p>
              {product.badge && (
                <span className="eyebrow rounded-full bg-charcoal px-2 py-0.5 text-[0.6rem] text-charcoal-foreground">
                  {product.badge}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl lg:text-4xl">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex" aria-label={`Rated ${rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < Math.round(rating) && "fill-accent text-accent",
                    )}
                  />
                ))}
              </span>
              {rating} · {reviewsCount} reviews
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-price text-2xl font-semibold">{formatINR(product.price)}</span>
              {product.compareAt && (
                <>
                  <span className="font-price text-sm text-muted-foreground line-through">
                    {formatINR(product.compareAt)}
                  </span>
                  <span className="font-price rounded-full bg-accent/25 px-2 py-0.5 text-xs">
                    Save {formatINR(product.compareAt - product.price)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

            <div className="rule-silver my-7 opacity-70" />

            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-7 flex flex-col gap-6">
              {sizes.length > 0 && sizes[0] !== "Standard" && (
                <fieldset>
                  <legend className="eyebrow text-muted-foreground">Size</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sizes.map((o: string) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setSz(o)}
                        className={cn(
                          "rounded-md border px-5 py-2.5 text-sm transition-colors",
                          sz === o
                            ? "border-charcoal bg-charcoal text-charcoal-foreground"
                            : "border-border hover:bg-secondary",
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {colors.length > 0 && (
                <fieldset>
                  <legend className="eyebrow text-muted-foreground">Color / Finish</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {colors.map((o: string) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setCol(o)}
                        className={cn(
                          "rounded-md border px-5 py-2.5 text-sm transition-colors",
                          col === o
                            ? "border-charcoal bg-charcoal text-charcoal-foreground"
                            : "border-border hover:bg-secondary",
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-md border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid size-12 place-items-center"
                >
                  <Minus className="size-4" />
                </button>
                <span className="font-price w-10 text-center">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(9, q + 1))}
                  className="grid size-12 place-items-center"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                type="button"
                disabled={product.stock <= 0}
                onClick={() => addToCart(product._id || product.id, [sz, col].filter(Boolean).join(" - ") || "Standard", qty)}
                className={cn(
                  "h-12 min-w-48 flex-1 rounded-md px-8 text-sm tracking-[0.14em] uppercase transition-colors",
                  product.stock > 0 
                    ? "bg-charcoal text-charcoal-foreground hover:bg-charcoal/85" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                {product.stock > 0 ? "Add to bag" : "Out of stock"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product._id || product.id)}
                aria-label="Toggle wishlist"
                className="grid size-12 place-items-center rounded-md border border-border"
              >
                <Heart
                  className={cn(
                    "size-4",
                    inWishlist(product._id || product.id) && "fill-destructive text-destructive",
                  )}
                />
              </button>
            </div>

            <dl className="mt-9 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-md border border-border p-4">
                <dt className="eyebrow text-muted-foreground">Purity</dt>
                <dd className="mt-2">{purity}</dd>
              </div>
              <div className="rounded-md border border-border p-4">
                <dt className="eyebrow text-muted-foreground">Weight</dt>
                <dd className="font-price mt-2">{weight}</dd>
              </div>
            </dl>

            <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
              {[
                { Icon: BadgeCheck, text: "BIS hallmarked & certificate of authenticity" },
                { Icon: Truck, text: "Free insured shipping across India above ₹4,999" },
                { Icon: RefreshCcw, text: "15-day easy exchange, lifetime re-polish" },
                { Icon: Ruler, text: "Free sizing assistance at our Mylapore atelier" },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon className="size-4 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-2xl lg:text-3xl">You may also love</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {related.map((p: any, i: number) => (
              <Reveal key={p._id || p.id} delay={i * 70}>
                <ProductCard product={{...p, id: p._id || p.id, gallery: []}} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
