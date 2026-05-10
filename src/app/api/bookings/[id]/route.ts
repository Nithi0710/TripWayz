import { NextResponse } from "next/server";
import { z } from "zod";
import { BookingStatus, TravelStyle } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import {
  computeAddonsTotal,
  computeBaseTotal,
} from "@/lib/booking-pricing";

const patchSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  adults: z.number().int().min(1).max(20).optional(),
  children: z.number().int().min(0).max(20).optional(),
  budget: z.number().positive().optional(),
  travelStyle: z.nativeEnum(TravelStyle).optional(),
  specialRequests: z.string().max(2000).optional().nullable(),
  activityIds: z.array(z.string()).max(50).optional(),
  status: z.nativeEnum(BookingStatus).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findFirst({
    where: { id, userId: session.user.id },
    include: { destination: true, activities: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (booking.status === BookingStatus.CANCELLED) {
    return NextResponse.json(
      { error: "Cancelled bookings cannot be edited." },
      { status: 400 },
    );
  }

  try {
    const json = await req.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const startDate = parsed.data.startDate
      ? new Date(parsed.data.startDate)
      : booking.startDate;
    const endDate = parsed.data.endDate
      ? new Date(parsed.data.endDate)
      : booking.endDate;

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "End date must be after start date." },
        { status: 400 },
      );
    }

    const adults = parsed.data.adults ?? booking.adults;
    const children = parsed.data.children ?? booking.children;
    const travelStyle = parsed.data.travelStyle ?? booking.travelStyle;

    let activitiesCreate:
      | { activityId: string; quantity: number; unitPrice: unknown }[]
      | undefined;
    let addonsTotal = Number(booking.addonsTotal);

    if (parsed.data.activityIds) {
      const acts = await prisma.activity.findMany({
        where: {
          id: { in: parsed.data.activityIds },
          destinationId: booking.destinationId,
        },
      });
      if (acts.length !== parsed.data.activityIds.length) {
        return NextResponse.json(
          { error: "Invalid add-ons for this trip." },
          { status: 400 },
        );
      }
      activitiesCreate = acts.map((a) => ({
        activityId: a.id,
        quantity: 1,
        unitPrice: a.price,
      }));
      addonsTotal = computeAddonsTotal(
        acts.map((a) => ({ unitPrice: Number(a.price), quantity: 1 })),
      );
    }

    const baseTotal = computeBaseTotal({
      basePrice: Number(booking.destination.basePrice),
      startDate,
      endDate,
      adults,
      children,
      travelStyle,
    });
    const grandTotal = Math.round((baseTotal + addonsTotal) * 100) / 100;

    await prisma.$transaction(async (tx) => {
      if (activitiesCreate) {
        await tx.bookingActivity.deleteMany({ where: { bookingId: id } });
        await tx.bookingActivity.createMany({
          data: activitiesCreate.map((row) => ({
            bookingId: id,
            activityId: row.activityId,
            quantity: row.quantity,
            unitPrice: row.unitPrice as never,
          })),
        });
      }

      await tx.booking.update({
        where: { id },
        data: {
          startDate,
          endDate,
          adults,
          children,
          budget: parsed.data.budget ?? booking.budget,
          travelStyle,
          specialRequests:
            parsed.data.specialRequests === undefined
              ? booking.specialRequests
              : parsed.data.specialRequests,
          status: parsed.data.status ?? booking.status,
          baseTotal,
          addonsTotal,
          grandTotal,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not update booking." },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

  await prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CANCELLED },
  });

  return NextResponse.json({ ok: true });
}
