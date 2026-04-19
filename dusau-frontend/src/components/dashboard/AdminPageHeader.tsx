import Link from 'next/link'

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  eyebrow: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <span className="pill">{eyebrow}</span>
        <h1 className="font-display mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
      </div>

      {actionLabel && actionHref ? (
        <Link href={actionHref} className="btn-primary w-fit">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}