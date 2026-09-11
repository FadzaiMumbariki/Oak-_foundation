# OAK Zimbabwe Partner Gathering — Web Platform

Live registration, QR check-in, and programme platform for the OAK Zimbabwe Foundation Partner Convening, **9–11 November 2026** at Cresta Lodge Msasa, Harare.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database / Auth | Supabase (Postgres + Auth + Storage) |
| QR Generation | `qrcode.react` |
| QR Scanning | `html5-qrcode` |
| Deployment | Vercel (app) · Supabase (backend) |

---

## Local Development Setup

### 1. Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A [Supabase](https://supabase.com) project

### 2. Clone & install

```bash
git clone <your-repo-url>
cd oak-platform
npm install
```

### 3. Environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local`** — it is already in `.gitignore`.

### 4. Apply database schema

Paste the contents of `supabase/migrations/001_initial_schema.sql` into the Supabase SQL Editor and run it, **or** use the Supabase CLI:

```bash
supabase db push
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/register`.

---

## Vercel Deployment

1. Push this repo to GitHub.
2. Import the project in the [Vercel dashboard](https://vercel.com/new).
3. Under **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel deployment URL)
4. Deploy — Vercel auto-builds on every push to `main`.

---

## Project Structure

```
oak-platform/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Redirect → /register
│   ├── globals.css             # Brand tokens & base styles
│   ├── actions/
│   │   └── register.ts         # Server Action: registration
│   ├── register/
│   │   ├── page.tsx            # Registration form page
│   │   └── RegistrationForm.tsx # Interactive form component
│   ├── attendee/[token]/
│   │   └── page.tsx            # Digital pass / QR code page
│   ├── admin/
│   │   └── login/page.tsx      # Admin auth (Day 3)
│   ├── programme/
│   │   └── page.tsx            # Event programme (Day 4)
│   └── partners/
│       └── page.tsx            # Partner directory (Day 4)
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server + Admin Supabase clients
│   └── types.ts                # Shared TypeScript types & utilities
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `attendees` | Registered attendees (sensitive fields admin-only via RLS) |
| `check_ins` | Daily attendance records (UNIQUE per attendee+date = no double-count) |
| `partners` | Partner organisations with logos |
| `programme_sessions` | Event sessions by date/time |
| `daily_posts` | Day-by-day documentation notes & photos |
| `attendee_passes` (view) | Public-safe subset of attendees (no email/phone/needs) |

---

## Security Notes

- **RLS is enabled on all tables.** Sensitive attendee data (email, phone, dietary, accessibility, travel needs) is never returned to anonymous users — enforced at the database layer, not just the UI.
- The `attendee_passes` view exposes only: `id`, `full_name`, `organization`, `sub_partner`, `role_title`, `qr_token`, `created_at`.
- Admin check-in and headcount routes require Supabase Auth (Day 3).
- Security headers are set in `next.config.ts` including `X-Frame-Options: DENY`.
- Camera permission is scoped to `/admin/*` routes only.

---

## Sprint Timeline

| Day | Focus | Status |
|-----|-------|--------|
| Mon 7 Sep | Kickoff & Foundations | ✅ **Done** |
| Tue 8 Sep | Registration & QR | ✅ **Done** |
| Wed 9 Sep | Check-in & Headcount | ✅ **Done** |
| Thu 10 Sep | Programme & Directory | ✅ **Done** |
| Fri 11 Sep | Nametags, QA & Demo | ✅ **Done** |

---

## Data & Privacy

This platform holds personal data for ~110 attendees. Data is:
- Collected only for event management purposes
- Shared only with OAK Zimbabwe coordination team
- Not published or reused beyond this event
- Deletable on request: events@oakzimbabwe.org

Consent is required at registration and enforced in the DB (`consent_given = TRUE` check constraint in RLS).

---

*Built by the OAK Zimbabwe Student Sprint team, September 2026.*
