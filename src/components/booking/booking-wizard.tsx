"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TravelStyle, type Activity, type Destination } from "@prisma/client";
import { format } from "date-fns";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  computeAddonsTotal,
  computeBaseTotal,
} from "@/lib/booking-pricing";
import { cn } from "@/lib/cn";

type Props = {
  destination: Destination;
  activities: Activity[];
};

const steps = ["Trip details", "Add-ons", "Summary"] as const;

const styleLabels: Record<TravelStyle, string> = {
  BUDGET: "Budget — smart essentials",
  COMFORT: "Comfort — balanced pace",
  LUXURY: "Luxury — elevated touches",
};

const categoryLabel = (c: string) =>
  c.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase());

export function BookingWizard({ destination, activities }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState(3500);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(
    TravelStyle.COMFORT,
  );
  const [specialRequests, setSpecialRequests] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedActivities = useMemo(
    () => activities.filter((a) => selected[a.id]),
    [activities, selected],
  );

  const preview = useMemo(() => {
    if (!startDate || !endDate) {
      return { base: 0, addons: 0, total: 0, nights: 0 };
    }
    const s = new Date(`${startDate}T12:00:00`);
    const e = new Date(`${endDate}T12:00:00`);
    if (e <= s) return { base: 0, addons: 0, total: 0, nights: 0 };
    const base = computeBaseTotal({
      basePrice: Number(destination.basePrice),
      startDate: s,
      endDate: e,
      adults,
      children,
      travelStyle,
    });
    const addons = computeAddonsTotal(
      selectedActivities.map((a) => ({
        unitPrice: Number(a.price),
        quantity: 1,
      })),
    );
    const nights = Math.max(
      1,
      Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)),
    );
    return {
      base,
      addons,
      total: Math.round((base + addons) * 100) / 100,
      nights,
    };
  }, [
    startDate,
    endDate,
    adults,
    children,
    travelStyle,
    destination.basePrice,
    selectedActivities,
  ]);

  function toggleActivity(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function confirm() {
    if (!startDate || !endDate) {
      toast.error("Please select travel dates.");
      return;
    }
    const s = new Date(`${startDate}T12:00:00`);
    const e = new Date(`${endDate}T12:00:00`);
    if (e <= s) {
      toast.error("End date must be after start date.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId: destination.id,
          startDate: s.toISOString(),
          endDate: e.toISOString(),
          adults,
          children,
          budget,
          travelStyle,
          specialRequests: specialRequests || null,
          activityIds: selectedActivities.map((a) => a.id),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Booking failed.");
        return;
      }
      toast.success("Trip confirmed!");
      router.push(`/trips/${data.id}`);
    } catch {
      toast.error("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass-panel p-6 sm:p-8">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {steps.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                step === i
                  ? "bg-[var(--accent)] text-white"
                  : "bg-white/5 text-[var(--muted)] hover:text-[var(--text)]",
              )}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Start date
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  End date
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Adults
                  <input
                    type="number"
                    min={1}
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Children
                  <input
                    type="number"
                    min={0}
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
                  />
                </label>
              </div>
              <label className="block text-sm font-medium">
                Total budget (USD)
                <input
                  type="number"
                  min={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
                />
              </label>
              <div>
                <p className="text-sm font-medium">Travel style</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {(Object.keys(styleLabels) as TravelStyle[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setTravelStyle(k)}
                      className={cn(
                        "rounded-2xl border px-3 py-3 text-left text-sm transition",
                        travelStyle === k
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--surface-border)] bg-white/5 hover:border-white/20",
                      )}
                    >
                      {styleLabels[k]}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block text-sm font-medium">
                Special requests
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                  placeholder="Dietary needs, celebrations, pace preferences…"
                  className="mt-2 w-full resize-none rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2"
                />
              </label>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-4"
            >
              <p className="text-sm text-[var(--muted)]">
                Curated add-ons for {destination.name}. Select any combination.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {activities.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleActivity(a.id)}
                    className={cn(
                      "flex gap-3 rounded-2xl border p-3 text-left transition",
                      selected[a.id]
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--surface-border)] bg-white/5 hover:border-white/25",
                    )}
                  >
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={a.imageUrl}
                        alt={a.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold leading-snug">
                            {a.name}
                          </p>
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                            {categoryLabel(a.category)}
                          </p>
                        </div>
                        {selected[a.id] && (
                          <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs text-[var(--muted)]">
                        {a.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span>{a.duration}</span>
                        <span className="font-semibold text-[var(--text)]">
                          ${Number(a.price).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-4 text-sm"
            >
              <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Destination
                </p>
                <p className="mt-1 text-lg font-semibold">{destination.name}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4">
                  <p className="text-xs text-[var(--muted)]">Dates</p>
                  <p className="mt-1 font-medium">
                    {startDate && endDate
                      ? `${format(new Date(`${startDate}T12:00:00`), "MMM d")} – ${format(new Date(`${endDate}T12:00:00`), "MMM d, yyyy")}`
                      : "Select dates in step 1"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {preview.nights} night{preview.nights === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4">
                  <p className="text-xs text-[var(--muted)]">Travelers</p>
                  <p className="mt-1 font-medium">
                    {adults} adult{adults === 1 ? "" : "s"},{" "}
                    {children} child{children === 1 ? "" : "ren"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Style: {styleLabels[travelStyle]}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4">
                <p className="text-xs text-[var(--muted)]">Add-ons</p>
                {selectedActivities.length === 0 ? (
                  <p className="mt-2 text-[var(--muted)]">None selected</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {selectedActivities.map((a) => (
                      <li
                        key={a.id}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span className="line-clamp-1">{a.name}</span>
                        <span className="shrink-0 font-medium">
                          ${Number(a.price).toFixed(0)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {specialRequests && (
                <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4">
                  <p className="text-xs text-[var(--muted)]">Requests</p>
                  <p className="mt-1 whitespace-pre-wrap">{specialRequests}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(2, s + 1))}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={confirm}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm booking
            </button>
          )}
        </div>
      </div>

      <aside className="glass-panel h-fit p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Live estimate
        </h3>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Stay & transport core</span>
            <span className="font-semibold">
              ${preview.base.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Add-ons</span>
            <span className="font-semibold">
              ${preview.addons.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="my-3 h-px bg-[var(--surface-border)]" />
          <div className="flex justify-between text-base">
            <span className="font-medium">Estimated total</span>
            <span className="text-xl font-bold text-[var(--accent)]">
              ${preview.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            Pricing updates with nights, travelers, travel style, and selected
            experiences. Final charges may vary with availability.
          </p>
          <div className="rounded-2xl bg-[var(--accent-soft)] p-4 text-xs text-[var(--muted)]">
            Budget target:{" "}
            <span className="font-semibold text-[var(--text)]">
              ${budget.toLocaleString()}
            </span>
            {preview.total > budget && (
              <span className="mt-2 block text-amber-600 dark:text-amber-300">
                Estimate exceeds budget — adjust dates, style, or add-ons.
              </span>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
