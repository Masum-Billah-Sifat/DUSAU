export default function AdminEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="glass p-6 text-center">
      <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </div>
  )
}