'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FadeIn } from '@/components/ui'
import AdminPageHeader from '@/components/dashboard/AdminPageHeader'
import { adminJson } from '@/lib/frontend/admin-api'
import { normalizeArray } from '@/lib/frontend/normalize'

type CountCard = {
  title: string
  value: string
  href: string
}

export default function DashboardPage() {
  const [cards, setCards] = useState<CountCard[]>([])

  useEffect(() => {
    let active = true

    async function run() {
      try {
        const [committeesRes, eventsRes, alumniRes, advisorsRes, galleryRes, membersRes] =
          await Promise.all([
            adminJson<unknown>('/api/admin/committees'),
            adminJson<unknown>('/api/admin/events'),
            adminJson<unknown>('/api/admin/alumni'),
            adminJson<unknown>('/api/admin/advisors'),
            adminJson<unknown>('/api/admin/gallery'),
            adminJson<unknown>('/api/admin/member-directory'),
          ])

        if (!active) return

        const committees = normalizeArray(committeesRes, ['committees', 'items', 'data'])
        const events = normalizeArray(eventsRes, ['events', 'items', 'data'])
        const alumni = normalizeArray(alumniRes, ['alumni', 'items', 'data'])
        const advisors = normalizeArray(advisorsRes, ['advisors', 'items', 'data'])
        const gallery = normalizeArray(galleryRes, ['gallery', 'galleryItems', 'items', 'data'])
        const members = normalizeArray(membersRes, [
          'members',
          'memberDirectory',
          'items',
          'data',
        ])

        setCards([
          { title: 'Committees', value: String(committees.length), href: '/dashboard/committees' },
          { title: 'Events', value: String(events.length), href: '/dashboard/events' },
          { title: 'Alumni', value: String(alumni.length), href: '/dashboard/alumni' },
          { title: 'Advisors', value: String(advisors.length), href: '/dashboard/advisors' },
          { title: 'Gallery Items', value: String(gallery.length), href: '/dashboard/gallery' },
          {
            title: 'Member Directory',
            value: String(members.length),
            href: '/dashboard/member-directory',
          },
        ])
      } catch (error) {
        console.error('Failed to load dashboard overview', error)
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="grid gap-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AdminPageHeader
          eyebrow="Dashboard"
          title="Manage the full DUSAU platform"
          description="Use the sections below to manage organization metadata, events, committees, media, and people."
        />

        <Link href="/" className="btn-primary inline-flex">
          Go back to home
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <FadeIn key={card.title} delay={index * 0.06} className="glass p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{card.title}</p>
            <h2 className="font-display mt-4 text-4xl font-semibold text-white">{card.value}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Click below to manage this section.
            </p>
            <Link href={card.href} className="btn-primary mt-6 inline-flex">
              Open {card.title}
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}