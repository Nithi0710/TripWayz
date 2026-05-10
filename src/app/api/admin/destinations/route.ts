import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { slugify } from "@/lib/slug";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(10).max(4000),
  imageUrl: z.string().url(),
  basePrice: z.number().positive(),
  country: z.string().max(120).optional().nullable(),
  region: z.string().max(120).optional().nullable(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    let base = slugify(parsed.data.name);
    if (!base) base = "destination";
    let slug = base;
    let n = 0;
    while (await prisma.destination.findUnique({ where: { slug } })) {
      n += 1;
      slug = `${base}-${randomBytes(3).toString("hex")}`;
      if (n > 20) break;
    }

    const dest = await prisma.destination.create({
      data: {
        name: parsed.data.name.trim(),
        slug,
        description: parsed.data.description.trim(),
        imageUrl: parsed.data.imageUrl.trim(),
        basePrice: parsed.data.basePrice,
        country: parsed.data.country?.trim() || null,
        region: parsed.data.region?.trim() || null,
      },
    });

    return NextResponse.json({ id: dest.id, slug: dest.slug });
  } catch {
    return NextResponse.json(
      { error: "Could not create package." },
      { status: 500 },
    );
  }
}
