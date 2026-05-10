"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  BookingStatus,
  TravelStyle,
  type Activity,
  type Booking,
  type BookingActivity,
  type Destination,
  type SharedTrip,
} from "@prisma/client";
import { Copy, Loader2, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TripEditPanel } from "@/components/trips/trip-edit-panel";

type BookingActivityWithAct = BookingActivity & { activity: Activity };

type Props = {
  booking: Booking & {
    destination: Destination & { activities: Activity[] };
    activities: BookingActivityWithAct[];
  };
  shared: SharedTrip | null;
};

const styles: Record<TravelStyle, string> = {
  BUDGET: "Budget",
  COMFORT: "Comfort",
  LUXURY: "Luxury",
};

export function TripDetailClient({ booking, shared: initialShared }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(initialShared?.slug ?? null);
  const [busy, setBusy] = useState<string | null>(null);

  const publicUrl = useMemo(() => {
    if (typeof window === "undefined" || !slug) return "";
    return `${window.location.origin}/trip/${slug}`;
  }, [slug]);

  async function genShare() {
    setBusy("share");
    try {
      const res = await fetch(`/api/bookings/${booking.id}/share`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.slug) {
        toast.error("Could not create share link.");
        return;
      }
      setSlug(data.slug);
      toast.success("Share link ready — copy below.");
      router.refresh();
    } catch {
      toast.error("Network error.");
    } finally {
      setBusy(null);
    }
  }

  async function copyLink() {
    if (!publicUrl) {
      await genShare();
      return;
    }
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Link copied to clipboard.");
  }

  function shareFacebook() {
    if (!publicUrl) {
      toast.error("Generate a link first.");
      return;
    }
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function cancelTrip() {
    if (!confirm("Cancel this booking?")) return;
    setBusy("cancel");
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Could not cancel.");
        return;
      }
      toast.success("Booking cancelled.");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {booking.destination.name}
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              {format(booking.startDate, "MMM d, yyyy")} –{" "}
              {format(booking.endDate, "MMM d, yyyy")}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {booking.adults} adults · {booking.children} children ·{" "}
              {styles[booking.travelStyle]} · {booking.status}
            </p>
          </div>
          {booking.status !== BookingStatus.CANCELLED && (
            <button
              type="button"
              onClick={cancelTrip}
              disabled={busy === "cancel"}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-300"
            >
              {busy === "cancel" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Cancel booking
            </button>
          )}
        </div>

        {booking.specialRequests && (
          <div className="mt-6 rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4 text-sm">
            <p className="text-xs font-semibold text-[var(--muted)]">
              Special requests
            </p>
            <p className="mt-2 whitespace-pre-wrap">{booking.specialRequests}</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold">Price breakdown</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between">
              <span className="text-[var(--muted)]">Core package</span>
              <span className="font-medium">
                ${Number(booking.baseTotal).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-[var(--muted)]">Add-ons</span>
              <span className="font-medium">
                ${Number(booking.addonsTotal).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </li>
            <li className="flex justify-between border-t border-[var(--surface-border)] pt-3 text-base font-semibold">
              <span>Total</span>
              <span className="text-[var(--accent)]">
                ${Number(booking.grandTotal).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </li>
            <li className="flex justify-between text-xs text-[var(--muted)]">
              <span>Budget you set</span>
              <span>
                ${Number(booking.budget).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </li>
          </ul>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold">Share itinerary</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Anyone with the link can view a read-only version of this trip.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => (slug ? copyLink() : genShare())}
              disabled={busy === "share"}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
            >
              {busy === "share" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {slug ? "Copy link" : "Generate link"}
            </button>
            <button
              type="button"
              onClick={copyLink}
              disabled={!slug}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
            <button
              type="button"
              onClick={shareFacebook}
              disabled={!slug}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              Facebook
            </button>
          </div>
          {slug && publicUrl && (
            <p className="mt-4 break-all text-xs text-[var(--muted)]">
              {publicUrl}
            </p>
          )}
        </div>
      </div>

      <TripEditPanel
        booking={{
          id: booking.id,
          startDate: booking.startDate,
          endDate: booking.endDate,
          adults: booking.adults,
          children: booking.children,
          budget: booking.budget,
          travelStyle: booking.travelStyle,
          specialRequests: booking.specialRequests,
          status: booking.status,
          activityIds: booking.activities.map((x) => x.activityId),
        }}
        activities={booking.destination.activities}
      />

      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold">Selected add-ons</h2>
        {booking.activities.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">None</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {booking.activities.map((row) => (
              <li
                key={row.id}
                className="flex justify-between gap-4 border-b border-[var(--surface-border)] pb-3 last:border-0"
              >
                <span>{row.activity.name}</span>
                <span className="shrink-0 font-medium">
                  ${Number(row.unitPrice).toFixed(0)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
