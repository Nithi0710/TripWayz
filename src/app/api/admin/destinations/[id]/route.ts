import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const bookingCount = await prisma.booking.count({
    where: { destinationId: id },
  });
  if (bookingCount > 0) {
    return NextResponse.json(
      {
        error:
          "Cannot delete: bookings exist for this package. Remove or reassign bookings first.",
      },
      { status: 409 },
    );
  }

  try {
    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete package." },
      { status: 500 },
    );
  }
}
