'use client'

import { useEffect, useState } from 'react'
import { AlumniCard } from '@/components/cards'
import { FadeIn } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'
import { getAllAlumni, type PublicAlumni } from '@/lib/public/api'

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

      <div className="mt-5 h-24 animate-pulse rounded-[1.25rem] bg-[hsl(var(--app-bg-soft))]" />
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
        No alumni found
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[hsl(var(--text-muted))]">
        Alumni profiles will appear here once they are added from the admin dashboard.
      </p>
    </div>
  )
}

export default function AlumniPage() {
  const { content } = useLocalizedContent()
  const [alumni, setAlumni] = useState<PublicAlumni[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadAlumni() {
      try {
        const data = await getAllAlumni()
        if (active) setAlumni(data.alumni)
      } catch {
        if (active) setAlumni([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAlumni()

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <PageHero
            eyebrow={content.alumniPage.eyebrow}
            title={content.alumniPage.title}
            description={content.alumniPage.description}
          />

          <div className="mt-12">
            {loading ? (
              <LoadingGrid />
            ) : alumni.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {alumni.map((item, index) => (
                  <FadeIn key={item.id} delay={index * 0.06}>
                    <AlumniCard alumni={item} />
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-app">
          <div className="grid gap-5 md:grid-cols-3">
            {content.alumniPage.reasons.map((item, index) => (
              <FadeIn
                key={item.title}
                delay={index * 0.08}
                className="rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl"
              >
                <div className="mb-5 h-1.5 w-14 rounded-full bg-[hsl(var(--brand))]" />

                <h3 className="font-display text-xl font-black tracking-tight text-[hsl(var(--text-main))]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
                  {item.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}