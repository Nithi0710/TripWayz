import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      activities: { orderBy: { name: "asc" } },
      attractions: { take: 4 },
    },
  });

  if (!destination) notFound();

  return (
    <div className="space-y-10">
      <section className="glass-panel overflow-hidden">
        <div className="relative aspect-[21/9] min-h-[220px] w-full">
          <Image
            src={destination.imageUrl}
            alt={destination.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <p className="inline-flex items-center gap-2 text-sm text-white/85">
              <MapPin className="h-4 w-4" />
              {destination.country}
              {destination.region ? ` · ${destination.region}` : ""}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-5xl">
              {destination.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
              {destination.description}
            </p>
          </div>
        </div>
      </section>

      {destination.attractions.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Highlights nearby</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {destination.attractions.map((a) => (
              <div
                key={a.id}
                className="glass-panel flex gap-4 p-4 text-sm leading-relaxed"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{a.name}</p>
                  <p className="mt-1 text-[var(--muted)]">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Craft your itinerary</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Choose dates, travelers, travel style, and optional experiences —
            watch your estimate update in real time.
          </p>
        </div>
        <BookingWizard
          destination={destination}
          activities={destination.activities}
        />
      </section>
    </div>
  );
}
