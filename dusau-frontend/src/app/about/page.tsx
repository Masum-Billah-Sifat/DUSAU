'use client'

import { FadeIn } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'

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

function StoryBlock({
  title,
  children,
  dark = false,
}: {
  title: string
  children: React.ReactNode
  dark?: boolean
}) {
  if (dark) {
    return (
      <FadeIn className="overflow-hidden rounded-[2rem] bg-[hsl(var(--text-main))] p-6 text-white shadow-xl sm:p-8 lg:p-10">
        <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
          DUSAU Story
        </span>

        <h2 className="font-display mt-5 text-3xl font-black tracking-tight text-white">
          {title}
        </h2>

        <div className="mt-5 space-y-4 text-base leading-8 text-white/78">
          {children}
        </div>
      </FadeIn>
    )
  }

  return (
    <FadeIn className="surface-card p-6 sm:p-8 lg:p-10">
      <span className="pill">Platform</span>

      <h2 className="font-display mt-5 text-3xl font-black tracking-tight text-[hsl(var(--text-main))]">
        {title}
      </h2>

      <div className="mt-5 space-y-4 text-base leading-8 text-[hsl(var(--text-muted))]">
        {children}
      </div>
    </FadeIn>
  )
}

function NumberCard({
  step,
  title,
  description,
  index,
}: {
  step: string
  title: string
  description: string
  index: number
}) {
  return (
    <FadeIn
      delay={index * 0.08}
      className="group rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl sm:p-6"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--brand-soft))] text-sm font-black text-[hsl(var(--brand))]">
        {step}
      </div>

      <h3 className="font-display mt-5 text-xl font-black tracking-tight text-[hsl(var(--text-main))]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
        {description}
      </p>
    </FadeIn>
  )
}

function ImpactCard({
  title,
  description,
  index,
}: {
  title: string
  description: string
  index: number
}) {
  return (
    <FadeIn
      delay={index * 0.08}
      className="rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl sm:p-6"
    >
      <div className="mb-5 h-1.5 w-14 rounded-full bg-[hsl(var(--brand))]" />

      <h3 className="font-display text-xl font-black tracking-tight text-[hsl(var(--text-main))]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
        {description}
      </p>
    </FadeIn>
  )
}

export default function AboutPage() {
  const { content } = useLocalizedContent()

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <PageHero
            eyebrow={content.aboutPage.eyebrow}
            title={content.aboutPage.title}
            description={content.aboutPage.description}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <StoryBlock title={content.aboutPage.ideaTitle} dark>
              <p>{content.aboutPage.ideaPara1}</p>
              <p>{content.aboutPage.ideaPara2}</p>
            </StoryBlock>

            <StoryBlock title={content.aboutPage.websiteTitle}>
              <p>{content.aboutPage.websitePara1}</p>
              <p>{content.aboutPage.websitePara2}</p>
            </StoryBlock>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-app">
          <div className="mb-8 max-w-3xl">
            <span className="pill">{content.aboutPage.howEyebrow}</span>

            <h2 className="font-display mt-5 text-3xl font-black tracking-tight text-[hsl(var(--text-main))] sm:text-4xl">
              {content.aboutPage.howTitle}
            </h2>

            <p className="mt-4 text-base leading-8 text-[hsl(var(--text-muted))]">
              {content.aboutPage.howDescription}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {content.journeySteps.map((item, index) => (
              <NumberCard
                key={item.step}
                step={item.step}
                title={item.title}
                description={item.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-app">
          <div className="mb-8 max-w-3xl">
            <span className="pill">{content.aboutPage.coreEyebrow}</span>

            <h2 className="font-display mt-5 text-3xl font-black tracking-tight text-[hsl(var(--text-main))] sm:text-4xl">
              {content.aboutPage.coreTitle}
            </h2>

            <p className="mt-4 text-base leading-8 text-[hsl(var(--text-muted))]">
              {content.aboutPage.coreDescription}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {content.impactAreas.map((item, index) => (
              <ImpactCard
                key={item.title}
                title={item.title}
                description={item.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}