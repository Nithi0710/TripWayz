export function nextAuthUrlHint(): string | undefined {
  const url = process.env.NEXTAUTH_URL?.trim();
  if (process.env.VERCEL && !url) {
    return "Set NEXTAUTH_URL on Vercel to your site URL (https://your-app.vercel.app) with no trailing slash.";
  }
  if (url?.startsWith("http://") && process.env.VERCEL) {
    return "NEXTAUTH_URL should use https:// on Vercel, not http://.";
  }
  return undefined;
}
