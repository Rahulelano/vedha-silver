import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/Layout";

export const Route = createFileRoute("/care")({
  component: CarePage,
});

function CarePage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h1 className="mb-8 text-4xl">Silver Care Guide</h1>
        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>
            Fine silver is meant to be worn, loved, and passed down. However, 925 sterling silver
            does tarnish naturally over time due to exposure to air, moisture, and chemicals. Here
            is how you can preserve the brilliance of your Vedhav Silvers pieces for generations.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">1. Keep it Dry</h2>
          <p>
            Moisture is the worst enemy of silver. We highly recommend removing your jewellery
            before engaging in activities like swimming, showering, exercising, or cleaning. Keep
            your silver away from harsh chemicals, including perfumes, hairsprays, and lotions.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">2. Proper Storage</h2>
          <p>
            When not in use, always store your silver jewellery in the provided Vedhav Silvers
            airtight box, pouch, or in a ziplock bag. Add a piece of chalk or a silica gel packet
            into the bag to absorb excess moisture and prevent rapid oxidation.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">3. Regular Polishing</h2>
          <p>
            Use a soft, non-abrasive microfiber cloth to gently rub down your silver pieces after
            wearing them to remove body oils and sweat. For minor tarnishing, gently buff the
            surface with a silver polishing cloth. Avoid using tissue paper or paper towels, as
            these can scratch the silver.
          </p>

          <h2 className="text-2xl mt-8 text-foreground">4. Lifetime Re-polish Service</h2>
          <p>
            Because we believe in the longevity of our jewellery, we proudly offer a lifetime
            re-polish service. If your Vedhav Silvers piece loses its luster, reach out to us. We
            will professionally clean and polish your jewellery to restore its original shine.
          </p>
        </div>
      </main>
    </PageShell>
  );
}
