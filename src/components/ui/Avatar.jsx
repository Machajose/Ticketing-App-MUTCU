export default function Avatar({ name, index = 0 }) {
  const colors = ['from-[#aa5a3a] to-[#48251c]', 'from-[#55785f] to-[#20372d]', 'from-[#7260a1] to-[#322641]', 'from-[#b07d32] to-[#533a1c]', 'from-[#3f7691] to-[#1c3542]'];
  return <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${colors[index % colors.length]} text-[9px] font-bold text-white/90`}>{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>;
}
