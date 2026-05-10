"use client";

type Props = {
  url: string | null;
  fallbackLetter: string;
  size?: number;
};

/**
 * Plain <img> so Supabase Storage URLs load without Next/Image optimizer
 * (avoids hostname / RLS / wildcard issues). Add cache-bust in URL when needed.
 */
export function AvatarPreview({ url, fallbackLetter, size = 112 }: Props) {
  const letter = fallbackLetter?.toUpperCase() || "?";
  if (!url?.trim()) {
    return (
      <div
        className="flex items-center justify-center rounded-full border border-[var(--surface-border)] bg-white/5 text-2xl font-semibold text-[var(--muted)]"
        style={{ width: size, height: size }}
      >
        {letter}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      className="rounded-full border border-[var(--surface-border)] object-cover"
      style={{ width: size, height: size }}
      referrerPolicy="no-referrer"
    />
  );
}
