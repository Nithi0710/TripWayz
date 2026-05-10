# 🗺️ TripWayz - Personalized Travel Planning Platform

A production-ready Next.js travel planning application with advanced UI, database modeling, and end-to-end booking functionality.

TripWayz helps users discover destinations, create personalized travel plans, book trips, manage itineraries, upload profile avatars, and share travel experiences publicly. The platform also includes a comprehensive Admin Dashboard with analytics, user management, and booking administration.

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
- Browse 20+ curated destinations
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

## Tech Stack

**Framework:** Next.js 14 (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS  
**Animation:** Framer Motion  
**Database:** PostgreSQL (Supabase)  
**ORM:** Prisma  
**Authentication:** NextAuth.js  
**Storage:** Supabase Storage  
**Validation:** Zod  
**Forms:** React Hook Form  
**Charts:** Recharts  
**Notifications:** Sonner  
**Password Hashing:** bcryptjs

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase project (PostgreSQL + Storage)

### Installation

Clone or navigate to the project directory:

```bash
cd tripwayz
Install dependencies:

bash
npm install
Environment Setup
The .env and .env.local files need to be configured with your Supabase credentials. Copy .env.example to .env and update:

env
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_url
NEXTAUTH_SECRET=your-secure-random-string-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
Database Setup
Push the schema to the database:

bash
npx prisma db push
Or run migrations:

bash
npx prisma migrate dev --name init
Seed Database
The database comes pre-seeded with demo data!

bash
npm run db:seed
The seed script creates:

Admin account

Demo user

20 destinations

100 activities

Sample bookings

Storage Setup
In Supabase Storage:

Create a new bucket named avatars

Enable Public Bucket for avatar uploads

Start the development server
bash
npm run dev
Open your browser
text
http://localhost:3000
Demo Credentials
Admin Account
Email: admin@tripwayz.com
Password: Admin@123

Demo User
Email: demo@tripwayz.com
Password: User@123

Project Structure
text
tripwayz/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data script
├── public/
│   └── images/               # Static images
├── src/
│   ├── app/
│   │   ├── admin/            # Admin dashboard
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # User dashboard
│   │   ├── destinations/     # Destination explorer
│   │   ├── faq/              # FAQ page
│   │   ├── fonts/            # Custom fonts
│   │   ├── login/            # Login page
│   │   ├── personal-plan/    # Booking wizard
│   │   ├── profile/          # User profile
│   │   ├── signup/           # Signup page
│   │   ├── trip/             # Trip details
│   │   ├── trips/            # My trips
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── admin/            # Admin components
│   │   ├── auth/             # Auth components
│   │   ├── booking/          # Booking wizard
│   │   ├── customer/         # Customer components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── landing/          # Landing page components
│   │   ├── profile/          # Profile components
│   │   ├── trips/            # Trip components
│   │   ├── providers.tsx     # App providers
│   │   └── theme-toggle.tsx  # Theme toggle
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   ├── auth-options.ts   # NextAuth config
│   │   ├── booking-pricing.ts # Pricing logic
│   │   ├── constants.ts      # App constants
│   │   ├── faq-data.ts       # FAQ data
│   │   ├── prisma.ts         # Prisma client
│   │   ├── session.ts        # Session helpers
│   │   ├── slug.ts           # Slug utilities
│   │   ├── vercel-env.ts     # Vercel env helpers
│   │   └── types/
│   │       └── next-auth.d.ts # Auth type definitions
│   └── middleware.ts          # Route protection
├── supabase/
│   └── schema.sql            # SQL schema backup
├── .env.example              # Environment template
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
Database Schema
The application uses 7 main models:

User - User accounts with roles

Destination - Travel destinations (20+ seeded)

Booking - Trip bookings

Activity - Activities per destination

Expense - Trip expenses

SharedTrip - Public trip sharing

UserPreferences - User settings

Available Scripts
bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Create/apply migrations
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio to view data

# Quality
npm run lint         # Run ESLint
Features Implemented
✅ Completed (Core Features)
Authentication - Login, Signup, Protected Routes, Role-based access

Dashboard - Welcome dashboard with travel statistics

Destination Explorer - Browse 20+ cities with search and filtering

Smart Booking Wizard - Multi-step booking with pricing calculation

My Trips - View upcoming/completed trips with share functionality

Profile Management - Update info with avatar upload

Admin Dashboard - Analytics, user management, booking administration

Premium UI - Glassmorphism, gradients, animations, dark mode

🚧 Planned for Future Enhancement
AI itinerary recommendations

Real-time weather integration

Payment gateway integration

PDF itinerary export

Email notifications

Multi-language support

Design System
Colors
Primary: Deep Blue (#0F4C81) / Teal (#0D9488)

Secondary: Coral (#FF6B6B) / Warm Orange (#F59E0B)

Neutrals: Slate 50-900

Typography
Font: Inter

Headings: Bold, 4xl → xl

Body: Base (16px)

Components
Rounded: 2xl (16px) for cards

Shadows: Soft, Card, Elevated

Animations: Fade-in, Slide-up, Scale-in (200-300ms)

Seeded Data
The database includes:

1 Admin User (admin@tripwayz.com)

1 Demo User (demo@tripwayz.com)

20 Destinations (Paris, Tokyo, New York, Barcelona, Bali, Dubai, London, Rome, and more)

100 Activities (Tours, excursions, experiences)

Sample Bookings with analytics data

Notes
Glassmorphism and gradient UI design system

Animations powered by Framer Motion

Form validation using Zod + React Hook Form

Type-safe API routes with TypeScript

Responsive design (mobile-first approach)

Avatar upload with Supabase Storage

Production Deployment
For deployment to Vercel:

Push code to GitHub

Import repository in Vercel

Add environment variables in Vercel dashboard

Deploy!

Environment variables needed:
text
DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
Security Notes
Never commit .env files or secrets to version control

Keep NEXTAUTH_SECRET private and secure

Restrict Supabase Storage policies before production deployment

Protect admin accounts with strong passwords

Use role-based access control for sensitive routes

License
Private project - All rights reserved

Built with ❤️ using Next.js 14, TypeScript, Prisma, Supabase, and Tailwind CSS.
