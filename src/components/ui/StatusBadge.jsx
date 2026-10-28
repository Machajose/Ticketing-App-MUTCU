export default function StatusBadge({ status }) {
  const checked = status === 'Checked in';
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold ${checked ? 'bg-emerald-300/[.09] text-emerald-300' : 'bg-gold/[.09] text-gold'}`}><span className={`h-1.5 w-1.5 rounded-full ${checked ? 'bg-emerald-300' : 'bg-gold'}`}/>{checked ? 'Checked in' : 'Expected'}</span>;
}
