import { NextResponse } from "next/server";
import { getSupabaseServiceRole } from "@/lib/supabase/service";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServiceRole();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Server missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. Add them to .env and restart.",
      },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: "Use JPEG, PNG, WebP, or GIF." },
      { status: 400 },
    );
  }

  const ext =
    type === "image/png"
      ? "png"
      : type === "image/webp"
        ? "webp"
        : type === "image/gif"
          ? "gif"
          : "jpg";

  const path = `${session.user.id}/${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(path, buf, {
      contentType: type,
      upsert: true,
      cacheControl: "3600",
    });

  if (upErr) {
    console.error("[avatar upload]", upErr);
    return NextResponse.json(
      {
        error:
          upErr.message ||
          "Upload failed. In Supabase → Storage, create a public bucket named `avatars` (see README).",
      },
      { status: 502 },
    );
  }

  const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
  const baseUrl = (pub.publicUrl ?? "").replace(/\/$/, "");
  const avatarUrl = baseUrl;

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      name: session.user.email?.split("@")[0] ?? "Traveler",
      avatarUrl,
    },
    update: { avatarUrl },
  });

  return NextResponse.json({ avatarUrl });
}
