import { Link } from "@tanstack/react-router";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { formatINR, type Product } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { toggleWishlist, inWishlist, setQuickView, addToCart } = useShop();
  const id = (product.id || product._id) as string;
  const wished = inWishlist(id);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-luxe",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          aria-label={product.name}
          className="block h-full w-full"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={900}
            height={1100}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
        </Link>

        {product.badge && (
          <span className="eyebrow absolute left-3 top-3 rounded-full bg-charcoal px-3 py-1.5 text-charcoal-foreground">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="glass absolute right-3 top-3 grid size-9 place-items-center rounded-full transition-transform hover:scale-110"
        >
          <Heart className={cn("size-4", wished && "fill-destructive text-destructive")} />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <button
            type="button"
            onClick={() => setQuickView(product)}
            className="glass flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium tracking-wide"
          >
            <Eye className="size-3.5" /> Quick view
          </button>
          <button
            type="button"
            onClick={() => addToCart(id, product.variants?.options?.[0] ?? "Default")}
            aria-label={`Add ${product.name} to bag`}
            className="grid size-9 shrink-0 place-items-center rounded-md bg-charcoal text-charcoal-foreground transition-colors hover:bg-charcoal/85"
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="eyebrow text-muted-foreground">
          {(product.purity || "925 Sterling Silver").replace(" Sterling Silver", " Silver")}
        </p>
        <h3 className="text-base leading-snug">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-price text-[0.95rem] font-semibold">
            {formatINR(product.price)}
          </span>
          {product.compareAt && (
            <span className="font-price text-xs text-muted-foreground line-through">
              {formatINR(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
