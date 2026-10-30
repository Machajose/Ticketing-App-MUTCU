export default function StatusBadge({ status, paymentStatus }) {
  const checked = status === 'Checked in';
  const cancelled = status === 'Cancelled';
  const tone = checked
    ? 'bg-emerald-300/[.09] text-emerald-300'
    : cancelled
      ? 'bg-red-300/[.09] text-red-200'
      : 'bg-gold/[.09] text-gold';
  return <span className="flex flex-col items-start gap-1">
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold ${tone}`}><span className={`h-1.5 w-1.5 rounded-full ${checked ? 'bg-emerald-300' : cancelled ? 'bg-red-300' : 'bg-gold'}`}/>{status}</span>
    {paymentStatus && <span className={`px-2 text-[8px] font-medium capitalize ${paymentStatus === 'confirmed' ? 'text-emerald-200/65' : paymentStatus === 'pending' ? 'text-gold/75' : 'text-red-200/70'}`}>Payment {paymentStatus}</span>}
  </span>;
}
