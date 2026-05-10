import { prisma } from "@/lib/prisma";
import { DestinationCard } from "@/components/dashboard/destination-card";
import { CustomerHub } from "@/components/dashboard/customer-hub";
import { FaqAccordion } from "@/components/customer/faq-accordion";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Where to <span className="text-gradient">next</span>?
        </h1>
        <p className="max-w-2xl text-[var(--muted)]">
          Choose a curated package or describe your own journey—TripWayz keeps
          pricing clear and your plans shareable.
        </p>
      </div>

      <CustomerHub />

      <section id="packages" className="scroll-mt-28 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Explore packages
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {destinations.length} destinations—including anything your admin
              adds.
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {destinations.map((d, i) => (
            <DestinationCard key={d.id} destination={d} index={i} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">FAQ</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Quick answers while you’re signed in.
            </p>
          </div>
          <Link
            href="/faq"
            className="text-sm font-semibold text-[var(--accent)]"
          >
            View all 10 →
          </Link>
        </div>
        <FaqAccordion limit={3} />
      </section>
    </div>
  );
}
