import { LogOut, Menu } from 'lucide-react';

const pageNames = { overview: 'Overview', tickets: 'Tickets & guests', checkin: 'Door check-in' };

export default function Topbar({ page, openMenu, onSignOut, email }) {
  return <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-white/[.07] bg-[#11100f]/90 px-4 backdrop-blur-xl sm:px-8 lg:px-10">
    <div className="flex items-center gap-3"><button onClick={openMenu} aria-label="Open navigation" className="rounded-lg p-2 text-white/50 hover:bg-white/[.06] lg:hidden"><Menu size={18}/></button><div className="hidden text-[11px] text-white/35 sm:block">GEMS Tickets <span className="px-1.5 text-white/20">/</span><span className="text-white/75">{pageNames[page]}</span></div><div className="text-[11px] text-white/75 sm:hidden">{pageNames[page]}</div></div>
    <div className="flex items-center gap-3"><div className="hidden max-w-[220px] truncate text-[10px] text-white/40 sm:block">{email}</div><span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[.05] px-3 py-1.5 text-[10px] text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300"/>Supabase</span><button onClick={onSignOut} aria-label="Sign out" title="Sign out" className="rounded-xl border border-white/[.08] p-2 text-white/50 hover:bg-white/[.05] hover:text-white lg:hidden"><LogOut size={15}/></button></div>
  </header>;
}
