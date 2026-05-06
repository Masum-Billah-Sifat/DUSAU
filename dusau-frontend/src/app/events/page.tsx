'use client'

import { useEffect, useMemo, useState } from 'react'
import { EventCard } from '@/components/cards'
import { FadeIn } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'
import { getAllEvents, type PublicEventSummary } from '@/lib/public/api'

function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="pill">{eyebrow}</span>

      <h1 className="font-display mt-5 text-4xl font-black tracking-tight text-[hsl(var(--text-main))] sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      <p className="mt-5 text-base leading-8 text-[hsl(var(--text-muted))] sm:text-lg">
        {description}
      </p>
    </div>
  )
}

function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white shadow-sm">
      <div className="h-52 animate-pulse bg-[hsl(var(--app-bg-soft))]" />

      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="h-3 w-full animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <EventSkeleton key={index} />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-[hsl(var(--border-strong))] bg-white/80 p-8 text-center shadow-sm">
      <h3 className="font-display text-2xl font-black text-[hsl(var(--text-main))]">
        No events found
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[hsl(var(--text-muted))]">
        Events will appear here once they are published from the admin dashboard.
      </p>
    </div>
  )
}

export default function EventsPage() {
  const { content } = useLocalizedContent()
  const [events, setEvents] = useState<PublicEventSummary[]>([])
  const [loading, setLoading] = useState(true)

  const categories = useMemo(() => ['All Events'], [])

  useEffect(() => {
    let active = true

    async function loadEvents() {
      try {
        const data = await getAllEvents()
        if (active) setEvents(data.events)
      } catch {
        if (active) setEvents([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadEvents()

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <PageHero
            eyebrow={content.eventsPage.eyebrow}
            title={content.eventsPage.title}
            description={content.eventsPage.description}
          />

          <FadeIn className="mt-8 flex justify-center">
            <div className="flex flex-wrap justify-center gap-3 rounded-full border border-[hsl(var(--border-soft))] bg-white p-2 shadow-sm">
              {categories.map((category) => (
                <span key={category} className="pill">
                  {category}
                </span>
              ))}
            </div>
          </FadeIn>

          <div className="mt-12">
            {loading ? (
              <LoadingGrid />
            ) : events.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {events.map((event, index) => (
                  <FadeIn key={event.id} delay={index * 0.05}>
                    <EventCard event={event} />
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}