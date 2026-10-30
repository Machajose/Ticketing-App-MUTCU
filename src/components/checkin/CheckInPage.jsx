import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Search, ShieldCheck, TicketCheck, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import SectionTitle from '../ui/SectionTitle';
import Avatar from '../ui/Avatar';

export default function CheckInPage({ tickets, result, setResult, checkIn }) {
  const [scanValue, setScanValue] = useState('');
  const findTicket = useCallback(async (rawValue) => {
    const value = rawValue.trim().toLowerCase();
    const ticket = tickets.find((item) => [item.ticketId, item.token, item.id]
      .some((candidate) => String(candidate).toLowerCase() === value));
    if (!ticket) {
      setResult({ ok: false, message: 'No ticket found. Check the ticket ID or QR code and try again.' });
      return;
    }
    await checkIn(ticket);
  }, [tickets, setResult, checkIn]);

  const submit = (event) => { event.preventDefault(); findTicket(scanValue); };

  return <>
    <SectionTitle eyebrow="Front of house" title="Door check-in" description="Verify a guest by ticket ID or use the camera to scan their QR. Each ticket can only be admitted once." actions={<span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[.05] px-3 py-2 text-[10px] text-emerald-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300"/> Ready for guests</span>}/>
    <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
      <section className="overflow-hidden rounded-2xl border border-white/[.08] bg-panel"><div className="border-b border-white/[.06] px-5 py-4"><h2 className="text-sm font-bold text-white">Find a guest</h2><p className="mt-1 text-[10px] text-white/35">Type the printed ticket ID or scan its QR code.</p></div><div className="p-5 sm:p-7"><form onSubmit={submit}><label htmlFor="ticket-search" className="mb-2 block text-[10px] font-semibold text-white/50">Ticket ID or QR value</label><div className="flex gap-2"><div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/[.1] bg-black/20 px-3.5 focus-within:border-ember/60"><Search size={16} className="shrink-0 text-white/30"/><input id="ticket-search" value={scanValue} onChange={(event) => setScanValue(event.target.value)} placeholder="e.g. GEMS008" className="min-w-0 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:font-sans placeholder:text-xs placeholder:text-white/25"/></div><button className="rounded-xl bg-ember px-5 text-xs font-bold text-ink hover:bg-[#ff7748]">Verify</button></div></form>
      <CameraScanner onDecoded={findTicket}/>
      {result ? <div className={`mt-5 rounded-xl border p-4 ${result.ok ? 'border-emerald-300/20 bg-emerald-300/[.06]' : 'border-red-300/20 bg-red-400/[.06]'}`}><div className="flex items-start gap-3">{result.ok ? <CheckCircle2 size={19} className="mt-0.5 text-emerald-300"/> : <X size={19} className="mt-0.5 text-red-300"/>}<div className="flex-1"><div className={`text-xs font-bold ${result.ok ? 'text-emerald-200' : 'text-red-200'}`}>{result.ok ? 'ACCESS GRANTED' : 'CHECK-IN FAILED'}</div><p className="mt-1 text-[11px] text-white/55">{result.ticket ? `${result.ticket.fullName} · ${result.ticket.ticketId} — ` : ''}{result.message}</p></div><button onClick={() => { setResult(null); setScanValue(''); }} aria-label="Dismiss result" className="text-white/35 hover:text-white"><X size={15}/></button></div></div> : <div className="mt-6 rounded-xl border border-dashed border-white/[.12] bg-black/10 px-4 py-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[.045] text-ember"><TicketCheck size={22}/></span><div className="mt-3 text-xs font-semibold text-white/70">Ready for the next guest</div><p className="mx-auto mt-1.5 max-w-xs text-[10px] leading-relaxed text-white/35">An admission result will appear here after a scan.</p></div>}</div><div className="flex justify-between border-t border-white/[.06] px-5 py-3 text-[10px] text-white/35"><span>Checked in for this event</span><span className="font-mono text-emerald-300">{tickets.filter((ticket) => ticket.status === 'Checked in').length}</span></div></section>
      <div className="space-y-5"><section className="rounded-2xl border border-white/[.08] bg-panel p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold text-white">Quick admit</h2><p className="mt-1 text-[10px] text-white/35">Select a guest to check them in.</p></div><span className="rounded-md bg-gold/[.1] px-2 py-1 text-[9px] font-bold text-gold">{tickets.filter((ticket) => ticket.status === 'Not checked in' && ticket.payment_status === 'confirmed').length} WAITING</span></div><div className="mt-4 space-y-2">{tickets.filter((ticket) => ticket.status === 'Not checked in' && ticket.payment_status === 'confirmed').slice(0, 5).map((ticket, index) => <div key={ticket.id} className="flex items-center gap-3 rounded-xl border border-white/[.05] px-3 py-2.5"><Avatar name={ticket.fullName} index={index}/><div className="min-w-0 flex-1"><div className="truncate text-[10px] font-semibold text-white/75">{ticket.fullName}</div><div className="mt-0.5 font-mono text-[9px] text-white/30">{ticket.ticketId}</div></div><button onClick={() => checkIn(ticket)} className="rounded-lg border border-white/[.09] px-2.5 py-1.5 text-[9px] font-semibold text-white/60 hover:border-emerald-300/30 hover:text-emerald-200">Admit</button></div>)}</div></section><div className="rounded-2xl border border-ember/15 bg-gradient-to-br from-ember/[.09] to-transparent p-5"><div className="flex items-center gap-2 text-ember"><ShieldCheck size={16}/><span className="text-[10px] font-bold uppercase tracking-[.14em]">One ticket · One entry</span></div><p className="mt-2 text-[11px] leading-relaxed text-white/45">A used ticket cannot be admitted again. If a guest needs help, verify their name with the event team.</p></div></div>
    </div>
  </>;
}

function CameraScanner({ onDecoded }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let scanner;
    let cancelled = false;
    (async () => {
      try {
        scanner = new Html5Qrcode('gems-qr-reader');
        await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 220, height: 180 } }, async (text) => {
          if (cancelled) return;
          cancelled = true;
          try { await scanner.stop(); } catch { /* The reader can stop after the first valid code. */ }
          onDecoded(text);
          setOpen(false);
        });
      } catch {
        setMessage('Camera is unavailable or permission was denied. Enter the ticket ID above instead.');
        setOpen(false);
      }
    })();
    return () => { cancelled = true; if (scanner?.isScanning) scanner.stop().catch(() => {}); };
  }, [open, onDecoded]);

  return <div className="mt-4"><button type="button" onClick={() => { setMessage(''); setOpen((value) => !value); }} className="inline-flex items-center gap-2 rounded-lg border border-white/[.08] px-3 py-2 text-[10px] font-semibold text-white/55 hover:border-white/20 hover:text-white"><span className="text-ember">▦</span>{open ? 'Close camera' : 'Open camera scanner'}</button>{message && <p className="mt-2 text-[10px] text-gold">{message}</p>}{open && <div id="gems-qr-reader" className="mt-3 max-w-sm overflow-hidden rounded-xl border border-white/10 bg-black/30 [&_button]:m-2 [&_button]:rounded-md [&_button]:bg-ember [&_button]:px-3 [&_button]:py-2 [&_button]:text-xs [&_select]:bg-[#191817] [&_select]:text-white"/>}</div>;
}
