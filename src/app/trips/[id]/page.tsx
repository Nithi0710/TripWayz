import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { TripDetailClient } from "@/components/trips/trip-detail-client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function TripDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const { id } = await params;
  const booking = await prisma.booking.findFirst({
    where: { id, userId: session.user.id },
    include: {
      destination: { include: { activities: { orderBy: { name: "asc" } } } },
      activities: { include: { activity: true } },
    },
  });

  if (!booking) notFound();

  const shared = await prisma.sharedTrip.findUnique({
    where: { bookingId: booking.id },
  });

  return (
    <div className="space-y-6">
      <TripDetailClient booking={booking} shared={shared} />
    </div>
  );
}
