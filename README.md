# Creative Ministry Tickets

Creative Ministry Tickets is the event operations workspace for issuing admission tickets, managing guests, and checking tickets in. Production uses Supabase Auth and row-level security for access to live guest records.

## Database rename

Before deploying the renamed Supabase client, run `supabase/migrations/20261030_creative_ministry_schema.sql` once in the Supabase SQL Editor. It renames the existing tables and ticket sequence, keeps row-level security in place, changes new ticket IDs to the KIF prefix, and adds a unique M-Pesa reference index.

## Local preview

By default, `npm run dev` opens a local-only preview without a sign-in screen. You can explore the event overview, create tickets, generate QR codes, check guests in, and export a list. Preview records exist only in browser memory and disappear when the page reloads; they are not sent to Supabase.

To test the authenticated Supabase flow locally, set `VITE_REQUIRE_AUTH=true` in `.env.local` and restart Vite. Copy `.env.example` to `.env.local` and provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. After applying the database rename migration, use an account listed in `public.creative_ministry_organizers`. Never put a Supabase secret/service-role key in frontend code.

## Supabase tables and roles

The app reads `public.creative_ministry_events`, `public.creative_ministry_organizers`, and `public.creative_ministry_tickets`. Organizer roles are `owner`, `manager`, and `checkin`; owners and managers can issue tickets and export the guest list, while check-in staff can admit guests.

Ticket issuance records an M-Pesa payment as confirmed only after the organizer checks the verification box. This is manual; the app does not contact M-Pesa to verify transactions.

## Deployment

Vercel builds the Vite app with `npm run build` and serves `dist`. Production builds always require Supabase Auth regardless of the local preview setting. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Production and Preview in Vercel Project Settings, then redeploy after changing them. No Express server or local JSON ticket store is used by the app.
