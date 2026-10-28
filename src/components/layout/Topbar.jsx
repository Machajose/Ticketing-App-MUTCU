import { Bell, CircleHelp, Menu } from 'lucide-react';

const pageNames = { overview: 'Overview', tickets: 'Tickets & guests', checkin: 'Door check-in' };

export default function Topbar({ page, openMenu, notify }) {
  return <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-white/[.07] bg-[#11100f]/90 px-4 backdrop-blur-xl sm:px-8 lg:px-10">
    <div className="flex items-center gap-3"><button onClick={openMenu} aria-label="Open navigation" className="rounded-lg p-2 text-white/50 hover:bg-white/[.06] lg:hidden"><Menu size={18}/></button><div className="hidden text-[11px] text-white/35 sm:block">Workspace <span className="px-1.5 text-white/20">/</span><span className="text-white/75">{pageNames[page]}</span></div><div className="text-[11px] text-white/75 sm:hidden">{pageNames[page]}</div></div>
    <div className="flex items-center gap-2 sm:gap-3"><div className="hidden items-center gap-2 rounded-full border border-white/[.08] bg-white/[.03] px-3 py-1.5 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/><span className="text-[10px] text-white/50">Local demo running</span></div><button onClick={() => notify('You’re all caught up.')} aria-label="Notifications" className="relative rounded-xl border border-white/[.08] p-2 text-white/50 hover:bg-white/[.05]"><Bell size={16}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-ember"/></button><span className="hidden h-7 w-px bg-white/[.08] sm:block"/><button onClick={() => notify('Help center is coming soon.')} aria-label="Help" className="rounded-xl p-2 text-white/45 hover:bg-white/[.05]"><CircleHelp size={17}/></button></div>
  </header>;
}
