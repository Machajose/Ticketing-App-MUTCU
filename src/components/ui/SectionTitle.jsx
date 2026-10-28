export default function SectionTitle({ eyebrow, title, description, actions }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 text-[9px] font-bold uppercase tracking-[.24em] text-ember">{eyebrow}</div><h1 className="font-display text-[27px] font-extrabold tracking-[-.045em] text-white sm:text-[32px]">{title}</h1>{description && <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-white/40">{description}</p>}</div>{actions}</div>;
}
