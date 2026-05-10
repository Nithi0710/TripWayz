import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(120).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            name: parsed.data.name ?? email.split("@")[0],
          },
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[signup]", e);
    const msg = e instanceof Error ? e.message : String(e);
    const unreachable =
      /P1001|ECONNREFUSED|ETIMEDOUT|MaxClients|DbHandler|connection.*(refused|timeout)/i.test(
        msg,
      ) ||
      msg.includes("reach database") ||
      msg.toLowerCase().includes("timeout");
    if (unreachable) {
      return NextResponse.json(
        {
          error:
            "Database unreachable from this server. On Vercel use Supabase Transaction pooler URL (port 6543) and add ?pgbouncer=true&connection_limit=1 to DATABASE_URL. Open /api/health/db to verify.",
          code: "DATABASE_UNAVAILABLE",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Could not create account." },
      { status: 500 },
    );
  }
}
