import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
/**
 * Quick DB connectivity check after deploy (open in browser: /api/health/db).
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "connected" });
  } catch (e) {
    console.error("[health/db]", e);
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        hint:
          "On Vercel, set DATABASE_URL to Supabase Transaction pooler (port 6543) with ?pgbouncer=true&connection_limit=1. See README.",
      },
      { status: 503 },
    );
  }
}
