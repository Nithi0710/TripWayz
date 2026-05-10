import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { BookingStatus } from "@prisma/client";
import { ArrowRight, PenLine, Plane } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const [bookings, personalPlans] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: "desc" },
      include: { destination: true },
    }),
    prisma.personalTripRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const upcoming = bookings.filter(
    (b) =>
      b.status !== BookingStatus.CANCELLED && b.endDate >= new Date(),
  );
  const past = bookings.filter(
    (b) => b.status === BookingStatus.CANCELLED || b.endDate < new Date(),
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My trips</h1>
        <p className="mt-2 text-[var(--muted)]">
          Package bookings and personal planning requests in one place.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-violet-500 dark:text-violet-300" />
          <h2 className="text-lg font-semibold">Personal trips</h2>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Custom requests you submitted (not package bookings).
        </p>
        {personalPlans.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            None yet —{" "}
            <Link href="/personal-plan" className="font-semibold text-violet-600 dark:text-violet-300">
              start a personal plan
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {personalPlans.map((p) => (
              <Link
                key={p.id}
                href={`/trips/personal/${p.id}`}
                className="glass-panel block border-violet-500/20 p-5 transition hover:border-violet-500/40"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
                  Personal trip
                </p>
                <p className="mt-2 text-lg font-semibold leading-snug">
                  {p.tripTitle ?? "Custom itinerary"}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                  {p.destinationNotes}
                </p>
                <p className="mt-3 text-xs text-[var(--muted)]">
                  {format(p.createdAt, "MMM d, yyyy")} · {p.status}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Package trips — upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="glass-panel flex flex-col items-center gap-3 p-10 text-center text-sm text-[var(--muted)]">
            <Plane className="h-8 w-8 text-[var(--accent)]" />
            <p>No upcoming trips yet — start from the dashboard.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
            >
              Explore destinations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((b) => (
              <Link
                key={b.id}
                href={`/trips/${b.id}`}
                className="glass-panel block p-5 transition hover:border-[var(--accent)]/40"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {b.destination.name}
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {format(b.startDate, "MMM d")} –{" "}
                  {format(b.endDate, "MMM d, yyyy")}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {b.adults} adults · {b.children} children · {b.status}
                </p>
                <p className="mt-3 text-sm font-semibold text-[var(--accent)]">
                  ${Number(b.grandTotal).toLocaleString()} total
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Package trips — past & cancelled</h2>
        {past.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nothing here yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {past.map((b) => (
              <Link
                key={b.id}
                href={`/trips/${b.id}`}
                className="glass-panel block p-5 opacity-90 transition hover:opacity-100"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {b.destination.name}
                </p>
                <p className="mt-2 font-medium">
                  {format(b.startDate, "MMM d, yyyy")} –{" "}
                  {format(b.endDate, "MMM d, yyyy")}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{b.status}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
