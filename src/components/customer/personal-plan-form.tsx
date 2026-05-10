"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TravelStyle } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const schema = z
  .object({
    tripTitle: z.string().max(200).optional(),
    destinationNotes: z
      .string()
      .min(10, "Share enough detail so we can understand your trip"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    adults: z.number().int().min(1).max(30),
    children: z.number().int().min(0).max(30),
    budget: z.string().optional(),
    travelStyle: z.string().optional(),
    specialRequests: z.string().max(5000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.endDate <= data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End must be after start",
        path: ["endDate"],
      });
    }
  });

type Form = z.infer<typeof schema>;

function toIso(dateStr: string | undefined, endOfDay = false) {
  if (!dateStr?.trim()) return null;
  const d = new Date(`${dateStr}T${endOfDay ? "23:59:59" : "12:00:00"}`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function PersonalPlanForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      adults: 2,
      children: 0,
      travelStyle: "",
    },
  });

  async function onSubmit(values: Form) {
    setBusy(true);
    try {
      const budgetNum = values.budget?.trim()
        ? Number(values.budget.replace(/,/g, ""))
        : null;
      if (values.budget?.trim() && (budgetNum === null || Number.isNaN(budgetNum) || budgetNum <= 0)) {
        toast.error("Enter a valid budget or leave it blank.");
        setBusy(false);
        return;
      }

      const ts = values.travelStyle?.trim();
      const travelStyle =
        ts && (Object.values(TravelStyle) as string[]).includes(ts)
          ? (ts as TravelStyle)
          : null;

      const res = await fetch("/api/personal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripTitle: values.tripTitle?.trim() || null,
          destinationNotes: values.destinationNotes.trim(),
          startDate: toIso(values.startDate) ?? null,
          endDate: toIso(values.endDate, true) ?? null,
          adults: values.adults,
          children: values.children,
          budget: budgetNum,
          travelStyle,
          specialRequests: values.specialRequests?.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(
          typeof data.error === "string"
            ? data.error
            : "Could not submit request.",
        );
        return;
      }
      const id = typeof data.id === "string" ? data.id : null;
      toast.success("Personal plan saved — see My Trips.");
      if (id) router.push(`/trips/personal/${id}`);
      else router.push("/trips");
      router.refresh();
    } catch {
      toast.error("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-sm font-medium">Trip title (optional)</label>
        <input
          className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 outline-none ring-violet-500 focus:ring-2"
          placeholder="e.g. Honeymoon in the Alps"
          {...register("tripTitle")}
        />
      </div>
      <div>
        <label className="text-sm font-medium">
          Where & how you want to travel *
        </label>
        <textarea
          rows={5}
          className="mt-2 w-full resize-none rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 outline-none ring-violet-500 focus:ring-2"
          placeholder="Countries, cities, pace, must-sees, transport preferences…"
          {...register("destinationNotes")}
        />
        {errors.destinationNotes && (
          <p className="mt-1 text-xs text-red-500">
            {errors.destinationNotes.message}
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Start date (optional)
          <input
            type="date"
            className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
            {...register("startDate")}
          />
        </label>
        <label className="text-sm font-medium">
          End date (optional)
          <input
            type="date"
            className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
            {...register("endDate")}
          />
        </label>
        {errors.endDate && (
          <p className="sm:col-span-2 text-xs text-red-500">
            {errors.endDate.message}
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Adults
          <input
            type="number"
            min={1}
            className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
            {...register("adults", { valueAsNumber: true })}
          />
        </label>
        <label className="text-sm font-medium">
          Children
          <input
            type="number"
            min={0}
            className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
            {...register("children", { valueAsNumber: true })}
          />
        </label>
      </div>
      <label className="text-sm font-medium">
        Budget USD (optional)
        <input
          className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
          placeholder="e.g. 4500"
          {...register("budget")}
        />
      </label>
      <label className="text-sm font-medium">
        Preferred style (optional)
        <select
          className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
          {...register("travelStyle")}
        >
          <option value="">No preference</option>
          <option value="BUDGET">Budget</option>
          <option value="COMFORT">Comfort</option>
          <option value="LUXURY">Luxury</option>
        </select>
      </label>
      <label className="text-sm font-medium">
        Anything else?
        <textarea
          rows={3}
          className="mt-2 w-full resize-none rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3"
          placeholder="Accessibility, celebrations, flights already booked…"
          {...register("specialRequests")}
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit personal plan
      </button>
    </form>
  );
}
