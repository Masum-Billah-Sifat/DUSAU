export default function AdminStatusPill({
  active,
  activeText,
  inactiveText,
}: {
  active: boolean
  activeText: string
  inactiveText: string
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? 'bg-green-500/15 text-green-300 ring-1 ring-green-400/30'
          : 'bg-white/5 text-slate-300 ring-1 ring-white/10'
      }`}
    >
      {active ? activeText : inactiveText}
    </span>
  )
}