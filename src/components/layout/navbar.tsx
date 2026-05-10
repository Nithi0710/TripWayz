"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Compass,
  HelpCircle,
  LayoutDashboard,
  LogIn,
  LogOut,
  PenLine,
  Plane,
  Shield,
  UserRound,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

const links = [
  { href: "/dashboard", label: "Explore", icon: LayoutDashboard },
  { href: "/personal-plan", label: "Personal plan", icon: PenLine },
  { href: "/trips", label: "My Trips", icon: Plane },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-[var(--surface-border)] bg-[var(--surface)]/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href={session ? "/dashboard" : "/"}
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Compass className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">TripWayz</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {session &&
            links.map((l) => {
              const active =
                pathname === l.href || pathname.startsWith(`${l.href}/`);
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--text)]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {l.label}
                </Link>
              );
            })}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]",
              )}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {status === "loading" ? (
            <span className="h-9 w-20 animate-pulse rounded-full bg-white/10" />
          ) : session ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white/5 px-3 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:opacity-95"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>
      </div>

      {session && (
        <div className="flex gap-1 overflow-x-auto border-t border-[var(--surface-border)] px-4 py-2 md:hidden">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex shrink-0 items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium"
              >
                <Icon className="h-3.5 w-3.5" />
                {l.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex shrink-0 items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </div>
      )}
    </motion.header>
  );
}
