"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CUSTOMER_FAQ } from "@/lib/faq-data";
import { cn } from "@/lib/cn";

export function FaqAccordion({ limit }: { limit?: number }) {
  const items = limit ? CUSTOMER_FAQ.slice(0, limit) : [...CUSTOMER_FAQ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--surface-border)] rounded-[var(--radius)] border border-[var(--surface-border)] bg-[var(--surface)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
            >
              <span className="text-sm font-semibold leading-snug">
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-[var(--muted)] transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <p className="border-t border-[var(--surface-border)] px-4 pb-4 pt-3 text-sm leading-relaxed text-[var(--muted)] sm:px-5">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
