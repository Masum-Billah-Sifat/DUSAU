'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import Hero from '@/components/hero'
import {
  AdvisorCard,
  AlumniCard,
  CommitteeCard,
  EventCard,
  GalleryCard,
} from '@/components/cards'
import { FadeIn } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'
import {
  getPinnedAdvisors,
  getPinnedAlumni,
  getPinnedCommitteeWithPinnedMembers,
  getPinnedEvents,
  getPinnedGallery,
  type PublicAdvisor,
  type PublicAlumni,
  type PublicCommittee,
  type PublicCommitteeMember,
  type PublicEventSummary,
  type PublicGalleryItem,
} from '@/lib/public/api'

function SectionIntro({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <span className="pill">{eyebrow}</span>

      <h2 className="font-display mt-4 text-3xl font-black tracking-tight text-[hsl(var(--text-main))] sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base leading-8 text-[hsl(var(--text-muted))] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

function HomeSection({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
  children: ReactNode
}) {
  return (
    <section className="section-shell">
      <div className="container-app">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro eyebrow={eyebrow} title={title} description={description} />

          {actionHref && actionLabel && (
            <Link href={actionHref} className="btn-secondary w-full sm:w-fit">
              {actionLabel}
            </Link>
          )}
        </div>

        {children}
      </div>
    </section>
  )
}

function EmptyPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[hsl(var(--border-strong))] bg-white/70 p-6 text-center text-sm font-semibold leading-7 text-[hsl(var(--text-muted))] md:col-span-2 xl:col-span-3">
      {children}
    </div>
  )
}

function SkeletonCard({ image = true }: { image?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white shadow-sm">
      {image && <div className="h-44 animate-pulse bg-[hsl(var(--app-bg-soft))] sm:h-52" />}

      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="h-3 w-full animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
      </div>
    </div>
  )
}

function LoadingGrid({ image = true, count = 3 }: { image?: boolean; count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} image={image} />
      ))}
    </div>
  )
}

