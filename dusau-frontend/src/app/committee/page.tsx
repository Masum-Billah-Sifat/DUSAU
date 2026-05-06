'use client'

import { useEffect, useState } from 'react'
import { CommitteeCard } from '@/components/cards'
import { FadeIn } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'
import {
  getPinnedCommitteeWithAllMembers,
  type PublicCommittee,
  type PublicCommitteeMember,
} from '@/lib/public/api'

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

function CommitteeSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white shadow-sm">
      <div className="h-64 animate-pulse bg-[hsl(var(--app-bg-soft))]" />

      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <CommitteeSkeleton key={index} />
      ))}
    </div>
  )
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-[hsl(var(--border-strong))] bg-white/80 p-8 text-center shadow-sm">
      <h3 className="font-display text-2xl font-black text-[hsl(var(--text-main))]">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[hsl(var(--text-muted))]">
        {description}
      </p>
    </div>
  )
}

export default function CommitteePage() {
  const { content } = useLocalizedContent()
  const [committee, setCommittee] = useState<PublicCommittee | null>(null)
  const [members, setMembers] = useState<PublicCommitteeMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadCommittee() {
      try {
        const data = await getPinnedCommitteeWithAllMembers()

        if (!active) return

        setCommittee(data.committee)
        setMembers(data.members)
      } catch {
        if (!active) return

        setCommittee(null)
        setMembers([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCommittee()

    return () => {
      active = false
    }
  }, [])

  const title = committee
    ? `${content.committeePage.titlePrefix}${committee.from_year}–${committee.to_year}${content.committeePage.titleSuffix}`
    : content.committeePage.titlePrefix

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <PageHero
            eyebrow={content.committeePage.eyebrow}
            title={title}
            description={committee?.summary || content.committeePage.description}
          />

          <div className="mt-12">
            {loading ? (
              <LoadingGrid />
            ) : !committee ? (
              <EmptyState
                title="No pinned committee found"
                description="A committee will appear here once one is pinned from the admin dashboard."
              />
            ) : members.length === 0 ? (
              <EmptyState
                title="No committee members found"
                description="Committee members will appear here once they are added to the pinned committee."
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {members.map((member, index) => (
                  <FadeIn key={member.id} delay={index * 0.08}>
                    <CommitteeCard member={member} />
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