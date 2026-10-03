import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/Layout";
import { BRAND } from "@/lib/products";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h1 className="mb-8 text-4xl">Terms of Service</h1>
        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>
            Welcome to {BRAND.name}. By visiting our website and/or purchasing from us, you engage
            in our "Service" and agree to be bound by the following terms and conditions.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">1. Razorpay Payment Gateway</h2>
          <p>
            We use Razorpay as our primary payment gateway. You agree to provide current, complete,
            and accurate purchase and account information for all purchases made on our store. You
            expressly authorize us and Razorpay to charge your selected payment method for any such
            purchases.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">2. Products & Services</h2>
          <p>
            We have made every effort to display as accurately as possible the colors and images of
            our products that appear at the store. We reserve the right to limit the sales of our
            products or Services to any person, geographic region, or jurisdiction. All descriptions
            of products or product pricing are subject to change at anytime without notice.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">3. Accuracy of Billing</h2>
          <p>
            We reserve the right to refuse any order you place with us. We may, in our sole
            discretion, limit or cancel quantities purchased per person or per order.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">4. Intellectual Property</h2>
          <p>
            All content on the site, including images, design, and graphics, is the exclusive
            property of {BRAND.name}. You may not reproduce, duplicate, copy, sell, or exploit any
            portion of the Service without express written permission by us.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">5. Governing Law</h2>
          <p>
            These Terms of Service and any separate agreements whereby we provide you Services shall
            be governed by and construed in accordance with the laws of India, under the
            jurisdiction of courts in Chennai, Tamil Nadu.
          </p>
        </div>
      </main>
    </PageShell>
  );
}
