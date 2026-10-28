import { useCallback, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import QRCode from 'qrcode';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import OverviewPage from './components/dashboard/OverviewPage';
import GuestsPage from './components/tickets/GuestsPage';
import CheckInPage from './components/checkin/CheckInPage';
import { IssueTicketModal, TicketPreviewModal } from './components/tickets/TicketModals';
import { useTickets } from './hooks/useTickets';

export default function App() {
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

  const { tickets, loading, addTicket, checkIn, stats } = useTickets(notify, setScanResult);

  const openTicket = async (ticket) => {
    const qr = await QRCode.toDataURL(ticket.token, {
      width: 256,
      margin: 1,
      color: { dark: '#171513', light: '#fffaf2' },
    });
    setActiveTicket({ ...ticket, qr });
  };

  return <div className="min-h-screen bg-ink text-cream">
    <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute -right-48 -top-60 h-[620px] w-[620px] rounded-full bg-ember/[.07] blur-[130px]"/><div className="grain absolute inset-0 opacity-[.06]"/></div>
    <div className="relative flex min-h-screen">
      <Sidebar page={page} setPage={setPage} tickets={tickets} open={mobileNav} onClose={() => setMobileNav(false)} notify={notify}/>

      <main className="min-w-0 flex-1">
        <Topbar page={page} openMenu={() => setMobileNav(true)} notify={notify}/>
        <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-7 sm:px-8 lg:px-10 lg:pt-9">
          {page === 'overview' && <OverviewPage tickets={tickets} stats={stats} loading={loading} setPage={setPage} onNew={() => setIssueOpen(true)} onTicket={openTicket}/>}
          {page === 'tickets' && <GuestsPage tickets={tickets} loading={loading} onNew={() => setIssueOpen(true)} onTicket={openTicket}/>}
          {page === 'checkin' && <CheckInPage tickets={tickets} result={scanResult} setResult={setScanResult} checkIn={checkIn}/>}
        </div>
        <footer className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-white/[.06] px-4 py-5 text-[10px] text-white/25 sm:flex-row sm:justify-between sm:px-8 lg:px-10"><span>GEMS TICKETS <span className="px-1">·</span> LOCAL PREVIEW</span><span>One event · One admission type · KES 50</span></footer>
      </main>
    </div>

    {issueOpen && <IssueTicketModal onClose={() => setIssueOpen(false)} onCreated={async (ticket) => { addTicket(ticket); setIssueOpen(false); setPage('tickets'); notify('Ticket issued successfully'); await openTicket(ticket); }}/>}
    {activeTicket && <TicketPreviewModal ticket={activeTicket} onClose={() => setActiveTicket(null)}/>}
    {toast && <div role="status" className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl border border-white/10 bg-[#262320] px-4 py-3 text-xs text-white shadow-2xl"><CheckCircle2 size={15} className="text-emerald-400"/>{toast}</div>}
  </div>;
}
