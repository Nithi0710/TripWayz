"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutGrid, PenLine, HelpCircle, ArrowRight } from "lucide-react";

export function CustomerHub() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel flex flex-col justify-between p-5 md:col-span-2"
      >
        <div>
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <LayoutGrid className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Package trips
            </span>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            Browse curated destinations
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Fixed packages with photos, pricing, and optional add-ons—book in a
            few guided steps.
          </p>
        </div>
        <Link
          href="#packages"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]"
        >
          Scroll to packages
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-panel flex flex-col justify-between p-5"
      >
        <div>
          <div className="flex items-center gap-2 text-violet-500 dark:text-violet-300">
            <PenLine className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Personal plan
            </span>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            Plan your own way
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Describe any route, dates, and budget—we’ll route your request to
            planning.
          </p>
        </div>
        <Link
          href="/personal-plan"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
        >
          Start personal plan
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel flex flex-col justify-between p-5 md:col-span-3 md:flex-row md:items-center"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
          <div>
            <h2 className="font-semibold">Questions?</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Ten quick answers about packages, personal planning, and bookings.
            </p>
          </div>
        </div>
        <Link
          href="/faq"
          className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-semibold md:mt-0"
        >
          View FAQ
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}
