import { NextResponse } from "next/server";
import { z } from "zod";
import { TravelStyle } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const schema = z.object({
  tripTitle: z.string().max(200).optional().nullable(),
  destinationNotes: z.string().min(10, "Describe where and how you want to travel"),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  adults: z.number().int().min(1).max(30),
  children: z.number().int().min(0).max(30),
  budget: z.number().positive().optional().nullable(),
  travelStyle: z.nativeEnum(TravelStyle).optional().nullable(),
  specialRequests: z.string().max(5000).optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const start = parsed.data.startDate
      ? new Date(parsed.data.startDate)
      : null;
    const end = parsed.data.endDate ? new Date(parsed.data.endDate) : null;
    if (start && end && end <= start) {
      return NextResponse.json(
        { error: "End date must be after start date." },
        { status: 400 },
      );
    }

    const created = await prisma.personalTripRequest.create({
      data: {
        userId: session.user.id,
        tripTitle: parsed.data.tripTitle ?? null,
        destinationNotes: parsed.data.destinationNotes,
        startDate: start,
        endDate: end,
        adults: parsed.data.adults,
        children: parsed.data.children,
        budget: parsed.data.budget ?? null,
        travelStyle: parsed.data.travelStyle ?? null,
        specialRequests: parsed.data.specialRequests ?? null,
      },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch {
    return NextResponse.json(
      { error: "Could not save your request." },
      { status: 500 },
    );
  }
}
