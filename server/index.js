import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(here, 'data', 'tickets.json');
const app = express();
const port = Number(process.env.PORT || 3001);
app.use(express.json());

async function readTickets() {
  try { return JSON.parse((await fs.readFile(dataFile, 'utf8')).replace(/^\uFEFF/, '')); }
  catch { return []; }
}
async function writeTickets(tickets) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(tickets, null, 2));
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', mode: 'local-demo' }));
app.get('/api/tickets', async (_req, res) => res.json(await readTickets()));
app.post('/api/tickets', async (req, res) => {
  const { fullName, phone, mpesaCode } = req.body || {};
  if (!fullName?.trim() || !phone?.trim() || !mpesaCode?.trim()) {
    return res.status(400).json({ error: 'Name, phone number, and M-Pesa code are required.' });
  }
  const tickets = await readTickets();
  const serial = tickets.reduce((max, t) => Math.max(max, Number(t.ticketId?.replace(/\D/g, '') || 0), 0), 0) + 1;
  const ticket = {
    id: crypto.randomUUID(), ticketId: `GEMS${String(serial).padStart(3, '0')}`,
    fullName: fullName.trim(), phone: phone.trim(), mpesaCode: mpesaCode.trim().toUpperCase(),
    ticketType: 'General admission', status: 'Not checked in', createdAt: new Date().toISOString(), token: crypto.randomUUID(),
  };
  tickets.unshift(ticket);
  await writeTickets(tickets);
  res.status(201).json(ticket);
});
app.patch('/api/tickets/:id/check-in', async (req, res) => {
  const tickets = await readTickets();
  const ticket = tickets.find((t) => t.id === req.params.id || t.ticketId === req.params.id || t.token === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
  if (ticket.status === 'Checked in') return res.status(409).json({ error: `${ticket.fullName} has already checked in.`, ticket });
  ticket.status = 'Checked in';
  ticket.checkedInAt = new Date().toISOString();
  await writeTickets(tickets);
  res.json(ticket);
});
app.get('/api/tickets/export.csv', async (_req, res) => {
  const tickets = await readTickets();
  const values = [['Ticket ID', 'Name', 'Phone', 'M-Pesa code', 'Ticket type', 'Status'], ...tickets.map(t => [t.ticketId, t.fullName, t.phone, t.mpesaCode, t.ticketType, t.status])];
  const csv = values.map(row => row.map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="gems-guest-list.csv"');
  res.send(csv);
});

const dist = path.resolve(here, '../dist');
try {
  await fs.access(dist);
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
} catch { /* Vite serves the app separately during development. */ }

app.listen(port, () => console.log(`GEMS TICKETS API running at http://localhost:${port}`));
