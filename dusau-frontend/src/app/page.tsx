'use client'

import Link from 'next/link'
import Hero from '@/components/hero'
import { AlumniCard, CommitteeCard, EventCard } from '@/components/cards'
import { FadeIn, SectionHeading } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'

export default function Home() {
  const { content } = useLocalizedContent()

  const featuredEvents = content.events.filter((event) => event.featured).slice(0, 3)
  const currentCommittee = content.committeeYears[0]
  const featuredAlumni = content.alumni.slice(0, 3)

  return (
    <main className="page-shell">
      <Hero />

      <section className="section-shell">
        <div className="container-app grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <FadeIn className="glass-strong p-8 sm:p-10">
            <span className="pill">{content.homePage.introEyebrow}</span>
            <h2 className="font-display mt-5 text-3xl font-semibold text-white sm:text-4xl">
              {content.homePage.introTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              {content.homePage.introPara1}
            </p>
            <p className="mt-4 text-base leading-8 text-slate-300">
              {content.homePage.introPara2}
            </p>
          </FadeIn>

          <div className="grid gap-6">
            {content.impactAreas.map((item, index) => (
              <FadeIn
                key={item.title}
                delay={index * 0.06}
                className="glass p-6"
              >
                <h3 className="font-display text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {item.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="recent-events" className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.homePage.recentEventsEyebrow}
            title={content.homePage.recentEventsTitle}
            description={content.homePage.recentEventsDescription}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredEvents.map((event, index) => (
              <FadeIn key={event.id} delay={index * 0.08}>
                <EventCard event={event} />
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-8">
            <Link href="/events" className="btn-secondary">
              {content.homePage.exploreAllEvents}
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.homePage.leadershipEyebrow}
            title={`${content.homePage.leadershipTitlePrefix}${currentCommittee.year}${content.homePage.leadershipTitleSuffix}`}
            description={content.homePage.leadershipDescription}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentCommittee.members.slice(0, 6).map((member, index) => (
              <FadeIn key={member.name} delay={index * 0.08}>
                <CommitteeCard member={member} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="container-app">
          <div className="glass-strong grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.05fr_0.95fr]">
            <FadeIn>
              <span className="pill">{content.homePage.emergencyEyebrow}</span>
              <h2 className="font-display mt-5 text-3xl font-semibold text-white sm:text-4xl">
                {content.homePage.emergencyTitle}
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                {content.homePage.emergencyPara}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/blood-support" className="btn-primary">
                  {content.homePage.emergencyPrimaryCta}
                </Link>
                <Link href="/contact" className="btn-secondary">
                  {content.homePage.emergencySecondaryCta}
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.12} className="grid gap-4 sm:grid-cols-2">
              {content.homePage.emergencyCards.map((card) => (
                <div key={card.value} className="glass p-5">
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {card.value}
                  </p>
                </div>
              ))}
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.homePage.alumniEyebrow}
            title={content.homePage.alumniTitle}
            description={content.homePage.alumniDescription}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredAlumni.map((item, index) => (
              <FadeIn key={item.name} delay={index * 0.08}>
                <AlumniCard alumni={item} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pt-4">
        <div className="container-app">
          <FadeIn className="glass-strong p-8 sm:p-10">
            <span className="pill">{content.homePage.closingEyebrow}</span>
            <h2 className="font-display mt-5 text-3xl font-semibold text-white sm:text-4xl">
              {content.homePage.closingTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              {content.homePage.closingPara1}
            </p>
            <p className="mt-4 text-base leading-8 text-slate-300">
              {content.homePage.closingPara2}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/about" className="btn-secondary">
                {content.homePage.closingPrimaryCta}
              </Link>
              <Link href="/admin-demo" className="btn-primary">
                {content.homePage.closingSecondaryCta}
              </Link>
            </div>

            <p className="mt-8 text-sm text-slate-400">
              {content.homePage.demoNote}
            </p>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}