import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sign in to continue planning your next escape.
        </p>
      </div>
      <div className="glass-panel p-6 sm:p-8">
        <Suspense
          fallback={
            <div className="py-8 text-center text-sm text-[var(--muted)]">
              Loading…
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
