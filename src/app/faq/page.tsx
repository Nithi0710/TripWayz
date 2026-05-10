import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FaqAccordion } from "@/components/customer/faq-accordion";
import { CUSTOMER_FAQ } from "@/lib/faq-data";

export const dynamic = "force-dynamic";

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Frequently asked questions
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          {CUSTOMER_FAQ.length} answers for signed-in travelers—packages,
          personal plans, bookings, and sharing.
        </p>
      </div>
      <FaqAccordion />
    </div>
  );
}
