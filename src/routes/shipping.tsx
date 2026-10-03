import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/Layout";
import { BRAND } from "@/lib/products";

export const Route = createFileRoute("/shipping")({
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h1 className="mb-8 text-4xl">Shipping & Returns Policy</h1>
        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>
            At {BRAND.name}, we strive to deliver your fine silver jewellery securely and swiftly.
            Please review our Shipping, Returns, and Cancellation Policies (compliant with Razorpay
            verification rules) below.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">Shipping Policy</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Processing Time:</strong> All orders are processed within 2-3 business days.
              Handcrafted or customized pieces may take 7-10 business days.
            </li>
            <li>
              <strong>Shipping Rates & Estimates:</strong> We offer complimentary shipping across
              India on orders above ₹4,999. For orders under ₹4,999, a standard shipping fee applies
              at checkout.
            </li>
            <li>
              <strong>Delivery Timeline:</strong> Standard delivery usually takes 4-7 working days
              depending on the pin code.
            </li>
            <li>
              <strong>Order Tracking:</strong> Once dispatched, a tracking ID will be sent to your
              registered email & phone number.
            </li>
          </ul>

          <h2 className="text-2xl mt-8 text-foreground">Cancellation Policy</h2>
          <p>
            Orders can be cancelled within 24 hours of placement or before they are dispatched
            (whichever is earlier). If you wish to cancel an order, please contact our support team
            immediately at {BRAND.phone} or {BRAND.email}. Once an order is dispatched, it cannot be
            cancelled.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">Refund & Return Policy</h2>
          <p>
            Your satisfaction is our priority. We offer a 15-day return window for unused, unworn
            merchandise in its original packaging and tag. Custom-sized or personalized items cannot
            be returned.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Initiate Return:</strong> Email us at {BRAND.email} with your Order ID and
              pictures of the item.
            </li>
            <li>
              <strong>Refund Process:</strong> Once we receive and inspect the returned item,
              approved refunds will be processed within 5-7 working days.
            </li>
            <li>
              <strong>Razorpay Refunds:</strong> Refunds for prepaid orders will be credited
              strictly back to the original source of payment (Credit Card / Debit Card / Net
              Banking / UPI) via Razorpay.
            </li>
          </ul>
        </div>
      </main>
    </PageShell>
  );
}
