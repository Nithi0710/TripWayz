import { NextResponse } from "next/server";
import { z } from "zod";
import { BookingStatus, TravelStyle } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import {
  computeAddonsTotal,
  computeBaseTotal,
} from "@/lib/booking-pricing";

const createSchema = z.object({
  destinationId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(20),
  budget: z.number().positive(),
  travelStyle: z.nativeEnum(TravelStyle),
  specialRequests: z.string().max(2000).optional().nullable(),
  activityIds: z.array(z.string()).max(50).default([]),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const dest = await prisma.destination.findUnique({
      where: { id: parsed.data.destinationId },
      include: {
        activities: {
          where: { id: { in: parsed.data.activityIds } },
        },
      },
    });

    if (!dest) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }

    if (dest.activities.length !== parsed.data.activityIds.length) {
      return NextResponse.json(
        { error: "One or more add-ons are invalid for this destination." },
        { status: 400 },
      );
    }

    const startDate = new Date(parsed.data.startDate);
    const endDate = new Date(parsed.data.endDate);
    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "End date must be after start date." },
        { status: 400 },
      );
    }

    const baseTotal = computeBaseTotal({
      basePrice: Number(dest.basePrice),
      startDate,
      endDate,
      adults: parsed.data.adults,
      children: parsed.data.children,
      travelStyle: parsed.data.travelStyle,
    });

    const addonLines = dest.activities.map((a) => ({
      unitPrice: Number(a.price),
      quantity: 1,
    }));
    const addonsTotal = computeAddonsTotal(addonLines);
    const grandTotal = Math.round((baseTotal + addonsTotal) * 100) / 100;

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        destinationId: dest.id,
        startDate,
        endDate,
        adults: parsed.data.adults,
        children: parsed.data.children,
        budget: parsed.data.budget,
        travelStyle: parsed.data.travelStyle,
        specialRequests: parsed.data.specialRequests ?? null,
        status: BookingStatus.CONFIRMED,
        baseTotal,
        addonsTotal,
        grandTotal,
        activities: {
          create: dest.activities.map((a) => ({
            activityId: a.id,
            quantity: 1,
            unitPrice: a.price,
          })),
        },
      },
    });

    return NextResponse.json({ id: booking.id });
  } catch {
    return NextResponse.json(
      { error: "Could not create booking." },
      { status: 500 },
    );
  }
}
