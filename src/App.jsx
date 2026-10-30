import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, LoaderCircle, Plus, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import OverviewPage from './components/dashboard/OverviewPage';
import GuestsPage from './components/tickets/GuestsPage';
import CheckInPage from './components/checkin/CheckInPage';
import AuthPage from './components/auth/AuthPage';
import { IssueTicketModal, TicketPreviewModal } from './components/tickets/TicketModals';
import { useTickets } from './hooks/useTickets';
import { supabase, supabaseConfigReady } from './lib/supabase';

export default function App() {
  const localPreviewEnabled = import.meta.env.DEV && import.meta.env.VITE_REQUIRE_AUTH !== 'true';
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (localPreviewEnabled) {
      setAuthLoading(false);
      return undefined;
    }
    if (!supabaseConfigReady) {
      setAuthLoading(false);
      return undefined;
    }
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) setAuthError(error.message);
      setSession(data?.session || null);
      setAuthLoading(false);
    }).catch((error) => {
      if (alive) {
        setAuthError(error.message || 'Could not contact Supabase Auth.');
        setAuthLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthError('');
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [localPreviewEnabled]);

  if (localPreviewEnabled) return <Workspace user={{ id: 'local-preview', email: 'Local preview' }} preview onSignOut={() => {}} />;
  if (!supabaseConfigReady) return <SetupNotice message="Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local, then restart the dev server."/>;
  if (authLoading) return <LoadingScreen label="Connecting to your secure workspace…"/>;
  if (!session) return <AuthPage supabase={supabase}/>;
  return <Workspace user={session.user} authError={authError} onSignOut={() => supabase.auth.signOut()}/>;
}

function Workspace({ user, authError, onSignOut, preview = false }) {
  const [page, setPage] = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [toast, setToast] = useState('');
  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  }, []);
  const { tickets, event, role, loading, loadError, refresh, createTicket, checkIn, stats } = useTickets(user, notify, setScanResult, preview);

  const openTicket = async (ticket) => {
    const qr = await QRCode.toDataURL(ticket.token, {
      width: 256,
      margin: 1,
      color: { dark: '#171513', light: '#fffaf2' },
    });
    setActiveTicket({ ...ticket, qr });
  };

  const exportCsv = () => {
    const columns = ['Ticket ID', 'Name', 'Phone', 'M-Pesa reference', 'Payment status', 'Ticket status', 'Created at'];
    const rows = tickets.map((ticket) => [ticket.ticketId, ticket.fullName, ticket.phone, ticket.mpesaCode, ticket.payment_status, ticket.status, ticket.created_at]);
    const csv = [columns, ...rows].map((row) => row.map((value) => '"' + String(value ?? '').replaceAll('"', '""') + '"').join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'gems-guest-list.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  if (loading && !event && !loadError) return <LoadingScreen label="Loading event and ticket records…"/>;
  if (loadError || !event) return <WorkspaceError message={authError || loadError || 'No event is available.'} onRetry={refresh} onSignOut={onSignOut}/>;

  return <div className="min-h-screen bg-ink text-cream">
    <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute -right-48 -top-60 h-[620px] w-[620px] rounded-full bg-ember/[.07] blur-[130px]"/><div className="grain absolute inset-0 opacity-[.06]"/></div>
    <div className="relative flex min-h-screen">
      <Sidebar page={page} setPage={setPage} tickets={tickets} event={event} role={role} email={user.email} preview={preview} open={mobileNav} onClose={() => setMobileNav(false)} onSignOut={onSignOut}/>
      <main className="min-w-0 flex-1">
        <Topbar page={page} openMenu={() => setMobileNav(true)} onSignOut={onSignOut} email={user.email} preview={preview}/>
        <div className="mx-auto max-w-[1440px] px-4 pb-28 pt-6 sm:px-8 sm:pb-12 sm:pt-7 lg:px-10 lg:pt-9">
          {page === 'overview' && <OverviewPage event={event} tickets={tickets} stats={stats} loading={loading} setPage={setPage} onNew={() => setIssueOpen(true)} onTicket={openTicket} canManageTickets={role === 'owner' || role === 'manager'} preview={preview}/>}
          {page === 'tickets' && <GuestsPage event={event} tickets={tickets} loading={loading} onNew={() => setIssueOpen(true)} onTicket={openTicket} onExport={exportCsv} canManageTickets={role === 'owner' || role === 'manager'}/>}
          {page === 'checkin' && <CheckInPage tickets={tickets} result={scanResult} setResult={setScanResult} checkIn={checkIn}/>}
        </div>
        <footer className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-white/[.06] px-4 py-5 text-[10px] text-white/25 sm:flex-row sm:justify-between sm:px-8 lg:px-10"><span>GEMS TICKETS <span className="px-1">·</span> {preview ? "LOCAL PREVIEW · NOT SAVED" : "SECURE EVENT WORKSPACE"}</span><span>{event.name} · {event.venue}</span></footer>
      </main>
    </div>
    {issueOpen && (role === 'owner' || role === 'manager') && <IssueTicketModal event={event} onClose={() => setIssueOpen(false)} onCreate={createTicket} onCreated={async (ticket) => { setIssueOpen(false); setPage('tickets'); notify(preview ? 'Preview ticket created. This is not saved.' : 'Ticket issued and saved to Supabase'); await openTicket(ticket); }}/>}
    {activeTicket && <TicketPreviewModal event={event} ticket={activeTicket} onClose={() => setActiveTicket(null)}/>}
    {(role === 'owner' || role === 'manager') && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[.08] bg-[#141312]/95 px-4 pt-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"><button onClick={() => setIssueOpen(true)} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ember px-4 text-sm font-bold text-ink shadow-lg shadow-black/30"><Plus size={18}/> Issue a ticket <span className="text-ink/65">· {event.currency} {event.price}</span></button></div>}
    {toast && <div role="status" className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl border border-white/10 bg-[#262320] px-4 py-3 text-xs text-white shadow-2xl"><CheckCircle2 size={15} className="text-emerald-400"/>{toast}</div>}
  </div>;
}

function LoadingScreen({ label }) {
  return <main className="grid min-h-screen place-items-center bg-ink text-cream"><div className="flex items-center gap-3 text-xs text-white/55"><LoaderCircle size={18} className="animate-spin text-ember"/>{label}</div></main>;
}

function SetupNotice({ message }) {
  return <main className="grid min-h-screen place-items-center bg-ink px-5 text-cream"><section className="max-w-md rounded-2xl border border-white/10 bg-panel p-6 text-center"><h1 className="font-display text-lg font-bold text-white">Supabase setup needed</h1><p className="mt-3 text-xs leading-relaxed text-white/55">{message}</p></section></main>;
}

function WorkspaceError({ message, onRetry, onSignOut }) {
  return <main className="grid min-h-screen place-items-center bg-ink px-5 text-cream"><section className="w-full max-w-lg rounded-2xl border border-white/10 bg-panel p-6"><h1 className="font-display text-lg font-bold text-white">Couldn’t load the workspace</h1><p className="mt-3 break-words text-xs leading-relaxed text-white/55">{message}</p><div className="mt-5 flex gap-2"><button onClick={onRetry} className="inline-flex h-10 items-center gap-2 rounded-xl bg-ember px-4 text-xs font-bold text-ink"><RefreshCw size={14}/> Try again</button><button onClick={onSignOut} className="h-10 rounded-xl border border-white/10 px-4 text-xs font-semibold text-white/60">Sign out</button></div></section></main>;
}
