import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { formatINR } from "@/lib/products";
import { useShop } from "@/lib/shop-store";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, setQty, removeLine, subtotal, shipping, total } = useShop();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        aria-label="Close bag"
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-luxe"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg">Your Bag</h2>
          <button type="button" aria-label="Close bag" onClick={() => setCartOpen(false)}>
            <X className="size-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your bag is empty. Discover our hand-finished silver.
            </p>
            <Link
              to="/shop"
              onClick={() => setCartOpen(false)}
              className="rounded-md bg-charcoal px-6 py-3 text-sm text-charcoal-foreground"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-4">
                  <img
                    src={l.product.image}
                    alt={l.product.name}
                    loading="lazy"
                    width={900}
                    height={1100}
                    className="size-20 shrink-0 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <Link
                      to="/product/$slug"
                      params={{ slug: l.product.slug }}
                      onClick={() => setCartOpen(false)}
                      className="text-sm font-medium"
                    >
                      {l.product.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {(l.product.variants || { label: "Size" }).label}: {l.variant}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(l.key, l.qty - 1)}
                          className="grid size-8 place-items-center"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="font-price w-7 text-center text-xs">{l.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(l.key, l.qty + 1)}
                          className="grid size-8 place-items-center"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="font-price text-sm font-semibold">
                        {formatINR(l.product.price * l.qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${l.product.name}`}
                    onClick={() => removeLine(l.key)}
                    className="self-start text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-5 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-price">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-price">
                    {shipping === 0 ? "Complimentary" : formatINR(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base">
                  <dt>Total</dt>
                  <dd className="font-price font-semibold">{formatINR(total)}</dd>
                </div>
              </dl>
              <div className="mt-4 grid gap-2">
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="rounded-md bg-charcoal py-3 text-center text-sm tracking-wide text-charcoal-foreground transition-colors hover:bg-charcoal/85"
                >
                  Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setCartOpen(false)}
                  className="rounded-md border border-border py-3 text-center text-sm"
                >
                  View bag
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
