import { useState } from 'react';
import { Download, Ticket, X } from 'lucide-react';
import QRCode from 'qrcode';
import { formatMoney } from '../../config/event';
import StatusBadge from '../ui/StatusBadge';
import TicketArtwork from './TicketArtwork';
import { getTicketWelcomeMessage } from '../../config/ticketMessages';

export function IssueTicketModal({ event, onClose, onCreate, onCreated }) {
  const [form, setForm] = useState({ fullName: '', phone: '', mpesaCode: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [paymentVerified, setPaymentVerified] = useState(false);

  async function submit(eventObject) {
    eventObject.preventDefault();
    setBusy(true);
    setError('');
    try {
      const ticket = await onCreate(form);
      onCreated(ticket);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="w-full max-w-[490px] rounded-t-[24px] border border-white/[.1] bg-[#191817] p-5 shadow-2xl sm:rounded-[24px] sm:p-7"><div className="flex items-start justify-between"><div><div className="mb-2 text-[9px] font-bold uppercase tracking-[.2em] text-ember">Single admission · {formatMoney(event.price, event.currency)}</div><h2 className="font-display text-xl font-extrabold text-white">Issue a ticket</h2><p className="mt-1 text-[11px] text-white/40">Add the guest details to create their QR pass.</p></div><button onClick={onClose} aria-label="Close form" className="rounded-lg p-2 text-white/40 hover:bg-white/[.06]"><X size={17}/></button></div>
    <form onSubmit={submit} className="mt-6 space-y-4"><Field label="Guest full name"><input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Amina Wanjiku" className="form-input"/></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Phone number"><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 7XX XXX XXX" className="form-input"/></Field><Field label="M-Pesa confirmation code"><input required minLength="6" maxLength="10" value={form.mpesaCode} onChange={(e) => setForm({ ...form, mpesaCode: e.target.value.toUpperCase() })} placeholder="e.g. QXZ7K2M9LP" className="form-input font-mono uppercase"/></Field></div><div className="flex items-center justify-between rounded-xl border border-white/[.06] bg-white/[.025] px-3.5 py-3"><span className="text-[10px] text-white/45">One admission type</span><strong className="font-display text-sm text-white">{formatMoney(event.price, event.currency)}</strong></div><label className="flex items-start gap-2.5 rounded-xl border border-gold/20 bg-gold/[.04] p-3 text-[10px] leading-relaxed text-white/60"><input required type="checkbox" checked={paymentVerified} onChange={(e) => setPaymentVerified(e.target.checked)} className="mt-0.5 accent-[#ff5a1f]"/><span>I have verified this M-Pesa payment before issuing the ticket.</span></label>{error && <p className="text-xs text-red-300">{error}</p>}<div className="flex items-center justify-between border-t border-white/[.07] pt-5"><span className="text-[10px] text-white/35">QR pass included</span><button disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-xl bg-ember px-4 text-[11px] font-bold text-ink disabled:opacity-60"><Ticket size={14}/>{busy ? 'Creating…' : 'Create ticket'}</button></div></form>
  </div></div>;
}

export function TicketPreviewModal({ event, ticket, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const welcomeMessage = getTicketWelcomeMessage(ticket);

  async function downloadTicket() {
    setDownloading(true);
    try {
      const qrData = await QRCode.toDataURL(ticket.token, {
        width: 300,
        margin: 1,
        color: { dark: '#171513', light: '#fffaf2' },
      });
      const canvas = document.createElement('canvas');
      canvas.width = 1776;
      canvas.height = 896;
      const context = canvas.getContext('2d');
      const artwork = await loadImage(event.ticketArtwork);
      context.drawImage(artwork, 0, 0, canvas.width, canvas.height);

      context.fillStyle = 'rgba(16, 9, 11, .9)';
      context.beginPath();
      context.roundRect(56, 706, 1188, 154, 18);
      context.fill();
      context.fillStyle = '#ffc5aa';
      context.font = '700 26px Arial, sans-serif';
      context.fillText('EDITION III  ·  GUEST ADMISSION  ·  ' + ticket.ticketId, 82, 736);
      context.fillStyle = '#fffaf2';
      context.font = '800 58px Arial, sans-serif';
      context.fillText(ticket.fullName.slice(0, 34), 82, 795, 1120);
      context.fillStyle = '#f5e7df';
      context.font = '600 40px Arial, sans-serif';
      context.fillText(welcomeMessage, 82, 847, 1120);
      const qrImage = await loadImage(qrData);
      context.fillStyle = '#fffdf8';
      context.beginPath();
      context.roundRect(1357, 271, 286, 286, 5);
      context.fill();
      context.drawImage(qrImage, 1364, 278, 272, 272);

      const link = document.createElement('a');
      const eventSlug = event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      link.download = ticket.ticketId + '-' + eventSlug + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // Keep the preview available if the browser cannot render a downloaded image.
    } finally {
      setDownloading(false);
    }
  }

  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="w-full max-w-[760px] max-h-[calc(100dvh-2rem)] overflow-x-hidden overflow-y-auto rounded-t-[24px] border border-white/10 bg-[#191817] shadow-2xl sm:rounded-[24px]"><div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4"><div><span className="text-[9px] font-bold uppercase tracking-[.2em] text-ember">{event.name} admission</span><div className="mt-1 text-xs font-semibold text-white">{ticket.ticketId}</div></div><button onClick={onClose} aria-label="Close ticket preview" className="rounded-lg p-2 text-white/40 hover:bg-white/[.06]"><X size={16}/></button></div>
    <div className="p-4 sm:p-6"><div className="overflow-x-auto rounded-xl border border-white/10"><TicketArtwork event={event} ticket={ticket} message={welcomeMessage}/></div>
      <div className="mt-5 grid gap-3 border-t border-white/[.08] pt-4 sm:flex sm:items-center sm:justify-between"><div className="rounded-xl border border-white/[.07] bg-white/[.025] px-3.5 py-3"><div className="mb-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-white/35">Admission status</div><StatusBadge status={ticket.status} paymentStatus={ticket.payment_status}/></div><button onClick={downloadTicket} disabled={downloading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ember px-4 text-[11px] font-bold text-ink hover:bg-[#ff7748] disabled:opacity-60 sm:w-auto"><Download size={15}/>{downloading ? 'Preparing…' : 'Download ticket'}</button></div></div>
  </div></div>;
}

function Field({ label, children }) { return <label className="block"><span className="mb-1.5 block text-[10px] font-semibold text-white/50">{label}</span>{children}</label>; }
function loadImage(source) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = source; }); }
