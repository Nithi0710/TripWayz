"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { BookingStatus, Role } from "@prisma/client";
import { Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type AdminUserRow = {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  name: string | null;
  bookingsCount: number;
};

export type AdminBookingRow = {
  id: string;
  status: BookingStatus;
  grandTotal: number;
  createdAt: string;
  startDate: string;
  destinationName: string;
  customerEmail: string;
  customerName: string | null;
};

type Props = {
  stats: {
    totalUsers: number;
    totalBookings: number;
    revenue: number;
  };
  popularDestinations: { name: string; bookings: number }[];
  bookingTrend: { month: string; count: number; revenue: number }[];
  userGrowth: { month: string; count: number }[];
  users: AdminUserRow[];
  bookings: AdminBookingRow[];
};

export function AdminDashboard({
  stats,
  popularDestinations,
  bookingTrend,
  userGrowth,
  users,
  bookings,
}: Props) {
  const [userQuery, setUserQuery] = useState("");
  const [bookingQuery, setBookingQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name?.toLowerCase().includes(q) ?? false),
    );
  }, [users, userQuery]);

  const filteredBookings = useMemo(() => {
    const q = bookingQuery.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        b.destinationName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        (b.customerName?.toLowerCase().includes(q) ?? false),
    );
  }, [bookings, bookingQuery]);

  async function deleteUser(id: string) {
    if (!confirm("Delete this user and related data?")) return;
    setDeleting(`u:${id}`);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Could not delete user.");
        return;
      }
      toast.success("User deleted.");
      window.location.reload();
    } finally {
      setDeleting(null);
    }
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking permanently?")) return;
    setDeleting(`b:${id}`);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Could not delete booking.");
        return;
      }
      toast.success("Booking deleted.");
      window.location.reload();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total users", value: stats.totalUsers },
          { label: "Total bookings", value: stats.totalBookings },
          {
            label: "Revenue (non-cancelled)",
            value: `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}`,
          },
        ].map((k) => (
          <div key={k.label} className="glass-panel p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {k.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-5">
          <h2 className="text-sm font-semibold">Booking trend</h2>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrend}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--accent)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--surface-border)",
                    background: "var(--surface)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--accent)"
                  fill="url(#rev)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel p-5">
          <h2 className="text-sm font-semibold">New travelers</h2>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--surface-border)",
                    background: "var(--surface)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--accent)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel p-5">
        <h2 className="text-sm font-semibold">Popular destinations</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularDestinations} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--surface-border)",
                  background: "var(--surface)",
                }}
              />
              <Bar dataKey="bookings" fill="#7c3aed" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Users</h2>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Search email or name"
              className="w-64 rounded-full border border-[var(--surface-border)] bg-white/5 py-2 pl-9 pr-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
            />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-[var(--muted)]">
                <th className="pb-2">User</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Bookings</th>
                <th className="pb-2">Joined</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t border-[var(--surface-border)]">
                  <td className="py-3">
                    <p className="font-medium">{u.email}</p>
                    <p className="text-xs text-[var(--muted)]">{u.name}</p>
                  </td>
                  <td className="py-3">{u.role}</td>
                  <td className="py-3">{u.bookingsCount}</td>
                  <td className="py-3 text-[var(--muted)]">
                    {format(parseISO(u.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => deleteUser(u.id)}
                      disabled={deleting === `u:${u.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-red-500/30 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-300"
                    >
                      {deleting === `u:${u.id}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Bookings</h2>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={bookingQuery}
              onChange={(e) => setBookingQuery(e.target.value)}
              placeholder="Destination or guest"
              className="w-64 rounded-full border border-[var(--surface-border)] bg-white/5 py-2 pl-9 pr-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
            />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-[var(--muted)]">
                <th className="pb-2">Destination</th>
                <th className="pb-2">Guest</th>
                <th className="pb-2">Dates</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Status</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} className="border-t border-[var(--surface-border)]">
                  <td className="py-3 font-medium">{b.destinationName}</td>
                  <td className="py-3">
                    <p>{b.customerEmail}</p>
                    <p className="text-xs text-[var(--muted)]">{b.customerName}</p>
                  </td>
                  <td className="py-3 text-[var(--muted)]">
                    {format(parseISO(b.startDate), "MMM d, yyyy")}
                  </td>
                  <td className="py-3">
                    ${b.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3">{b.status}</td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => deleteBooking(b.id)}
                      disabled={deleting === `b:${b.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-red-500/30 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-300"
                    >
                      {deleting === `b:${b.id}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
