import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/Layout";
import { BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/hallmark")({
  component: HallmarkPage,
});

function HallmarkPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <BadgeCheck className="size-10 text-foreground" />
          <h1 className="text-4xl">Hallmark & Authenticity</h1>
        </div>
        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>
            At Vedhav Silvers, transparency and quality are the cornerstones of our craftsmanship.
            We are deeply committed to providing you with the highest standard of fine silver
            jewellery.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">The 925 Sterling Silver Guarantee</h2>
          <p>
            Our jewellery is beautifully handcrafted using 925 sterling silver. This means that
            every piece consists of exactly 92.5% pure silver, mixed with 7.5% consisting of
            ethically sourced alloys (like copper) to give the metal the strength it needs for
            intricate designs and daily wear.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">BIS Hallmarking</h2>
          <p>
            We adhere strictly to the Bureau of Indian Standards (BIS). The majority of our
            catalogue features a hallmark stamp that certifies its authenticity and purity. When you
            see the hallmark on a Vedhav piece, it is a government-regulated guarantee of exactly
            what you are paying for.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">Ethical Finishing</h2>
          <p>
            Whether your jewellery features a gleaming rhodium polish (to prevent tarnish), a matte
            finish, or antique oxidisation, we ensure that every chemical process used is completely
            Nickel-free, Lead-free, and Hypoallergenic, making them entirely skin-safe even for
            infants and sensitive adults.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">Certificate of Authenticity</h2>
          <p>
            Every order successfully delivered to you comes with a physical card verifying the
            piece's authenticity, signed and assured by the master silversmiths at Vedhav Silvers.
            For any queries regarding the purity of your purchase, you are always welcome to contact
            our team.
          </p>
        </div>
      </main>
    </PageShell>
  );
}