export default function Home() {
  const { content } = useLocalizedContent()

  const [events, setEvents] = useState<PublicEventSummary[]>([])
  const [committee, setCommittee] = useState<PublicCommittee | null>(null)
  const [members, setMembers] = useState<PublicCommitteeMember[]>([])
  const [alumni, setAlumni] = useState<PublicAlumni[]>([])
  const [advisors, setAdvisors] = useState<PublicAdvisor[]>([])
  const [galleryItems, setGalleryItems] = useState<PublicGalleryItem[]>([])
  const [homeLoading, setHomeLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadHomeData() {
      try {
        const [eventData, committeeData, alumniData, advisorData, galleryData] =
          await Promise.allSettled([
            getPinnedEvents(),
            getPinnedCommitteeWithPinnedMembers(),
            getPinnedAlumni(),
            getPinnedAdvisors(),
            getPinnedGallery(),
          ])

        if (!isMounted) return

        if (eventData.status === 'fulfilled') {
          setEvents(eventData.value.events.slice(0, 3))
        }

        if (committeeData.status === 'fulfilled') {
          setCommittee(committeeData.value.committee)
          setMembers(committeeData.value.members.slice(0, 6))
        }

        if (alumniData.status === 'fulfilled') {
          setAlumni(alumniData.value.alumni.slice(0, 3))
        }

        if (advisorData.status === 'fulfilled') {
          setAdvisors(advisorData.value.advisors.slice(0, 3))
        }

        if (galleryData.status === 'fulfilled') {
          setGalleryItems(galleryData.value.gallery_items.slice(0, 3))
        }
      } finally {
        if (isMounted) {
          setHomeLoading(false)
        }
      }
    }

    loadHomeData()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="page-shell text-[hsl(var(--text-main))]">
      <Hero />

      <section className="section-shell">
        <div className="container-app">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
            <FadeIn className="surface-card p-5 sm:p-8 lg:p-10">
              <span className="pill">{content.homePage.introEyebrow}</span>

              <h1 className="font-display mt-5 text-3xl font-black leading-tight tracking-tight text-[hsl(var(--text-main))] sm:text-4xl lg:text-5xl">
                {content.homePage.introTitle}
              </h1>

              <div className="mt-6 space-y-4 text-base leading-8 text-[hsl(var(--text-muted))] sm:text-lg">
                <p>{content.homePage.introPara1}</p>
                <p>{content.homePage.introPara2}</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/about" className="btn-primary w-full sm:w-fit">
                  Learn About DUSAU
                </Link>

                <Link href="#recent-events" className="btn-secondary w-full sm:w-fit">
                  See Recent Activities
                </Link>
              </div>
            </FadeIn>

            <div className="grid gap-4">
              {content.impactAreas.map((item, index) => (
                <FadeIn
                  key={item.title}
                  delay={index * 0.06}
                  className="group rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl"
                >
                  <div className="flex gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--brand-soft))] text-sm font-black text-[hsl(var(--brand))]">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-black tracking-tight text-[hsl(var(--text-main))]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HomeSection
        eyebrow={content.homePage.recentEventsEyebrow}
        title={content.homePage.recentEventsTitle}
        description={content.homePage.recentEventsDescription}
        actionHref="/events"
        actionLabel={content.homePage.exploreAllEvents}
      >
        {homeLoading ? (
          <LoadingGrid />
        ) : (
          <div id="recent-events" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {events.length === 0 && <EmptyPanel>No pinned events yet.</EmptyPanel>}

            {events.map((event, index) => (
              <FadeIn key={event.id} delay={index * 0.08}>
                <EventCard event={event} />
              </FadeIn>
            ))}
          </div>
        )}
      </HomeSection>

      <section className="section-shell">
        <div className="container-app">
          <div className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--text-main))] shadow-xl">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="p-6 text-white sm:p-8 lg:p-10">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
                  {content.homePage.leadershipEyebrow}
                </span>

                <h2 className="font-display mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {committee
                    ? `${content.homePage.leadershipTitlePrefix}${committee.from_year}–${committee.to_year}${content.homePage.leadershipTitleSuffix}`
                    : content.homePage.leadershipTitlePrefix}
                </h2>

                <p className="mt-4 text-base leading-8 text-white/78">
                  {content.homePage.leadershipDescription}
                </p>

                <Link
                  href="/committee"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-[hsl(var(--text-main))] transition hover:bg-[hsl(var(--brand-soft))] sm:w-fit"
                >
                  View Full Committee
                </Link>
              </div>

              <div className="bg-white p-4 sm:p-6 lg:p-8">
                {homeLoading ? (
                  <LoadingGrid count={3} />
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {members.length === 0 && (
                      <EmptyPanel>No pinned committee members yet.</EmptyPanel>
                    )}

                    {members.map((member, index) => (
                      <FadeIn key={member.id} delay={index * 0.08}>
                        <CommitteeCard member={member} />
                      </FadeIn>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeSection
        eyebrow={content.homePage.alumniEyebrow}
        title={content.homePage.alumniTitle}
        description={content.homePage.alumniDescription}
        actionHref="/alumni"
        actionLabel="View All Alumni"
      >
        {homeLoading ? (
          <LoadingGrid image={false} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {alumni.length === 0 && <EmptyPanel>No pinned alumni yet.</EmptyPanel>}

            {alumni.map((item, index) => (
              <FadeIn key={item.id} delay={index * 0.08}>
                <AlumniCard alumni={item} />
              </FadeIn>
            ))}
          </div>
        )}
      </HomeSection>

      <HomeSection
        eyebrow="Advisors"
        title="Guidance from our advisors"
        description="Meet the advisors supporting DUSAU with their experience, networks, and leadership."
        actionHref="/advisors"
        actionLabel="View All Advisors"
      >
        {homeLoading ? (
          <LoadingGrid image={false} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {advisors.length === 0 && <EmptyPanel>No pinned advisors yet.</EmptyPanel>}

            {advisors.map((advisor, index) => (
              <FadeIn key={advisor.id} delay={index * 0.08}>
                <AdvisorCard advisor={advisor} />
              </FadeIn>
            ))}
          </div>
        )}
      </HomeSection>

      <HomeSection
        eyebrow="Gallery"
        title="Moments from the DUSAU community"
        description="A glimpse of recent programs, reunions, and activities."
        actionHref="/gallery"
        actionLabel="View Gallery"
      >
        {homeLoading ? (
          <LoadingGrid />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {galleryItems.length === 0 && (
              <EmptyPanel>No pinned gallery items yet.</EmptyPanel>
            )}

            {galleryItems.map((item, index) => (
              <FadeIn key={item.id} delay={index * 0.08}>
                <GalleryCard item={item} />
              </FadeIn>
            ))}
          </div>
        )}
      </HomeSection>

      <section className="section-shell">
        <div className="container-app">
          <div className="grid gap-6 overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl lg:grid-cols-[1.05fr_0.95fr]">
            <FadeIn className="p-6 sm:p-8 lg:p-10">
              <span className="pill">{content.homePage.emergencyEyebrow}</span>

              <h2 className="font-display mt-5 text-3xl font-black tracking-tight text-[hsl(var(--text-main))] sm:text-4xl">
                {content.homePage.emergencyTitle}
              </h2>

              <p className="mt-4 text-base leading-8 text-[hsl(var(--text-muted))]">
                {content.homePage.emergencyPara}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/blood-support" className="btn-primary w-full sm:w-fit">
                  {content.homePage.emergencyPrimaryCta}
                </Link>

                <Link href="/contact" className="btn-secondary w-full sm:w-fit">
                  {content.homePage.emergencySecondaryCta}
                </Link>
              </div>
            </FadeIn>

            <FadeIn
              delay={0.12}
              className="grid gap-4 bg-[hsl(var(--brand-soft))] p-6 sm:grid-cols-2 sm:p-8 lg:p-10"
            >
              {content.homePage.emergencyCards.map((card) => (
                <div
                  key={card.value}
                  className="rounded-[1.5rem] border border-[hsl(var(--brand)_/_0.16)] bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
                    {card.label}
                  </p>

                  <p className="mt-3 text-lg font-black leading-7 text-[hsl(var(--text-main))]">
                    {card.value}
                  </p>
                </div>
              ))}
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-shell pt-6">
        <div className="container-app">
          <FadeIn className="overflow-hidden rounded-[2rem] bg-[hsl(var(--text-main))] shadow-xl">
            <div className="grid gap-0 lg:grid-cols-[1fr_0.75fr]">
              <div className="p-6 text-white sm:p-8 lg:p-10">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
                  {content.homePage.closingEyebrow}
                </span>

                <h2 className="font-display mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {content.homePage.closingTitle}
                </h2>

                <div className="mt-5 space-y-4 text-base leading-8 text-white/78">
                  <p>{content.homePage.closingPara1}</p>
                  <p>{content.homePage.closingPara2}</p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/about"
                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-[hsl(var(--text-main))] transition hover:bg-[hsl(var(--brand-soft))] sm:w-fit"
                  >
                    {content.homePage.closingPrimaryCta}
                  </Link>

                  <Link
                    href="/dashboard"
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15 sm:w-fit"
                  >
                    Admin Dashboard
                  </Link>
                </div>
              </div>

              <div className="bg-[hsl(var(--accent-soft))] p-6 sm:p-8 lg:p-10">
                <p className="rounded-[1.5rem] border border-[hsl(var(--accent)_/_0.25)] bg-white p-5 text-sm font-semibold leading-7 text-[hsl(var(--text-muted))] shadow-sm">
                  {content.homePage.demoNote}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}