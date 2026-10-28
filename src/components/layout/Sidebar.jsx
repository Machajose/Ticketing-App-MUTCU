import { CalendarDays, LayoutDashboard, Settings, Sparkles, Ticket, TicketCheck, X } from 'lucide-react';
import { event } from '../../config/event';

const links = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tickets', label: 'Tickets & guests', icon: Ticket },
  { id: 'checkin', label: 'Door check-in', icon: TicketCheck },
];

export default function Sidebar({ page, setPage, tickets, open, onClose, notify }) {
  return <>
    {open && <button aria-label="Close menu" onClick={onClose} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}
    <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[256px] flex-col border-r border-white/[.07] bg-[#141312] px-5 py-6 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0`}>
      <div className="flex items-center justify-between px-1">
        <button onClick={() => { setPage('overview'); onClose(); }} className="flex items-center gap-3 text-left">
          <img src="/gems-tickets-mark.svg" alt="" className="h-10 w-10 rounded-xl shadow-glow" />
          <span><span className="block font-display text-sm font-extrabold tracking-[.12em]">GEMS TICKETS</span><span className="mt-0.5 block text-[9px] font-bold tracking-[.2em] text-white/40">TICKETING CONSOLE</span></span>
        </button>
        <button onClick={onClose} aria-label="Close navigation" className="text-white/50 lg:hidden"><X size={18}/></button>
      </div>

      <div className="mt-10 px-2 text-[9px] font-bold uppercase tracking-[.22em] text-white/30">Workspace</div>
      <nav className="mt-3 space-y-1">
        {links.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setPage(id); onClose(); }} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${page === id ? 'bg-white/[.08] text-white' : 'text-white/50 hover:bg-white/[.04] hover:text-white/85'}`}><Icon size={17} className={page === id ? 'text-ember' : 'text-white/35 group-hover:text-white/70'}/>{label}</button>)}
      </nav>

      <div className="mt-9 px-2 text-[9px] font-bold uppercase tracking-[.22em] text-white/30">Event</div>
      <div className="mt-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-3.5">
        <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/><span className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-300">Upcoming performance</span></div>
        <div className="mt-3 font-display text-[13px] font-bold text-white">{event.name}</div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/40"><CalendarDays size={12}/>{event.shortDate} · {event.venue}</div>
        <div className="mt-4 flex justify-between text-[10px] text-white/40"><span>Tickets issued</span><span className="font-mono text-white/70">{tickets.length} / {event.capacity}</span></div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[.08]"><div className="h-full rounded-full bg-gradient-to-r from-ember to-gold" style={{ width: `${Math.min(tickets.length / event.capacity * 100, 100)}%` }}/></div>
        <div className="mt-3 text-[10px] text-white/35">{event.time} <span className="float-right text-ember">{event.currency} {event.price}</span></div>
      </div>

      <div className="mt-auto rounded-2xl border border-ember/20 bg-ember/[.07] p-4"><div className="flex items-center gap-2 text-ember"><Sparkles size={14}/><span className="text-[10px] font-bold uppercase tracking-[.15em]">Demo mode</span></div><p className="mt-2 text-[11px] leading-relaxed text-white/45">Local sample data. New tickets stay on this computer.</p></div>
      <div className="mt-4 flex items-center gap-3 border-t border-white/[.07] pt-4"><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#9b4b2c] to-[#4d2118] font-display text-xs font-bold">GM</div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-white/85">Gems Management</div><div className="mt-0.5 text-[10px] text-white/35">Event organizer</div></div><button onClick={() => notify('You are viewing the local demo workspace.')} title="Workspace settings" className="text-white/35 hover:text-white"><Settings size={15}/></button></div>
    </aside>
  </>;
}

