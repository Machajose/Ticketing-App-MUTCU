# GEMS Tickets

GEMS Tickets is the event operations workspace for issuing admission tickets, managing guests, and checking tickets in. The React and Vite app stores live records in Supabase and uses Supabase Auth plus database row-level security to restrict access to organizers.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from your Supabase project. The publishable key is intended for browser use with the configured RLS policies. Never put a Supabase secret/service-role key in this file or in frontend code.
3. Install dependencies and start Vite:

   ```bash
   npm install
   npm run dev
   ```

4. Sign in with an email/password for a user listed in `public.gems_organizers`. The secure email sign-in link also works if Supabase Auth email delivery is configured.

## Supabase tables and roles

The app reads `public.gems_events`, `public.gems_organizers`, and `public.gems_tickets`. The first event row is shown in the workspace. Organizer roles are `owner`, `manager`, and `checkin`; owners and managers can issue tickets and export the guest list, while check-in staff can admit guests.

Ticket issuance records a confirmed M-Pesa payment only after the organizer checks the verification box. This is a manual confirmation step; the app does not contact M-Pesa to verify transactions.

If email sign-in links do not return to the app, add the Vercel production URL and local `http://localhost:5173/**` to Supabase Authentication's allowed redirect URLs.

## Deployment

Vercel builds the Vite app with `npm run build` and serves `dist`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Production and Preview in Project Settings, then redeploy after changing them. No Express server or local JSON ticket store is used by the app.
