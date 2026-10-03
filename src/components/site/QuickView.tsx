import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, Star, X } from "lucide-react";
import { formatINR } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export function QuickView() {
  const { quickView, setQuickView, addToCart, toggleWishlist, inWishlist } = useShop();
  const [sz, setSz] = useState("");
  const [col, setCol] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (quickView) {
      setSz(quickView.sizes?.[0] ?? quickView.variants?.options?.[0] ?? "Standard");
      setCol(quickView.colors?.[0] ?? "");
      setQty(1);
      setActiveImage(null);
    }
  }, [quickView]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setQuickView(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setQuickView]);

  if (!quickView) return null;
  const p = quickView;
  const purity = (p.purity || "925 Sterling Silver");
  const rating = p.rating || 4.5;
  const reviewsCount = p.reviews || 0;
  const sizes = p.sizes?.length ? p.sizes : (p.variants?.options || ["Standard"]);
  const colors = p.colors?.length ? p.colors : [];
  const productId = (p._id || p.id) as string;
  const allImages = p.images?.length ? [p.image, ...p.images] : [p.image];
  const currentImg = activeImage || p.image;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button
        aria-label="Close quick view"
        onClick={() => setQuickView(null)}
        className="absolute inset-0 bg-charcoal/55 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${p.name} quick view`}
        className="relative m-0 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-y-auto rounded-t-2xl bg-card shadow-luxe sm:m-4 sm:flex-row sm:rounded-lg"
      >
        <button
          type="button"
          onClick={() => setQuickView(null)}
          aria-label="Close"
          className="glass absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col sm:w-[45%] h-56 sm:h-auto">
          <img
            src={currentImg}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover sm:h-full"
          />
          {allImages.length > 1 && (
            <div className="flex gap-2 p-2 overflow-x-auto bg-stone-100/50">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "relative size-16 shrink-0 overflow-hidden rounded border-2 transition-all",
                    currentImg === img ? "border-charcoal opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
          <div>
            <p className="eyebrow text-muted-foreground">{purity}</p>
            <h2 className="mt-2 text-2xl">{p.name}</h2>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex" aria-label={`${rating} out of 5`}>
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
              {reviewsCount} reviews
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-price text-xl font-semibold">{formatINR(p.price)}</span>
            {p.compareAt && (
              <span className="font-price text-sm text-muted-foreground line-through">
                {formatINR(p.compareAt)}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>

          <div className="flex flex-col gap-4">
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
                        "rounded-md border px-4 py-2 text-sm transition-colors",
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
                        "rounded-md border px-4 py-2 text-sm transition-colors",
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

          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-10 place-items-center"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="font-price w-8 text-center text-sm">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                className="grid size-10 place-items-center"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <button
              type="button"
              disabled={p.stock <= 0}
              onClick={() => {
                addToCart(productId, [sz, col].filter(Boolean).join(" - ") || "Standard", qty);
                setQuickView(null);
              }}
              className={cn(
                "h-10 flex-1 rounded-md px-6 text-sm tracking-wide transition-colors",
                p.stock > 0
                  ? "bg-charcoal text-charcoal-foreground hover:bg-charcoal/85"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              {p.stock > 0 ? "Add to bag" : "Out of stock"}
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(productId)}
              aria-label="Toggle wishlist"
              className="grid size-10 place-items-center rounded-md border border-border"
            >
              <Heart
                className={cn("size-4", inWishlist(productId) && "fill-destructive text-destructive")}
              />
            </button>
          </div>

          <Link
            to="/product/$slug"
            params={{ slug: p.slug }}
            onClick={() => setQuickView(null)}
            className="text-center text-xs tracking-[0.2em] uppercase text-muted-foreground underline underline-offset-4"
          >
            View full details
          </Link>
        </div>
      </div>
    </div>
  );
}
