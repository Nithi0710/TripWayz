import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = randomBytes(9).toString("base64url");
  await prisma.sharedTrip.upsert({
    where: { bookingId: id },
    create: { bookingId: id, slug },
    update: { slug },
  });

  const fresh = await prisma.sharedTrip.findUnique({
    where: { bookingId: id },
  });

  return NextResponse.json({ slug: fresh?.slug });
}
