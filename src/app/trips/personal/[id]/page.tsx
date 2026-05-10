import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ArrowLeft, PenLine } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PersonalTripDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const { id } = await params;
  const plan = await prisma.personalTripRequest.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!plan) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Link
        href="/trips"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My trips
      </Link>

      <div className="glass-panel p-6 sm:p-8">
        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-300">
          <PenLine className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Personal trip
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {plan.tripTitle ?? "Custom itinerary request"}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Submitted {format(plan.createdAt, "MMM d, yyyy")} · {plan.status}
        </p>

        <div className="mt-6 space-y-4 text-sm">
          <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4">
            <p className="text-xs font-semibold text-[var(--muted)]">Your brief</p>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">
              {plan.destinationNotes}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4">
              <p className="text-xs text-[var(--muted)]">Dates</p>
              <p className="mt-1 font-medium">
                {plan.startDate && plan.endDate
                  ? `${format(plan.startDate, "MMM d, yyyy")} – ${format(plan.endDate, "MMM d, yyyy")}`
                  : "Flexible / to be confirmed"}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4">
              <p className="text-xs text-[var(--muted)]">Travelers</p>
              <p className="mt-1 font-medium">
                {plan.adults} adults · {plan.children} children
              </p>
            </div>
            {plan.budget != null && (
              <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4 sm:col-span-2">
                <p className="text-xs text-[var(--muted)]">Budget</p>
                <p className="mt-1 font-medium">
                  ${Number(plan.budget).toLocaleString()} USD
                </p>
              </div>
            )}
            {plan.travelStyle && (
              <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4 sm:col-span-2">
                <p className="text-xs text-[var(--muted)]">Style</p>
                <p className="mt-1 font-medium">{plan.travelStyle}</p>
              </div>
            )}
          </div>

          {plan.specialRequests && (
            <div className="rounded-2xl border border-[var(--surface-border)] bg-white/5 p-4">
              <p className="text-xs text-[var(--muted)]">Extra notes</p>
              <p className="mt-2 whitespace-pre-wrap">{plan.specialRequests}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
