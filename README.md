# GEMS TICKETS — Local demo

A refreshed, self-contained event-ticketing demo for **Mapenzi ya Kifaurongo — Edition III**. The event is on Wednesday, November 4, 2026, from 7:00 PM to 9:00 PM at Assembly Hall. There is one admission type priced at KES 50. It uses React, Vite, Tailwind CSS, and a small Node.js/Express API. Ticket records are kept in `server/data/tickets.json`; there are no Supabase credentials, external accounts, or hosted services required.

## Run it in VS Code

1. Extract the ZIP, then open the extracted `GEMSTICKETS-local-demo` folder in VS Code.
2. Install Node.js 20 or newer if it is not already installed.
3. Open a terminal in the project folder and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local address Vite prints, usually `http://localhost:5173`.

Keep the terminal running while using the app. The Vite development server sends `/api` requests to the Express server on port `3001`. Camera QR scanning works on `localhost` after you grant browser camera permission. You can also check guests in by ticket ID without using the camera.

## What you can try

- Explore the event overview and ticket sales summary.
- Issue a single admission ticket for KES 50 with a guest name, phone number, and M-Pesa confirmation.
- Preview and download a PNG ticket that blends the Mapenzi ya Kifaurongo poster with the QR check-in stub.
- Search and filter the guest list, then export it as CSV.
- Admit a guest by ticket ID or QR scan. A ticket cannot be admitted twice.
- Refresh the page; the sample list and new tickets persist in the local JSON file.

The seeded guest records are presentation/demo data, not live payment processing. This local prototype is not a production payment or authentication system.

## Production build

```bash
npm run build
npm start
```

Express serves the production frontend and API at `http://localhost:3001` after the build.
