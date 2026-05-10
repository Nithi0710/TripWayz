"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AvatarPreview } from "@/components/profile/avatar-preview";

const schema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().max(40).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
});

type Form = z.infer<typeof schema>;

type Props = {
  email: string;
  defaultValues: Form & { avatarUrl: string | null };
};

function avatarUrlForStorage(url: string | null) {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url);
    u.searchParams.delete("v");
    const s = u.toString();
    return s.endsWith("?") ? s.slice(0, -1) : s;
  } catch {
    const i = url.indexOf("?");
    return i === -1 ? url : url.slice(0, i);
  }
}

export function ProfileForm({ email, defaultValues }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(defaultValues.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues.name ?? "",
      phone: defaultValues.phone ?? "",
      bio: defaultValues.bio ?? "",
    },
  });

  async function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(
          typeof data.error === "string"
            ? data.error
            : "Could not upload avatar.",
        );
        return;
      }
      if (data.avatarUrl) {
        const u = String(data.avatarUrl);
        const bust = u.includes("?") ? `&v=${Date.now()}` : `?v=${Date.now()}`;
        setAvatarUrl(`${u}${bust}`);
      }
      toast.success("Avatar updated.");
      router.refresh();
    } catch {
      toast.error("Network error while uploading.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onSubmit(values: Form) {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          phone: values.phone || null,
          bio: values.bio || null,
          avatarUrl: avatarUrlForStorage(avatarUrl),
        }),
      });
      if (!res.ok) {
        toast.error("Could not save profile.");
        return;
      }
      toast.success("Profile saved.");
      setAvatarUrl(avatarUrlForStorage(avatarUrl));
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <AvatarPreview
          url={avatarUrl}
          fallbackLetter={email[0] ?? "?"}
          size={112}
        />
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatar}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-medium"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload photo
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          disabled
          value={email}
          className="mt-2 w-full cursor-not-allowed rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 opacity-70"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Display name</label>
        <input
          className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 outline-none ring-[var(--accent)] focus:ring-2"
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">Phone</label>
        <input
          className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
          {...register("phone")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Bio</label>
        <textarea
          rows={4}
          className="mt-2 w-full resize-none rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 outline-none ring-[var(--accent)] focus:ring-2"
          {...register("bio")}
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save changes
      </button>
    </form>
  );
}
