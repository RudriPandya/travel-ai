# VoyageAI — AI-Powered Travel Management Platform

## Overview
A premium full-stack travel management platform with AI-powered trip planning, flight/hotel/activity search, booking management, expense tracking, corporate travel management, loyalty program, and real-time notifications.

## Architecture

### Monorepo (pnpm workspaces)
```
artifacts/api-server/    — Express 5 backend (port 8080, proxied at /api)
artifacts/travel-ai/     — React + Vite frontend (port 24678, proxied at /)
lib/db/                  — Drizzle ORM + PostgreSQL schema
lib/api-spec/            — OpenAPI spec + codegen (orval)
lib/api-client-react/    — Generated React Query hooks
lib/api-zod/             — Generated Zod validation schemas
lib/integrations-openai-ai-server/  — OpenAI server helpers
lib/integrations-openai-ai-react/   — OpenAI react helpers
```

### Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, shadcn/ui, wouter routing, framer-motion, recharts
- **Backend**: Express 5, Drizzle ORM, PostgreSQL
- **AI**: OpenAI GPT-4o via Replit AI Integrations proxy
- **Code generation**: Orval from OpenAPI spec → React Query hooks + Zod schemas
- **Design system**: Dark premium theme (midnight blue + electric blue + amber accents)

## Database Schema (`lib/db/src/schema/travel.ts`)
Tables: users, travel_documents, saved_loyalty_programs, loyalty_accounts, loyalty_transactions, rewards, trips, itinerary_days, activities, bookings, expenses, expense_reports, price_alerts, notifications, destinations, hotels, hotel_rooms, activity_listings, corporate_travelers, approvals, travel_policies, chat_messages

## API Endpoints (`artifacts/api-server/src/routes/`)
All routes mount at `/api/*`:
- `GET/PUT /api/dashboard/stats` — Dashboard overview stats
- `GET /api/dashboard/upcoming-trips` — Upcoming trips
- `GET/POST/PUT/DELETE /api/trips` + `/api/trips/:id/itinerary` + `/api/trips/:id/activities` + `/api/trips/:id/optimize`
- `POST /api/ai/plan` — AI itinerary generation (GPT-4o, JSON mode)
- `POST /api/ai/chat` + `GET /api/ai/chat/history` — AI travel assistant chat
- `GET /api/flights/search` + `GET /api/flights/price-calendar` — Flight search (generated)
- `GET /api/hotels/search` + `GET /api/hotels/:id` — Hotel search (DB)
- `GET /api/activities/search` + `GET /api/activities/recommendations` — Activities
- `GET /api/destinations/popular` + `/recommended` + `/:slug`
- `GET/POST/PUT/DELETE /api/bookings` + `/api/bookings/:id/cancel`
- `GET/POST/PUT/DELETE /api/expenses` + `/api/expenses/reports` + `/api/expenses/summary`
- `GET/PUT /api/profile` + `/api/profile/documents` (GET/POST)
- `GET /api/loyalty/account` + `/transactions` + `/rewards` + `/programs` (GET/POST)
- `GET/POST /api/alerts` + `DELETE /api/alerts/:id`
- `GET /api/corporate/overview` + `/travelers` + `/approvals` + `/spend-report`
- `POST /api/corporate/approvals/:id/approve` + `/reject`
- `GET/PUT /api/corporate/policy`
- `GET /api/notifications` + `/notifications/:id/read` + `/notifications/read-all`

## Pages (`artifacts/travel-ai/src/pages/`)
- `/` — Home landing page
- `/dashboard` — Main dashboard with stats, upcoming trips, price alerts
- `/plan` — AI Trip Planner (GPT-4o powered, Budget/Balanced/Premium variants)
- `/search` — Flight/Hotel/Activity search hub
- `/trips` — My Trips list
- `/trips/:id` — Trip detail with day-by-day itinerary
- `/bookings` — All bookings
- `/expenses` — Expense manager with charts
- `/loyalty` — Loyalty points, tier, rewards catalog
- `/profile` — User profile and documents
- `/corporate` — Corporate overview with Recharts
- `/corporate/approvals` — Approval queue
- `/corporate/policy` — Travel policy editor
- `/alerts` — Price alerts
- `/assistant` — AI chat assistant

## Environment Variables
- `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` — PostgreSQL
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI via Replit AI proxy
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI proxy base URL
- `SESSION_SECRET` — Session secret
- `PORT` — Server port (set by Replit workflows)

## Seed Data
Database auto-seeds on first startup with: 1 demo user (Alex Morgan), 3 trips (Japan, Paris, Bali), 5 destinations, 5 hotels, 5 activity listings, 3 bookings, 5 expenses, 3 price alerts, 4 notifications, 5 corporate travelers, 3 approvals, 1 travel policy, loyalty account with 84,750 points (Voyager tier).

## Key Files
- `lib/api-spec/openapi.yaml` — Do NOT change title (controls generated filenames)
- `lib/api-spec/package.json` — Codegen script with barrel fix for api-zod
- `artifacts/api-server/src/seed.ts` — Database seed data
- `artifacts/api-server/src/routes/ai.ts` — OpenAI GPT-4o integration

## Development Commands
```bash
pnpm --filter @workspace/api-spec run codegen   # Regenerate hooks + Zod schemas
cd lib/db && pnpm run push-force                 # Push schema changes to DB
```
