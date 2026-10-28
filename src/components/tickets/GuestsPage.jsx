import { useMemo, useState } from 'react';
import { CheckCircle2, Clock3, FileDown, Filter, Plus, Search, Users } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import TicketTable from './TicketTable';

export default function GuestsPage({ tickets, loading, onNew, onTicket }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All tickets');
  const visible = useMemo(() => tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();
    const matches = [ticket.fullName, ticket.ticketId, ticket.phone, ticket.mpesaCode]
      .some((value) => String(value || '').toLowerCase().includes(query));
    return matches && (status === 'All tickets' || ticket.status === status);
  }), [tickets, search, status]);

  return <>
    <SectionTitle eyebrow="Guest operations" title="Tickets & guests" description="Search guests, check admission status, and open a ticket when someone needs a replacement." actions={<div className="flex gap-2"><a href="/api/tickets/export.csv" className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[.1] px-3.5 text-[11px] font-semibold text-white/65 hover:bg-white/[.05]"><FileDown size={14}/> Export CSV</a><button onClick={onNew} className="inline-flex h-10 items-center gap-2 rounded-xl bg-ember px-3.5 text-[11px] font-bold text-ink hover:bg-[#ff7748]"><Plus size={15}/> Issue ticket</button></div>}/>

    <div className="mb-4 grid gap-3 sm:grid-cols-3"><MiniMetric label="Total guests" value={tickets.length} icon={Users}/><MiniMetric label="Checked in" value={tickets.filter((ticket) => ticket.status === 'Checked in').length} icon={CheckCircle2}/><MiniMetric label="Yet to arrive" value={tickets.filter((ticket) => ticket.status !== 'Checked in').length} icon={Clock3}/></div>

    <section className="overflow-hidden rounded-2xl border border-white/[.07] bg-panel/80"><div className="flex flex-col gap-3 border-b border-white/[.06] p-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-sm font-bold text-white">Guest list <span className="ml-1.5 rounded-md bg-white/[.07] px-1.5 py-0.5 font-mono text-[10px] text-white/50">{visible.length}</span></h3><p className="mt-1 text-[10px] text-white/35">One admission type · KES 50 each</p></div><div className="flex gap-2"><label className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-white/[.09] bg-white/[.025] px-3 sm:w-[235px]"><Search size={14} className="shrink-0 text-white/30"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, ID, phone…" className="w-full bg-transparent text-[11px] text-white outline-none placeholder:text-white/25"/></label><label className="flex h-9 items-center gap-2 rounded-lg border border-white/[.09] bg-white/[.025] px-2.5"><Filter size={13} className="text-white/35"/><select value={status} onChange={(event) => setStatus(event.target.value)} className="max-w-[125px] bg-transparent text-[10px] text-white/60 outline-none"><option className="bg-panel">All tickets</option><option className="bg-panel">Checked in</option><option className="bg-panel">Not checked in</option></select></label></div></div>
      <TicketTable tickets={visible} loading={loading} onTicket={onTicket}/>
      <div className="border-t border-white/[.06] px-4 py-3 text-[10px] text-white/35">Showing <span className="text-white/65">{visible.length}</span> guests · ticket price KES 50</div>
    </section>
  </>;
}

function MiniMetric({ label, value, icon: Icon }) { return <div className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-panel/75 px-4 py-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[.05] text-ember"><Icon size={15}/></span><span><span className="block text-[10px] text-white/35">{label}</span><span className="mt-0.5 block text-sm font-bold text-white">{value}</span></span></div>; }
