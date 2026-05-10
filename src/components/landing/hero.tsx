"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

type Props = { loggedIn: boolean };

export function HeroSection({ loggedIn }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)] backdrop-blur-xl">
        <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
        TripWayz — Personalized Travel Planning Platform
      </span>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
        Journeys that feel{" "}
        <span className="text-gradient">effortlessly yours</span>.
      </h1>
      <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
        Curated destinations, transparent pricing, optional experiences, and
        itineraries you can share — crafted with the polish of modern travel
        brands you love.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {loggedIn ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25"
          >
            Open dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25"
            >
              Start planning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold backdrop-blur-xl"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
}
