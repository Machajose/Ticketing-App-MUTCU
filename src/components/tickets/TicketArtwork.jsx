import { event } from '../../config/event';

export default function TicketArtwork({ ticket, message }) {
  return (
    <div className="relative aspect-[1776/896] min-w-[560px] overflow-hidden rounded-xl bg-[#180a0c] sm:min-w-0">
      <img src={event.ticketArtwork} alt="Mapenzi ya Kifaurongo admission ticket artwork" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute bottom-[2%] left-[4.5%] h-[18%] w-[67%] rounded-lg border border-white/10 bg-[#10090b]/85 px-[2%] flex flex-col justify-center shadow-lg backdrop-blur-sm">
        <div className="text-[7px] font-bold uppercase tracking-[.2em] text-[#ffb7a2] sm:text-[9px]">Edition III · Guest admission · {ticket.ticketId}</div>
        <div className="mt-0.5 truncate font-display text-[clamp(12px,1.8vw,20px)] font-extrabold leading-tight text-white">{ticket.fullName}</div>
        <p className="mt-0.5 truncate text-[clamp(8px,0.9vw,10px)] font-medium text-white/80">{message}</p>
        
      </div>
      <img src={ticket.qr} alt={'Scannable QR code for ticket ' + ticket.ticketId} className="absolute aspect-square rounded-[2px] bg-white p-[.25%]" style={{ left: '76.8%', top: '31.1%', width: '15.8%' }} />
    </div>
  );
}
