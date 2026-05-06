import Image from 'next/image'
import Link from 'next/link'
import type {
  PublicAdvisor,
  PublicAlumni,
  PublicCommitteeMember,
  PublicEventSummary,
  PublicGalleryItem,
} from '@/lib/public/api'
import { formatDisplayDate, toMediaUrl } from '@/lib/public/media'

function AvatarImage({
  src,
  alt,
  size = 'md',
}: {
  src: string
  alt: string
  size?: 'sm' | 'md'
}) {
  const sizeClass = size === 'sm' ? 'h-14 w-14' : 'h-16 w-16 sm:h-20 sm:w-20'

  return (
    <div
      className={`relative ${sizeClass} shrink-0 overflow-hidden rounded-full border-4 border-white bg-[hsl(var(--app-bg-soft))] shadow-sm ring-1 ring-[hsl(var(--border-soft))]`}
    >
      <Image
        src={toMediaUrl(src)}
        alt={alt}
        fill
        className="object-cover"
        sizes={size === 'sm' ? '56px' : '80px'}
      />
    </div>
  )
}

export function EventCard({ event }: { event: PublicEventSummary }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block h-full rounded-[1.7rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand))] focus-visible:ring-offset-4 focus-visible:ring-offset-[hsl(var(--app-bg))]"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface))] shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-[hsl(var(--brand)_/_0.35)] group-hover:shadow-xl">
        <div className="relative aspect-[16/10] overflow-hidden bg-[hsl(var(--app-bg-soft))]">
          <Image
            src={toMediaUrl(event.cover_image_path)}
            alt={event.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[hsl(var(--brand))] shadow-sm">
              {formatDisplayDate(event.event_date)}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--brand))]" />
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--text-soft))]">
              DUSAU Event
            </span>
          </div>

          <h3 className="font-display text-xl font-black leading-snug tracking-tight text-[hsl(var(--text-main))]">
            {event.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
            {event.description}
          </p>

          <span className="mt-5 inline-flex text-sm font-extrabold text-[hsl(var(--brand))]">
            Read details →
          </span>
        </div>
      </article>
    </Link>
  )
}

export function CommitteeCard({ member }: { member: PublicCommitteeMember }) {
  return (
    <article className="group h-full overflow-hidden rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface))] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-[hsl(var(--app-bg-soft))]">
        <Image
          src={toMediaUrl(member.profile_image_path)}
          alt={member.name}
          fill
          className="object-cover object-top transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-4">
          <span className="inline-flex max-w-full rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[hsl(var(--brand))] shadow-sm">
            {member.position}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-display text-xl font-black tracking-tight text-[hsl(var(--text-main))]">
          {member.name}
        </h3>

        <p className="mt-2 text-sm font-semibold leading-6 text-[hsl(var(--text-muted))]">
          {member.department}
        </p>

        <p className="mt-1 text-sm leading-6 text-[hsl(var(--text-soft))]">
          Session {member.session}
        </p>
      </div>
    </article>
  )
}

export function AlumniCard({ alumni }: { alumni: PublicAlumni }) {
  const company = alumni.current_company || alumni.workplace || ''
  const role =
    alumni.current_company_position ||
    alumni.workplace_position ||
    alumni.latest_dusau_position

  return (
    <article className="flex h-full flex-col rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface))] p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl sm:p-5">
      <div className="flex items-start gap-4">
        <AvatarImage src={alumni.profile_image_path} alt={alumni.name} />

        <div className="min-w-0">
          <p className="font-display text-lg font-black leading-snug text-[hsl(var(--text-main))]">
            {alumni.name}
          </p>

          <p className="mt-1 text-sm font-semibold leading-6 text-[hsl(var(--text-muted))]">
            {alumni.department}
          </p>

          <p className="text-sm leading-6 text-[hsl(var(--text-soft))]">
            Session {alumni.session}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] bg-[hsl(var(--app-bg-soft))] p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
          Current Journey
        </p>

        <p className="mt-2 text-sm font-bold leading-6 text-[hsl(var(--text-main))]">
          {role || 'Not added yet'}
        </p>

        {company && (
          <p className="mt-1 text-sm leading-6 text-[hsl(var(--text-muted))]">
            {company}
          </p>
        )}
      </div>

      {alumni.short_quote && (
        <blockquote className="mt-4 border-l-4 border-[hsl(var(--brand))] pl-4 text-sm leading-7 text-[hsl(var(--text-muted))]">
          “{alumni.short_quote}”
        </blockquote>
      )}
    </article>
  )
}

export function AdvisorCard({ advisor }: { advisor: PublicAdvisor }) {
  return (
    <article className="flex h-full flex-col rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface))] p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl sm:p-5">
      <div className="flex items-start gap-4">
        <AvatarImage src={advisor.profile_image_path} alt={advisor.name} />

        <div className="min-w-0">
          <p className="font-display text-lg font-black leading-snug text-[hsl(var(--text-main))]">
            {advisor.name}
          </p>

          <p className="mt-1 text-sm font-semibold leading-6 text-[hsl(var(--text-muted))]">
            {advisor.position_at_workplace}
          </p>

          <p className="mt-1 text-sm leading-6 text-[hsl(var(--text-soft))]">
            {advisor.workplace}
          </p>
        </div>
      </div>

      {advisor.short_quote && (
        <blockquote className="mt-5 rounded-[1.25rem] bg-[hsl(var(--brand-soft))] p-4 text-sm font-medium leading-7 text-[hsl(var(--text-main))]">
          “{advisor.short_quote}”
        </blockquote>
      )}
    </article>
  )
}

export function GalleryCard({ item }: { item: PublicGalleryItem }) {
  return (
    <article className="group h-full overflow-hidden rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface))] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-[hsl(var(--app-bg-soft))]">
        <Image
          src={toMediaUrl(item.image_path)}
          alt={item.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
          Gallery
        </p>

        <h3 className="font-display mt-2 text-xl font-black tracking-tight text-[hsl(var(--text-main))]">
          {item.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
          {item.description}
        </p>
      </div>
    </article>
  )
}