import { CalendarDays, LayoutDashboard, LogOut, Ticket, TicketCheck, X } from 'lucide-react';

const links = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tickets', label: 'Tickets & guests', icon: Ticket },
  { id: 'checkin', label: 'Door check-in', icon: TicketCheck },
];

export default function Sidebar({ page, setPage, tickets, event, role, email, preview, open, onClose, onSignOut }) {
  const capacityLabel = event.capacity ? `${tickets.length} / ${event.capacity}` : `${tickets.length} issued`;
  const fill = event.capacity ? Math.min(tickets.length / event.capacity * 100, 100) : 0;
  return <>
    {open && <button aria-label="Close menu" onClick={onClose} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}
    <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[256px] flex-col border-r border-white/[.07] bg-[#141312] px-5 py-6 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0`}>
      <div className="flex items-center justify-between px-1">
        <button onClick={() => { setPage('overview'); onClose(); }} className="flex items-center gap-3 text-left">
          <img src="/creative-ministry-tickets-mark.svg" alt="" className="h-10 w-10 rounded-xl shadow-glow" />
          <span><span className="block font-display text-sm font-extrabold tracking-[.12em]">CREATIVE MINISTRY</span><span className="mt-0.5 block text-[9px] font-bold tracking-[.2em] text-white/40">TICKETS WORKSPACE</span></span>
        </button>
        <button onClick={onClose} aria-label="Close navigation" className="text-white/50 lg:hidden"><X size={18}/></button>
      </div>

      <div className="mt-10 px-2 text-[9px] font-bold uppercase tracking-[.22em] text-white/30">Workspace</div>
      <nav className="mt-3 space-y-1">
        {links.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setPage(id); onClose(); }} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${page === id ? 'bg-white/[.08] text-white' : 'text-white/50 hover:bg-white/[.04] hover:text-white/85'}`}><Icon size={17} className={page === id ? 'text-ember' : 'text-white/35 group-hover:text-white/70'}/>{label}</button>)}
      </nav>

      <div className="mt-9 px-2 text-[9px] font-bold uppercase tracking-[.22em] text-white/30">Current event</div>
      <div className="mt-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-3.5">
        <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/><span className={`text-[10px] font-semibold uppercase tracking-[.14em] ${preview ? "text-gold" : "text-emerald-300"}`}>{preview ? "Local preview" : "Connected"}</span></div>
        <div className="mt-3 font-display text-[13px] font-bold text-white">{event.name}</div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/40"><CalendarDays size={12}/>{event.shortDate} · {event.venue}</div>
        <div className="mt-4 flex justify-between text-[10px] text-white/40"><span>Tickets issued</span><span className="font-mono text-white/70">{capacityLabel}</span></div>
        {event.capacity && <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[.08]"><div className="h-full rounded-full bg-gradient-to-r from-ember to-gold" style={{ width: `${fill}%` }}/></div>}
        <div className="mt-3 text-[10px] text-white/35">{event.time} <span className="float-right text-ember">{event.currency} {event.price}</span></div>
      </div>

      <div className="mt-auto flex min-w-0 items-center gap-3 border-t border-white/[.07] pt-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#9b4b2c] to-[#4d2118] font-display text-xs font-bold">{(email || 'G').slice(0, 1).toUpperCase()}</div>
        <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-white/85">{email}</div><div className="mt-0.5 text-[10px] capitalize text-white/35">{role} access</div></div>
        {!preview && <button onClick={onSignOut} title="Sign out" aria-label="Sign out" className="rounded-lg p-2 text-white/35 hover:bg-white/[.05] hover:text-white"><LogOut size={15}/></button>}
      </div>
    </aside>
  </>;
}