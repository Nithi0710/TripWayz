import { getSession } from "@/lib/session";
import { HeroSection } from "@/components/landing/hero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-4xl space-y-12 py-10 text-center sm:py-16">
      <HeroSection loggedIn={!!session} />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Premium visual craft",
            body: "Glass surfaces, soft gradients, and motion that feels calm — not noisy.",
          },
          {
            title: "Pricing you can trust",
            body: "Live estimates that respond to nights, travelers, style, and add-ons.",
          },
          {
            title: "Share-ready trips",
            body: "Generate a public itinerary link for friends and family in one tap.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="glass-panel p-5 text-left text-sm leading-relaxed"
          >
            <p className="font-semibold">{card.title}</p>
            <p className="mt-2 text-[var(--muted)]">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
