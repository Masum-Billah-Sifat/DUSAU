'use client'

import { useEffect, useState } from 'react'
import { AdvisorCard } from '@/components/cards'
import { FadeIn } from '@/components/ui'
import { getAllAdvisors, type PublicAdvisor } from '@/lib/public/api'

function PageHero() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="pill">Advisors</span>

      <h1 className="font-display mt-5 text-4xl font-black tracking-tight text-[hsl(var(--text-main))] sm:text-5xl lg:text-6xl">
        Our Advisors
      </h1>

      <p className="mt-5 text-base leading-8 text-[hsl(var(--text-muted))] sm:text-lg">
        Meet the advisors guiding DUSAU with experience, leadership, and professional insight.
      </p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />

        <div className="flex-1 space-y-3 pt-2">
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
          <div className="h-3 w-1/2 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        </div>
      </div>

      <div className="mt-5 h-20 animate-pulse rounded-[1.25rem] bg-[hsl(var(--app-bg-soft))]" />
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-[hsl(var(--border-strong))] bg-white/80 p-8 text-center shadow-sm">
      <h3 className="font-display text-2xl font-black text-[hsl(var(--text-main))]">
        No advisors found
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[hsl(var(--text-muted))]">
        Advisors will appear here once they are added from the admin dashboard.
      </p>
    </div>
  )
}

export default function AdvisorsPage() {
  const [advisors, setAdvisors] = useState<PublicAdvisor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadAdvisors() {
      try {
        const data = await getAllAdvisors()
        if (active) setAdvisors(data.advisors)
      } catch {
        if (active) setAdvisors([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAdvisors()

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <PageHero />

          <div className="mt-12">
            {loading ? (
              <LoadingGrid />
            ) : advisors.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {advisors.map((advisor, index) => (
                  <FadeIn key={advisor.id} delay={index * 0.06}>
                    <AdvisorCard advisor={advisor} />
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