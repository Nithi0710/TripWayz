# ✈️ TripWayz – Personalized Travel Planning Platform

A production-ready Next.js travel planning application with advanced UI, database modeling, and end-to-end booking functionality.

TripWayz helps users discover destinations, create personalized travel plans, book trips, manage itineraries, upload profile avatars, and share travel experiences publicly. The platform also includes a comprehensive Admin Dashboard with analytics, user management, and booking administration.

---

## Features

### ✅ Authentication System
- Email/password signup and login
- Secure password hashing with bcryptjs
- Protected routes with NextAuth.js
- Session management
- Role-based access control (USER / ADMIN)

### ✅ Personalized Dashboard
- Welcome dashboard with travel statistics
- Featured destinations
- Quick actions and recommendations
- Responsive animated cards

### ✅ Destination Explorer
- Browse 20 curated destinations
- High-quality travel images
- Detailed descriptions and pricing
- Search and filtering

### ✅ Smart Booking Wizard
- Select destination and travel dates
- Configure adults and children
- Choose budget and travel style
- Optional activities and add-ons
- Special requests
- Automatic pricing calculations
- Real-time trip summary

### ✅ My Trips Management
- View upcoming and completed trips
- Cancel bookings
- Public share links
- Copy link and Facebook sharing

### ✅ Profile Management
- Update user profile information
- Upload avatars using Supabase Storage
- Manage preferences and settings

### ✅ Admin Dashboard
- KPI cards and analytics
- Charts with Recharts
- User and booking management
- Search, filter, and delete functionality

### ✅ Premium UI/UX
- Glassmorphism and gradient design
- Framer Motion animations
- Mobile-first responsive layout
- Toast notifications with Sonner
- Light/Dark mode toggle

### ✅ Modern Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma ORM with PostgreSQL
- Supabase for database and storage

---

## Tech Stack

Framework: Next.js 14 (App Router)
Language: TypeScript
Styling: Tailwind CSS
Animation: Framer Motion
Database: PostgreSQL (Supabase)
ORM: Prisma
Authentication: NextAuth.js
Storage: Supabase Storage
Validation: Zod
Forms: React Hook Form
Charts: Recharts
Notifications: Sonner
Password Hashing: bcryptjs

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase project (PostgreSQL + Storage)

### Installation

Clone or navigate to the project directory:

cd tripwayz

Install dependencies:

npm install

### Environment Setup

Copy `.env.example` to `.env` and configure:

DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=your-secure-random-string
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

### Database Setup

Option 1: Run Prisma migrations

npx prisma migrate dev --name init

Option 2: Push schema directly

npx prisma db push

### Seed Database

npm run db:seed

The seed script creates:
- Admin account
- Demo user
- 20 destinations
- 100 activities
- Sample bookings

### Create Storage Bucket

In Supabase Storage:
- Create a new bucket named `avatars`
- Enable Public Bucket

### Start Development Server

npm run dev

Open your browser:

http://localhost:3000

---

## Default Credentials

### Admin Account
Email: admin@tripwayz.com
Password: Admin@123

### Demo User
Email: demo@tripwayz.com
Password: User@123

---

## Project Structure
tripwayz/
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── destinations/
│   │   ├── faq/
│   │   ├── fonts/
│   │   ├── login/
│   │   ├── personal-plan/
│   │   ├── profile/
│   │   ├── signup/
│   │   ├── trip/
│   │   ├── trips/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── customer/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── profile/
│   │   ├── trips/
│   │   ├── providers.tsx
│   │   └── theme-toggle.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── auth-options.ts
│   │   ├── booking-pricing.ts
│   │   ├── constants.ts
│   │   ├── faq-data.ts
│   │   ├── prisma.ts
│   │   ├── session.ts
│   │   ├── slug.ts
│   │   ├── vercel-env.ts
│   │   └── types/
│   │       └── next-auth.d.ts
│   │
│   └── middleware.ts
│
├── supabase/
│   └── schema.sql
│
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

---

## Database Schema

The application uses the following core models:

- User
- Destination
- Booking
- Activity
- Expense
- SharedTrip
- UserPreferences

---

## Available Scripts

# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Create/apply migrations
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio

# Quality
npm run lint         # Run ESLint

---

## Features Implemented

### ✅ Completed
- Authentication (Login, Signup, Protected Routes)
- Dashboard with travel statistics
- Destination Explorer
- Smart Booking Wizard
- My Trips Management
- Public Trip Sharing
- Profile Management with avatar upload
- Admin Dashboard with analytics
- Responsive UI with animations

### 🚧 Planned for Future Enhancement
- AI itinerary recommendations
- Real-time weather integration
- Payment gateway integration
- PDF itinerary export
- Email notifications
- Multi-language support

---

## Design System

Colors
- Primary: Deep Blue (#0F4C81) / Teal (#0D9488)
- Secondary: Coral (#FF6B6B) / Warm Orange (#F59E0B)
- Neutrals: Slate 50–900

Typography
- Font: Inter
- Headings: Bold, 4xl → xl
- Body: Base (16px)

Components
- Rounded: 2xl (16px) for cards
- Shadows: Soft, Card, Elevated
- Animations: Fade-in, Slide-up, Scale-in (200–300ms)

---

## Seeded Data

The database includes:
- 1 Admin User (admin@tripwayz.com)
- 1 Demo User (demo@tripwayz.com)
- 20 Destinations
- 100 Activities
- Sample bookings and analytics data

---

## Production Deployment

For deployment to Vercel:
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

Required environment variables:
- DATABASE_URL
- DIRECT_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

---

## Security Notes

- Never commit `.env` files or secrets
- Keep NEXTAUTH_SECRET private
- Restrict Supabase Storage policies before production
- Protect admin accounts with strong passwords

---

## License

Private project – All rights reserved.

---

Built with ❤️ using Next.js 14, TypeScript, Prisma, Supabase, and Tailwind CSS.
