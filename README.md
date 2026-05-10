# TripWayz – Personalized Travel Planning Platform

Production-oriented travel planning app built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Prisma**, **Supabase PostgreSQL & Storage**, **NextAuth.js (credentials)**, **Zod**, **React Hook Form**, **Recharts**, and **Sonner**.

## Features

- Email + password authentication with **bcrypt** hashing and **USER / ADMIN** roles
- **Dashboard** with 20 curated destination cards (imagery, copy, base pricing)
- **Booking flow**: dates, travelers, budget, travel style, special requests, optional add-ons (activities)
- **Trip summary** with automatic totals and breakdown
- **My Trips** with cancel flow and **public share links** (copy + Facebook sharer)
- **Profile** with Supabase **avatars** uploads (server uses **service role** key)
- **Admin panel**: KPIs, Recharts analytics, user & booking tables with search + delete

### Default admin (after seed)

- **Email:** `admin@tripwayz.com`
- **Password:** `Admin@123`

Demo user: `demo@tripwayz.com` / `User@123`

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project (Postgres + Storage)

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and fill in values from Supabase, a generated `NEXTAUTH_SECRET`, and **`SUPABASE_SERVICE_ROLE_KEY`** (needed for avatar uploads).

3. **Database schema**

   **Option A — Prisma (recommended)**

   ```bash
   npx prisma migrate dev --name init
   ```

   Or push without migration history (prototyping):

   ```bash
   npx prisma db push
   ```

   **Option B — Supabase SQL Editor**

   Run `supabase/schema.sql` if you prefer raw DDL. If tables already exist from Prisma, skip conflicting statements.

4. **Seed data** (admin, 20 destinations, 100 activities)

   ```bash
   npm run db:seed
   ```

5. **Supabase Storage — `avatars` bucket**

   In Supabase → **Storage** → **New bucket** → name **`avatars`**, enable **Public bucket** (so profile image URLs load in the app). The SQL in `supabase/schema.sql` can also create buckets; if upload still fails, confirm the bucket exists and that **`SUPABASE_SERVICE_ROLE_KEY`** is set in `.env`, then restart `npm run dev`.

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Next.js development server               |
| `npm run build`    | `prisma generate` + production build     |
| `npm run start`    | Start production server                  |
| `npm run lint`     | ESLint                                   |
| `npm run db:generate` | `prisma generate`                     |
| `npm run db:push`  | Push schema to database (no migrations) |
| `npm run db:migrate` | Create/apply migrations               |
| `npm run db:seed`  | Run `prisma/seed.ts`                   |
| `npm run db:studio`| Prisma Studio                          |

## Push to GitHub (step by step)

1. **Create a repo** on [GitHub](https://github.com/new) (e.g. `tripwayz`), empty, no README if you already have one locally.
2. **In the project folder** (`tripwayz`), initialize git if needed:

   ```bash
   git init
   git branch -M main
   ```

3. **Do not commit secrets.** Confirm `.env` is listed in `.gitignore` (it should be). Never commit `.env` or keys.
4. **Add and commit:**

   ```bash
   git add .
   git commit -m "Initial TripWayz app"
   ```

5. **Connect remote and push:**

   ```bash
   git remote add origin https://github.com/YOUR_USER/tripwayz.git
   git push -u origin main
   ```

   Replace `YOUR_USER` and repo name with yours. Use SSH instead of HTTPS if you prefer.

## Deploy on Vercel (step by step)

1. Sign in at [vercel.com](https://vercel.com/) and click **Add New… → Project**.
2. **Import** the GitHub repository you just pushed. If prompted, install the Vercel GitHub app for that repo.
3. **Root directory:** if the Next app lives in a subfolder (e.g. `odoo/tripwayz`), set **Root Directory** to `tripwayz` in project settings.
4. **Framework preset:** Next.js (default). Build: `npm run build`, Output: default.
5. **Environment variables** — add the same names as `.env.example` (Production + Preview if you use previews):

   | Name | Example / note |
   |------|----------------|
   | `DATABASE_URL` | **Transaction pooler** URL (port **6543**) + `?pgbouncer=true&connection_limit=1` — see below |
   | `NEXTAUTH_SECRET` | Long random string (required) |
   | `NEXTAUTH_URL` | Exact site URL: `https://your-project.vercel.app` — **https**, **no trailing slash** |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key from Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | **Service role** key (for avatar uploads only on server) |

6. Click **Deploy**. Set **`NEXTAUTH_URL`** to your production URL (this project: **`https://trip-wayz.vercel.app`**) with **no trailing slash**, then **Redeploy** so cookies and sign-in work.

### Why sign-up / login fails on Vercel (common fixes)

1. **`DATABASE_URL` must use the pooler on Vercel.** Serverless cannot reliably use the direct host `db.xxx.supabase.co:5432`. In Supabase go to **Project Settings → Database → Connection string**, choose **Transaction pooler**, copy the URI, and append if missing:
   `?pgbouncer=true&connection_limit=1`  
   Use **that** string as `DATABASE_URL` in Vercel only.

2. **`NEXTAUTH_URL` and `NEXTAUTH_SECRET`** must be set in the Vercel project (Production). `NEXTAUTH_URL` must be `https://…vercel.app` with **no** trailing slash.

3. **Tables must exist in production.** From your PC, run migrations using the **direct** (port 5432) connection string so Prisma can run DDL:

   ```bash
   set DATABASE_URL=postgresql://postgres:PASSWORD@db.YOUR_REF.supabase.co:5432/postgres
   npx prisma db push
   ```

   (Use `export` on Mac/Linux.) After tables exist, keep the **pooler** URL in Vercel for the live app.

4. **Check the database from the deployed app:** open `https://YOUR-APP.vercel.app/api/health/db` — if you see `ok: false`, the pooler URL or password is still wrong.

**After deploy:** run **`npx prisma db push`** (or `migrate deploy`) from your PC against the **direct** `5432` URL so tables exist; then seed only if you want demo users (`npm run db:seed`). Ensure the Supabase **`avatars`** bucket exists for profile photos.

### Remote images

`next.config.mjs` allows **Unsplash**, **Wikimedia**, **Pexels**, and **`*.supabase.co`** storage URLs for `next/image`. Seed images use Unsplash (Unsplash License).

## Project structure (high level)

- `src/app` — App Router pages & API routes
- `src/components` — UI, booking wizard, admin dashboard, forms
- `prisma/schema.prisma` — data model
- `prisma/seed.ts` — seed script
- `supabase/schema.sql` — optional SQL mirror + bucket inserts

## Security notes

- Replace permissive storage policies in `supabase/schema.sql` with authenticated, least-privilege rules before production.
- Keep `NEXTAUTH_SECRET` private; rotate if leaked.
- Admin deletion APIs are destructive — protect with strong admin passwords and monitoring.

## License

Private / your organization — adjust as needed.
