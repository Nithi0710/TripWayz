import { format, startOfMonth, subMonths } from "date-fns";
import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminPackagesManager } from "@/components/admin/admin-packages";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [users, bookings, destinations] = await Promise.all([
    prisma.user.findMany({
      include: {
        profile: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      include: {
        destination: true,
        user: { include: { profile: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.destination.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const destinationRows = destinations.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    imageUrl: d.imageUrl,
    basePrice: Number(d.basePrice),
    country: d.country,
  }));

  const totalUsers = users.length;
  const totalBookings = bookings.length;
  const revenue = bookings
    .filter((b) => b.status !== BookingStatus.CANCELLED)
    .reduce((s, b) => s + Number(b.grandTotal), 0);

  const destMap = new Map<string, number>();
  for (const b of bookings) {
    const n = b.destination.name;
    destMap.set(n, (destMap.get(n) ?? 0) + 1);
  }
  const popularDestinations = Array.from(destMap.entries())
    .map(([name, bookingsCount]) => ({ name, bookings: bookingsCount }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 10);

  const months = Array.from({ length: 6 }, (_, i) =>
    startOfMonth(subMonths(new Date(), 5 - i)),
  );

  const bookingTrend = months.map((m) => {
    const key = format(m, "yyyy-MM");
    const label = format(m, "MMM yy");
    const inMonth = bookings.filter(
      (b) => format(b.createdAt, "yyyy-MM") === key,
    );
    const rev = inMonth
      .filter((b) => b.status !== BookingStatus.CANCELLED)
      .reduce((s, b) => s + Number(b.grandTotal), 0);
    return { month: label, count: inMonth.length, revenue: Math.round(rev) };
  });

  const userGrowth = months.map((m) => {
    const key = format(m, "yyyy-MM");
    const label = format(m, "MMM yy");
    const count = users.filter(
      (u) => format(u.createdAt, "yyyy-MM") === key,
    ).length;
    return { month: label, count };
  });

  const userRows = users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    name: u.profile?.name ?? null,
    bookingsCount: u._count.bookings,
  }));

  const bookingRows = bookings.map((b) => ({
    id: b.id,
    status: b.status,
    grandTotal: Number(b.grandTotal),
    createdAt: b.createdAt.toISOString(),
    startDate: b.startDate.toISOString(),
    destinationName: b.destination.name,
    customerEmail: b.user.email,
    customerName: b.user.profile?.name ?? null,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Operations snapshot, demand signals, and moderation tools.
        </p>
      </div>

      <AdminPackagesManager destinations={destinationRows} />

      <AdminDashboard
        stats={{ totalUsers, totalBookings, revenue }}
        popularDestinations={popularDestinations}
        bookingTrend={bookingTrend}
        userGrowth={userGrowth}
        users={userRows}
        bookings={bookingRows}
      />
    </div>
  );
}
