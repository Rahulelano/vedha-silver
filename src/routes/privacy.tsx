import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/Layout";
import { BRAND } from "@/lib/products";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h1 className="mb-8 text-4xl">Privacy Policy</h1>
        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            This Privacy Policy describes how {BRAND.name} ("we", "us", or "our") collects, uses,
            and discloses your Personal Information when you visit or make a purchase from the Site.
            This policy is strictly maintained in compliance with Razorpay Gateway guidelines and
            applicable Indian laws.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">1. Information We Collect</h2>
          <p>
            When you visit the Site, we collect certain information about your device, your
            interaction with the Site, and information necessary to process your purchases. This
            includes your name, billing address, shipping address, payment confirmation (processed
            securely via Razorpay), email address, and phone number.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">2. How We Use Your Information</h2>
          <p>
            We use the personal information we collect to provide our services to you, which
            includes: offering products for sale, processing payments via secure gateways
            (Razorpay), shipping and fulfillment of your order, and keeping you up to date on new
            products, services, and offers.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">3. Sharing Personal Information</h2>
          <p>
            We never sell your personal information. We only share it with trusted third parties to
            help us provide our services to you, such as delivery partners and our verified payment
            gateway partner, Razorpay, which securely processes your transactions.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">4. Security</h2>
          <p>
            To protect your personal information, we take reasonable precautions and follow industry
            best practices to make sure it is not inappropriately lost, misused, accessed,
            disclosed, altered or destroyed. Payments are fully encrypted by Razorpay in compliance
            with PCI DSS standards.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">5. Contact Us</h2>
          <p>
            For more information about our privacy practices, if you have questions, or if you would
            like to make a complaint, please contact us by e-mail at {BRAND.email} or by mail using
            the details provided below:
          </p>
          <p className="font-semibold">{BRAND.address}</p>
        </div>
      </main>
    </PageShell>
  );
}
