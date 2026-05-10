import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function PublicTripPage({ params }: Props) {
  const { slug } = await params;
  const shared = await prisma.sharedTrip.findUnique({
    where: { slug },
    include: {
      booking: {
        include: {
          destination: true,
          activities: { include: { activity: true } },
        },
      },
    },
  });

  if (!shared) notFound();
  const { booking } = shared;

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          Shared itinerary
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {booking.destination.name}
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          {format(booking.startDate, "MMM d, yyyy")} –{" "}
          {format(booking.endDate, "MMM d, yyyy")}
        </p>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius)] border border-[var(--surface-border)]">
        <Image
          src={booking.destination.imageUrl}
          alt={booking.destination.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-sm text-white/90">
          <MapPin className="h-4 w-4" />
          {booking.destination.country}
        </div>
      </div>

      <div className="glass-panel space-y-4 p-6 text-sm leading-relaxed">
        <p>{booking.destination.description}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs text-[var(--muted)]">Travelers</p>
            <p className="mt-1 font-medium">
              {booking.adults} adults · {booking.children} children
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs text-[var(--muted)]">Estimated total</p>
            <p className="mt-1 text-lg font-semibold text-[var(--accent)]">
              ${Number(booking.grandTotal).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
        {booking.specialRequests && (
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs text-[var(--muted)]">Notes</p>
            <p className="mt-2 whitespace-pre-wrap">{booking.specialRequests}</p>
          </div>
        )}
      </div>

      {booking.activities.length > 0 && (
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold">Experiences</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {booking.activities.map((row) => (
              <li key={row.id} className="flex justify-between gap-4">
                <span>{row.activity.name}</span>
                <span className="shrink-0 text-[var(--muted)]">
                  {row.activity.duration}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-center text-xs text-[var(--muted)]">
        TripWayz shared view · read-only
      </p>
    </div>
  );
}
