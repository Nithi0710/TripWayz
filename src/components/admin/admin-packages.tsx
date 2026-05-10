"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type AdminDestinationRow = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  basePrice: number;
  country: string | null;
};

type Props = { destinations: AdminDestinationRow[] };

export function AdminPackagesManager({ destinations }: Props) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80",
  );
  const [basePrice, setBasePrice] = useState("1499");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  async function createPackage(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(basePrice.replace(/,/g, ""));
    if (!name.trim() || description.trim().length < 10 || Number.isNaN(price) || price <= 0) {
      toast.error("Name, description (10+ chars), and valid price are required.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          basePrice: price,
          country: country.trim() || null,
          region: region.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Create failed.");
        return;
      }
      toast.success("Package added — customers will see it on Explore.");
      setName("");
      setDescription("");
      setCountry("");
      setRegion("");
      router.refresh();
    } catch {
      toast.error("Network error.");
    } finally {
      setCreating(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this package? Bookings linked to it block deletion."))
      return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(
          typeof data.error === "string" ? data.error : "Could not delete.",
        );
        return;
      }
      toast.success("Package removed.");
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="glass-panel space-y-6 p-6">
      <div>
        <h2 className="text-lg font-semibold">Packages (destinations)</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          New packages appear immediately on every customer’s Explore page.
          Optional: add activities later via database or future tooling.
        </p>
      </div>

      <form onSubmit={createPackage} className="grid gap-4 border-t border-[var(--surface-border)] pt-6 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm font-medium">
          Name *
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2.5"
            placeholder="Kyoto Spring Escape"
          />
        </label>
        <label className="sm:col-span-2 text-sm font-medium">
          Description * (min 10 characters)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-none rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2.5"
          />
        </label>
        <label className="text-sm font-medium">
          Image URL *
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2.5 text-sm"
          />
        </label>
        <label className="text-sm font-medium">
          Base price (USD) *
          <input
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2.5"
          />
        </label>
        <label className="text-sm font-medium">
          Country
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2.5"
          />
        </label>
        <label className="text-sm font-medium">
          Region
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2.5"
          />
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add package
          </button>
        </div>
      </form>

      <div className="border-t border-[var(--surface-border)] pt-6">
        <h3 className="text-sm font-semibold">
          Current packages ({destinations.length})
        </h3>
        <ul className="mt-4 space-y-3">
          {destinations.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--surface-border)] bg-white/5 p-3"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{d.name}</p>
                <p className="text-xs text-[var(--muted)]">
                  ${d.basePrice.toLocaleString()}
                  {d.country ? ` · ${d.country}` : ""} · /destinations/{d.slug}
                </p>
                <Link
                  href={`/destinations/${d.slug}`}
                  className="text-xs font-semibold text-[var(--accent)]"
                >
                  Preview
                </Link>
              </div>
              <button
                type="button"
                onClick={() => remove(d.id)}
                disabled={deleting === d.id}
                className="inline-flex items-center gap-1 rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-300"
              >
                {deleting === d.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
