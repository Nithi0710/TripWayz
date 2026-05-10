"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import type { Destination } from "@prisma/client";

type Props = { destination: Destination; index: number };

export function DestinationCard({ destination, index }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[var(--radius)] border border-[var(--surface-border)] bg-[var(--surface)] shadow-[var(--shadow-soft)] backdrop-blur-xl"
    >
      <Link href={`/destinations/${destination.slug}`} className="block">
        <div className="relative aspect-[16/11] overflow-hidden">
          <Image
            src={destination.imageUrl}
            alt={destination.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
            priority={index < 3}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Curated stay
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                {destination.name}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
                <MapPin className="h-3.5 w-3.5" />
                {destination.country ?? "Worldwide"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 px-3 py-2 text-right text-sm backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-wide text-white/70">
                From
              </div>
              <div className="text-lg font-semibold">
                ${Number(destination.basePrice).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2 p-4">
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
            {destination.description}
          </p>
          <span className="inline-flex text-sm font-semibold text-[var(--accent)]">
            Plan this trip →
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
