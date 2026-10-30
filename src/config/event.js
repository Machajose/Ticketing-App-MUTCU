import ticketArtwork from '../assets/mapenzi-ticket.png.jpg';
import overviewArtwork from '../assets/mapenzi-overview.png.jpg';

export const eventArtwork = { ticket: ticketArtwork, overview: overviewArtwork };

export function mapEvent(row) {
  const start = new Date(row.starts_at);
  const end = new Date(row.ends_at);
  const dateOptions = { timeZone: 'Africa/Nairobi', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const shortDateOptions = { timeZone: 'Africa/Nairobi', day: 'numeric', month: 'long', year: 'numeric' };
  const timeOptions = { timeZone: 'Africa/Nairobi', hour: 'numeric', minute: '2-digit' };
  return {
    ...row,
    edition: row.edition,
    shortDate: new Intl.DateTimeFormat('en-KE', shortDateOptions).format(start),
    date: new Intl.DateTimeFormat('en-KE', dateOptions).format(start),
    time: new Intl.DateTimeFormat('en-KE', timeOptions).format(start) + ' – ' + new Intl.DateTimeFormat('en-KE', timeOptions).format(end),
    price: Number(row.ticket_price),
    ticketArtwork: eventArtwork.ticket,
    overviewArtwork: eventArtwork.overview,
  };
}

export const formatMoney = (amount, currency = 'KES') => currency + ' ' + Number(amount || 0).toLocaleString('en-KE');
