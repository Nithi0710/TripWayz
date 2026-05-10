import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PersonalPlanForm } from "@/components/customer/personal-plan-form";

export const dynamic = "force-dynamic";

export default function PersonalPlanPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-500 dark:text-violet-300">
          Personal trip planning
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Plan outside the catalog
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Packages are great when you want a curated flow. Use this form when
          you already know where you’re headed—or you want something bespoke—and
          we’ll capture every detail for follow-up.
        </p>
      </div>
      <div className="glass-panel p-6 sm:p-8">
        <PersonalPlanForm />
      </div>
    </div>
  );
}
