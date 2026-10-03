import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/Layout";
import { formatINR } from "@/lib/products";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Shopping Bag | Vedhav Silvers" },
      {
        name: "description",
        content: "Review the sterling silver pieces in your Vedhav Silvers bag before checkout.",
      },
      { property: "og:title", content: "Your Shopping Bag | Vedhav Silvers" },
      { property: "og:description", content: "Review your selected sterling silver pieces." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQty, removeLine, subtotal, shipping, total } = useShop();

  return (
    <PageShell>
      <PageHeader eyebrow="Checkout" title="Your Bag" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {lines.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">Your bag is currently empty.</p>
            <Link
              to="/shop"
              className="mt-6 inline-block rounded-md bg-charcoal px-8 py-3 text-sm tracking-[0.14em] uppercase text-charcoal-foreground"
            >
              Discover the collection
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <ul className="divide-y divide-border border-y border-border">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-6">
                  <img
                    src={l.product.image}
                    alt={l.product.name}
                    loading="lazy"
                    width={900}
                    height={1100}
                    className="size-28 shrink-0 rounded-md object-cover sm:size-32"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link
                          to="/product/$slug"
                          params={{ slug: l.product.slug }}
                          className="text-base"
                        >
                          {l.product.name}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {(l.product.variants || { label: "Size" }).label}: {l.variant} · {l.product.purity || "925 Sterling Silver"}
                        </p>
                      </div>
                      <span className="font-price text-sm font-semibold">
                        {formatINR(l.product.price * l.qty)}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center gap-4 pt-4">
                      <div className="flex items-center rounded border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(l.key, l.qty - 1)}
                          className="grid size-9 place-items-center"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="font-price w-8 text-center text-sm">{l.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(l.key, l.qty + 1)}
                          className="grid size-9 place-items-center"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(l.key)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-28">
              <h2 className="text-xl">Order Summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
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
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">GST</dt>
                  <dd className="font-price">Included</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt>Total</dt>
                  <dd className="font-price font-semibold">{formatINR(total)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-6 block rounded-md bg-charcoal py-3.5 text-center text-sm tracking-[0.14em] uppercase text-charcoal-foreground transition-colors hover:bg-charcoal/85"
              >
                Proceed to checkout
              </Link>
              <Link
                to="/shop"
                className="mt-3 block text-center text-xs tracking-[0.16em] uppercase text-muted-foreground underline underline-offset-4"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </PageShell>
  );
}
