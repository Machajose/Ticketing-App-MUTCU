import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { localPreviewEvent, mapEvent } from '../config/event';

function mapTicket(row) {
  return {
    ...row,
    ticketId: row.ticket_code,
    token: row.qr_token,
    fullName: row.full_name,
    mpesaCode: row.mpesa_code,
    ticketType: 'General admission',
    pricePaid: Number(row.price_paid),
  };
}

export function useTickets(user, notify, setScanResult, preview = false) {
  const [tickets, setTickets] = useState([]);
  const [event, setEvent] = useState(preview ? localPreviewEvent : null);
  const [role, setRole] = useState(preview ? 'owner' : null);
  const [loading, setLoading] = useState(!preview);
  const [loadError, setLoadError] = useState('');

  const refresh = useCallback(async () => {
    if (preview) return;
    setLoading(true);
    setLoadError('');
    try {
      const { data: membership, error: membershipError } = await supabase
        .from('creative_ministry_organizers')
        .select('role')
        .eq('user_id', user.id)
        .single();
      if (membershipError) throw membershipError;
      setRole(membership.role);

      const { data: eventRow, error: eventError } = await supabase
        .from('creative_ministry_events')
        .select('*')
        .order('starts_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (eventError) throw eventError;
      if (!eventRow) throw new Error('No event is set up in creative_ministry_events yet. Add an event in Supabase, then refresh.');
      const currentEvent = mapEvent(eventRow);
      setEvent(currentEvent);

      const { data: rows, error: ticketsError } = await supabase
        .from('creative_ministry_tickets')
        .select('*')
        .eq('event_id', eventRow.id)
        .order('created_at', { ascending: false });
      if (ticketsError) throw ticketsError;
      setTickets((rows || []).map(mapTicket));
    } catch (error) {
      setLoadError(error.message || 'Could not load the Supabase workspace.');
      setTickets([]);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [user.id, preview]);

  useEffect(() => { refresh(); }, [refresh]);

  const createTicket = useCallback(async ({ fullName, phone, mpesaCode }) => {
    if (!event) throw new Error('Event details have not loaded yet.');
    const normalizedMpesaCode = mpesaCode.trim().toUpperCase();
    const duplicateReference = tickets.some((ticket) => String(ticket.mpesaCode || '').trim().toUpperCase() === normalizedMpesaCode);
    if (duplicateReference) throw new Error('That M-Pesa reference is already attached to a ticket. Check the code and try again.');
    if (preview) {
      const serial = tickets.length + 1;
      const ticket = { id: crypto.randomUUID(), ticketId: 'KIF' + String(serial).padStart(3, '0'), token: crypto.randomUUID(), fullName: fullName.trim(), phone: phone.trim(), mpesaCode: mpesaCode.trim().toUpperCase(), ticketType: 'General admission', pricePaid: event.price, payment_status: 'confirmed', status: 'Not checked in', created_at: new Date().toISOString() };
      setTickets((current) => [ticket, ...current]);
      return ticket;
    }
    const row = {
      event_id: event.id,
      full_name: fullName.trim(),
      phone: phone.trim(),
      mpesa_code: normalizedMpesaCode,
      payment_status: 'confirmed',
      status: 'Not checked in',
      price_paid: event.price,
      currency: event.currency || 'KES',
      issued_by: user.id,
    };
    const { data, error } = await supabase.from('creative_ministry_tickets').insert(row).select('*').single();
    if (error) {
      if (error.code === '23505' && /mpesa/i.test(`${error.message || ''} ${error.details || ''} ${error.hint || ''}`)) throw new Error('That M-Pesa reference has already been used. Check the code and try again.');
      throw error;
    }
    const ticket = mapTicket(data);
    setTickets((current) => [ticket, ...current]);
    return ticket;
  }, [event, user.id, preview, tickets]);

  const checkIn = useCallback(async (ticket) => {
    try {
      if (ticket.status === 'Checked in') throw new Error(`${ticket.fullName} has already checked in.`);
      if (preview) {
        const updated = { ...ticket, status: 'Checked in', checked_in_at: new Date().toISOString() };
        setTickets((current) => current.map((item) => item.id === updated.id ? updated : item));
        setScanResult({ ok: true, ticket: updated, message: 'Preview check-in complete. This change is not saved to Supabase.' });
        notify(`${updated.fullName} checked in in preview`);
        return updated;
      }
      const { data, error } = await supabase
        .from('creative_ministry_tickets')
        .update({ status: 'Checked in', checked_in_at: new Date().toISOString() })
        .eq('id', ticket.id)
        .eq('status', 'Not checked in')
        .eq('payment_status', 'confirmed')
        .select('*')
        .single();
      if (error) throw error;
      const updated = mapTicket(data);
      setTickets((current) => current.map((item) => item.id === updated.id ? updated : item));
      setScanResult({ ok: true, ticket: updated, message: 'Access granted. Enjoy the performance.' });
      notify(`${updated.fullName} checked in`);
      return updated;
    } catch (error) {
      setScanResult({ ok: false, ticket, message: error.message || 'Ticket check-in failed.' });
      return null;
    }
  }, [notify, setScanResult, preview]);

  const stats = useMemo(() => {
    const paidTickets = tickets.filter((ticket) => ticket.payment_status === 'confirmed');
    const checkedIn = tickets.filter((ticket) => ticket.status === 'Checked in').length;
    return {
      total: tickets.length,
      checkedIn,
      expected: tickets.filter((ticket) => ticket.status === 'Not checked in' && ticket.payment_status === 'confirmed').length,
      revenue: paidTickets.reduce((total, ticket) => total + ticket.pricePaid, 0),
    };
  }, [tickets]);

  return { tickets, event, role, loading, loadError, refresh, createTicket, checkIn, stats };
}