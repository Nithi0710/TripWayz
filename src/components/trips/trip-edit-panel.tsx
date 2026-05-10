"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BookingStatus,
  TravelStyle,
  type Activity,
  type Booking,
} from "@prisma/client";
import { format } from "date-fns";
import { Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

type Props = {
  booking: Pick<
    Booking,
    | "id"
    | "startDate"
    | "endDate"
    | "adults"
    | "children"
    | "budget"
    | "travelStyle"
    | "specialRequests"
    | "status"
  > & {
    activityIds: string[];
  };
  activities: Activity[];
};

const styleLabels: TravelStyle[] = [
  TravelStyle.BUDGET,
  TravelStyle.COMFORT,
  TravelStyle.LUXURY,
];

function toInputDate(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function TripEditPanel({ booking, activities }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState(toInputDate(booking.startDate));
  const [endDate, setEndDate] = useState(toInputDate(booking.endDate));
  const [adults, setAdults] = useState(booking.adults);
  const [children, setChildren] = useState(booking.children);
  const [budget, setBudget] = useState(Number(booking.budget));
  const [travelStyle, setTravelStyle] = useState(booking.travelStyle);
  const [specialRequests, setSpecialRequests] = useState(
    booking.specialRequests ?? "",
  );
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    for (const id of booking.activityIds) m[id] = true;
    return m;
  });

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((id) => selected[id]),
    [selected],
  );

  if (booking.status === BookingStatus.CANCELLED) return null;

  async function save() {
    setSaving(true);
    try {
      const s = new Date(`${startDate}T12:00:00`);
      const e = new Date(`${endDate}T12:00:00`);
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: s.toISOString(),
          endDate: e.toISOString(),
          adults,
          children,
          budget,
          travelStyle,
          specialRequests: specialRequests || null,
          activityIds: selectedIds,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(
          typeof data.error === "string"
            ? data.error
            : "Could not update booking.",
        );
        return;
      }
      toast.success("Booking updated.");
      router.refresh();
      setOpen(false);
    } catch {
      toast.error("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold">Edit booking</p>
          <p className="text-xs text-[var(--muted)]">
            Adjust dates, travelers, style, notes, and add-ons.
          </p>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0" />
        )}
      </button>
      {open && (
        <div className="space-y-5 border-t border-[var(--surface-border)] px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Start
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2"
              />
            </label>
            <label className="text-sm font-medium">
              End
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2"
              />
            </label>
            <label className="text-sm font-medium">
              Adults
              <input
                type="number"
                min={1}
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2"
              />
            </label>
            <label className="text-sm font-medium">
              Children
              <input
                type="number"
                min={0}
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2"
              />
            </label>
            <label className="text-sm font-medium sm:col-span-2">
              Budget (USD)
              <input
                type="number"
                min={100}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2"
              />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium">Travel style</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {styleLabels.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTravelStyle(s)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold",
                    travelStyle === s
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--surface-border)] bg-white/5",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <label className="text-sm font-medium">
            Special requests
            <textarea
              rows={3}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="mt-2 w-full resize-none rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-2"
            />
          </label>
          <div>
            <p className="text-sm font-medium">Add-ons</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {activities.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() =>
                    setSelected((p) => ({ ...p, [a.id]: !p[a.id] }))
                  }
                  className={cn(
                    "flex gap-3 rounded-2xl border p-3 text-left text-sm transition",
                    selected[a.id]
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--surface-border)] bg-white/5",
                  )}
                >
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={a.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 font-medium leading-snug">
                        {a.name}
                      </p>
                      {selected[a.id] && (
                        <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      ${Number(a.price).toFixed(0)} · {a.duration}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
        </div>
      )}
    </div>
  );
}
