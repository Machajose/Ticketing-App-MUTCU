
export default function TicketArtwork({ event, ticket, message }) {
  return (
    <div className="relative aspect-[1776/896] w-full min-w-0 overflow-hidden rounded-xl bg-[#180a0c]">
      <img src={event.ticketArtwork} alt={event.name + " admission ticket artwork"} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute bottom-[2%] left-[4.5%] h-[20%] w-[67%] rounded-lg border border-white/10 bg-[#10090b]/85 px-[2%] flex flex-col justify-center shadow-lg backdrop-blur-sm">
        <div className="text-[clamp(8px,1.15vw,12px)] font-bold uppercase leading-none tracking-[.15em] text-[#ffb7a2]">{event.edition} · Guest admission · {ticket.ticketId}</div>
        <div className="mt-px truncate font-display text-[clamp(14px,2.2vw,22px)] font-extrabold leading-none text-white">{ticket.fullName}</div>
        <p className="mt-px truncate text-[clamp(9px,1.35vw,13px)] font-medium leading-none text-white/80">{message}</p>
        
      </div>
      <img src={ticket.qr} alt={'Scannable QR code for ticket ' + ticket.ticketId} className="absolute aspect-square rounded-[2px] bg-white p-[.25%]" style={{ left: '76.8%', top: '31.1%', width: '15.8%' }} />
    </div>
  );
}
