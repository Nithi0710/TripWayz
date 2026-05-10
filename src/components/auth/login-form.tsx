"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

type Form = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Form) {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password.");
      return;
    }
    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          autoComplete="email"
          className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 outline-none ring-[var(--accent)] focus:ring-2"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          autoComplete="current-password"
          className="mt-2 w-full rounded-2xl border border-[var(--surface-border)] bg-white/5 px-4 py-3 outline-none ring-[var(--accent)] focus:ring-2"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign in
      </button>
      <p className="text-center text-sm text-[var(--muted)]">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-[var(--accent)]">
          Create an account
        </Link>
      </p>
    </form>
  );
}
