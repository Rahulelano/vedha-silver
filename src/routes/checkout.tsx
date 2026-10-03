import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/Layout";
import { formatINR } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { useAuth } from "@/lib/auth-store";
import { useEffect } from "react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | Vedhav Silvers" },
      { name: "description", content: "Complete your Vedhav Silvers order — demo checkout flow." },
      { property: "og:title", content: "Secure Checkout | Vedhav Silvers" },
      { property: "og:description", content: "Complete your Vedhav Silvers order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { lines, subtotal, shipping, total, clearCart } = useShop();
  const { user, token } = useAuth();
  const [orderId, setOrderId] = useState<string | null>(null);

  const defaultAddress = user ? (user as any).address || "" : "";
  const defaultCity = user ? (user as any).city || "" : "";
  const defaultZip = user ? (user as any).zip || "" : "";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (orderId) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
          <CheckCircle2 className="mx-auto size-12 text-accent" />
          <h1 className="mt-6 text-3xl">Thank you</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your order <span className="font-price">{orderId}</span> is confirmed. A stylist from
            our Mylapore atelier will call to confirm sizing before dispatch.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/account"
              className="rounded-md bg-charcoal px-6 py-3 text-sm text-charcoal-foreground"
            >
              View orders
            </Link>
            <Link to="/shop" className="rounded-md border border-border px-6 py-3 text-sm">
              Keep shopping
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader eyebrow="Step 2 of 2" title="Checkout" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">There is nothing to check out yet.</p>
              <Link
                to="/shop"
                className="mt-6 inline-block rounded-md bg-charcoal px-8 py-3 text-sm text-charcoal-foreground"
              >
                Shop the collection
              </Link>
            </div>
          ) : !user ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">Please sign in to complete your checkout.</p>
              <Link
                to="/account"
                className="mt-6 inline-block rounded-md bg-charcoal px-8 py-3 text-sm text-charcoal-foreground"
              >
                Sign In
              </Link>
            </div>
          ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!user || !token) return;

              const formData = new FormData(e.currentTarget as HTMLFormElement);
              const address = {
                address: formData.get("address"),
                city: formData.get("city"),
                postalCode: formData.get("zip"),
                country: "India"
              };

              const orderItems = lines.map(l => ({
                name: l.product.name,
                variant: l.variant,
                qty: l.qty,
                image: l.product.image,
                price: l.product.price,
                product: l.id
              }));

              const payload = {
                orderItems,
                shippingAddress: address,
                paymentMethod: document.querySelector('input[name="payment"]:checked')?.getAttribute('value') || "Cash on Delivery",
                itemsPrice: subtotal,
                taxPrice: 0,
                shippingPrice: shipping,
                totalPrice: total
              };

              const res = await fetch("/api/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify(payload)
              });

              if (res.ok) {
                 const data = await res.json();
                 
                 const rpRes = await fetch("/api/payment/create-order", {
                   method: "POST",
                   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                   body: JSON.stringify({ amount: total })
                 });
                 const rzpOrder = await rpRes.json();
                 
                 const options = {
                   key: "rzp_live_TjUBzybYxJxO1T",
                   amount: rzpOrder.amount,
                   currency: "INR",
                   name: "Vedhav Silvers",
                   description: "Jewellery Purchase",
                   order_id: rzpOrder.id,
                   handler: async function (response: any) {
                      const vRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({
                           razorpay_order_id: response.razorpay_order_id,
                           razorpay_payment_id: response.razorpay_payment_id,
                           razorpay_signature: response.razorpay_signature,
                           order_id: data._id
                        })
                      });
                      if (vRes.ok) {
                         setOrderId(data._id.substring(data._id.length - 6).toUpperCase());
                         clearCart();
                         window.scrollTo({ top: 0 });
                      } else {
                         alert("Payment verification failed!");
                      }
                   },
                   prefill: {
                     name: user.name,
                     email: user.email,
                     contact: formData.get("phone") as string
                   },
                   theme: { color: "#1e3a8a" }
                 };

                 if (!(window as any).Razorpay) {
                    alert("Razorpay is not loaded");
                    return;
                 }
                 
                 const rzp = new (window as any).Razorpay(options);
                 rzp.on('payment.failed', function (response: any){
                     alert("Payment Failed! " + response.error.description);
                 });
                 rzp.open();
              } else {
                 const err = await res.json();
                 alert(err.message || "Failed to process checkout.");
              }
            }}
            className="grid gap-12 lg:grid-cols-[1.5fr_1fr]"
          >
            <div className="space-y-10">
              <fieldset>
                <legend className="text-xl">Contact</legend>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" name="name" autoComplete="name" defaultValue={user?.name} />
                  <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={user?.email}
                    autoComplete="email"
                    className="sm:col-span-2"
                  />
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xl">Delivery address</legend>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Address line"
                    name="address"
                    defaultValue={defaultAddress}
                    autoComplete="street-address"
                    className="sm:col-span-2"
                  />
                  <Field label="City" name="city" defaultValue={defaultCity} autoComplete="address-level2" />
                  <Field label="State" name="state" defaultValue="Tamil Nadu" autoComplete="address-level1" />
                  <Field label="PIN code" name="zip" defaultValue={defaultZip} autoComplete="postal-code" />
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xl">Payment Details</legend>
                <div className="mt-5 space-y-3">
                  {["Razorpay Secure Checkout", "UPI / GPay / PhonePe"].map(
                    (m, i) => (
                      <label
                        key={m}
                        className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-4 text-sm has-checked:border-charcoal"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={m}
                          defaultChecked={i === 0}
                          className="accent-foreground"
                        />
                        {m}
                      </label>
                    ),
                  )}
                </div>
              </fieldset>
            </div>

            <aside className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-28">
              <h2 className="text-xl">Summary</h2>
              <ul className="mt-5 space-y-4">
                {lines.map((l) => (
                  <li key={l.key} className="flex gap-3 text-sm">
                    <img
                      src={l.product.image}
                      alt={l.product.name}
                      loading="lazy"
                      width={900}
                      height={1100}
                      className="size-14 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p>{l.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {l.variant} · Qty {l.qty}
                      </p>
                    </div>
                    <span className="font-price">{formatINR(l.product.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-price">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-price">{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base">
                  <dt>Total</dt>
                  <dd className="font-price font-semibold">{formatINR(total)}</dd>
                </div>
              </dl>
              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-charcoal py-3.5 text-sm tracking-[0.14em] uppercase text-charcoal-foreground transition-colors hover:bg-charcoal/85"
              >
                <Lock className="size-3.5" /> Place order
              </button>
            </aside>
          </form>
        )}
      </div>
    </PageShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="eyebrow text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
