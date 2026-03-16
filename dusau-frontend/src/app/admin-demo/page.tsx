'use client'

import { FadeIn, SectionHeading } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'

export default function AdminDemoPage() {
  const { content } = useLocalizedContent()
  const currentCommittee = content.committeeYears[0]

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.adminDemoPage.eyebrow}
            title={content.adminDemoPage.title}
            description={content.adminDemoPage.description}
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {content.homeStats.map((stat, index) => (
              <FadeIn
                key={stat.label}
                delay={index * 0.06}
                className="glass p-5"
              >
                <p className="font-display text-3xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </FadeIn>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <FadeIn className="glass-strong p-8">
              <span className="pill">{content.adminDemoPage.committeeEyebrow}</span>
              <h2 className="font-display mt-5 text-3xl font-semibold text-white">
                {content.adminDemoPage.committeeTitle}
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                {content.adminDemoPage.committeePara}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="glass p-5">
                  <p className="text-sm text-slate-400">
                    {content.adminDemoPage.currentYearLabel}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {currentCommittee.year}
                  </p>
                </div>
                <div className="glass p-5">
                  <p className="text-sm text-slate-400">
                    {content.adminDemoPage.currentMembersLabel}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {currentCommittee.members.length}
                    {content.adminDemoPage.currentMembersSuffix}
                  </p>
                </div>
                <div className="glass p-5">
                  <p className="text-sm text-slate-400">
                    {content.adminDemoPage.publishedEventsLabel}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {content.events.length}
                    {content.adminDemoPage.publishedEventsSuffix}
                  </p>
                </div>
                <div className="glass p-5">
                  <p className="text-sm text-slate-400">
                    {content.adminDemoPage.futureAccessLabel}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {content.adminDemoPage.futureAccessValue}
                  </p>
                </div>
              </div>
            </FadeIn>

            <div className="grid gap-6 md:grid-cols-2">
              {content.adminModules.map((module, index) => (
                <FadeIn
                  key={module.title}
                  delay={index * 0.06}
                  className="glass p-6"
                >
                  <p className="pill">{module.count}</p>
                  <h3 className="font-display mt-4 text-xl font-semibold text-white">
                    {module.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {module.description}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}