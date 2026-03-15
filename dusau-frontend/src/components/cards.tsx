import Image from 'next/image'
import type { AlumniMember, CommitteeMember, EventItem } from '@/data/store'

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="glass group h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute left-4 top-4">
          <span className="pill">{event.category}</span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-slate-400">
          {event.date} • {event.location}
        </p>
        <h3 className="font-display mt-3 text-xl font-semibold text-white">
          {event.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          {event.description}
        </p>
      </div>
    </article>
  )
}

export function CommitteeCard({ member }: { member: CommitteeMember }) {
  return (
    <article className="glass group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className="relative h-72 overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute left-4 top-4">
          <span className="pill">{member.role}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-white">
          {member.name}
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          {member.department} • Session {member.session}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-300">{member.bio}</p>
      </div>
    </article>
  )
}

export function AlumniCard({ alumni }: { alumni: AlumniMember }) {
  return (
    <article className="glass h-full overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
          <Image
            src={alumni.image}
            alt={alumni.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="min-w-0">
          <p className="font-display text-lg font-semibold text-white">
            {alumni.name}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {alumni.department} • Batch {alumni.batch}
          </p>
          <p className="mt-3 text-sm text-slate-200">
            {alumni.currentRole}
          </p>
          <p className="text-sm text-slate-400">{alumni.company}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-300">{alumni.note}</p>
    </article>
  )
}