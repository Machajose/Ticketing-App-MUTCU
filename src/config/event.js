import ticketArtwork from '../assets/mapenzi-ticket.png.jpg';
import overviewArtwork from '../assets/mapenzi-overview.png.jpg';

export const event = {
  name: 'Mapenzi ya Kifaurongo',
  subtitle: 'Edition III · Live play performance',
  date: 'Wednesday, November 4, 2026',
  shortDate: 'November 4, 2026',
  time: '7:00 PM – 9:00 PM',
  venue: 'Assembly Hall',
  price: 50,
  currency: 'KES',
  capacity: 250,
  ticketArtwork,
  overviewArtwork,
};

export const formatMoney = (amount) => event.currency + ' ' + Number(amount).toLocaleString('en-KE');
