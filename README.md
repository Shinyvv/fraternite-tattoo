# La Fraternite Tattoo - Booking System

## Stack
- Next.js 16.2.6 (App Router)
- TypeScript 6.0
- Tailwind CSS 4.3.0
- shadcn/ui CLI 4.7.0
- Motion for React 12.38.0
- Prisma ORM 7.8.0
- PostgreSQL 18.3

## Setup
1. Copy `.env.example` to `.env` and configure `DATABASE_URL`.
2. Install dependencies: `npm install`.
3. Generate Prisma client: `npm run prisma:generate`.
4. Create migration: `npm run prisma:migrate`.
5. Run app: `npm run dev`.

## Main routes
- `/` landing edgy dark
- `/reservar` booking flow
- `/admin` admin management
