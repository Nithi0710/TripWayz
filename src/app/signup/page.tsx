import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create your TripWayz account
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Save trips, share itineraries, and travel with clarity.
        </p>
      </div>
      <div className="glass-panel p-6 sm:p-8">
        <SignupForm />
      </div>
    </div>
  );
}
