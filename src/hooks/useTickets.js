import { useCallback, useEffect, useMemo, useState } from 'react';
import { request } from '../lib/api';

export function useTickets(notify, setScanResult) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setTickets(await request('/api/tickets'));
    } catch (error) {
      notify(error.message);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { refresh(); }, [refresh]);

  const addTicket = useCallback((ticket) => {
    setTickets((current) => [ticket, ...current]);
  }, []);

  const checkIn = useCallback(async (ticket) => {
    try {
      const updated = await request(
        `/api/tickets/${encodeURIComponent(ticket.id)}/check-in`,
        { method: 'PATCH' },
      );
      setTickets((current) => current.map((item) => item.id === updated.id ? updated : item));
      setScanResult({ ok: true, ticket: updated, message: 'Access granted. Enjoy the performance.' });
      notify(`${updated.fullName} checked in`);
      return updated;
    } catch (error) {
      setScanResult({ ok: false, ticket, message: error.message });
      return null;
    }
  }, [notify, setScanResult]);

  const stats = useMemo(() => {
    const checkedIn = tickets.filter((ticket) => ticket.status === 'Checked in').length;
    return {
      total: tickets.length,
      checkedIn,
      expected: tickets.length - checkedIn,
      revenue: tickets.length * 50,
    };
  }, [tickets]);

  return { tickets, loading, refresh, addTicket, checkIn, stats };
}
