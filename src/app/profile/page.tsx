import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ProfileForm } from "@/components/profile/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user?.id || !session.user.email) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Update how you appear across TripWayz and manage your avatar.
        </p>
      </div>
      <div className="glass-panel p-6 sm:p-8">
        <ProfileForm
          email={session.user.email}
          defaultValues={{
            name: profile?.name ?? session.user.name ?? "",
            phone: profile?.phone,
            bio: profile?.bio,
            avatarUrl: profile?.avatarUrl ?? null,
          }}
        />
      </div>
    </div>
  );
}
