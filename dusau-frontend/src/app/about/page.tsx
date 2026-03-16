'use client'

import { FadeIn, SectionHeading } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'

export default function AboutPage() {
  const { content } = useLocalizedContent()

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.aboutPage.eyebrow}
            title={content.aboutPage.title}
            description={content.aboutPage.description}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <FadeIn className="glass-strong p-8">
              <h3 className="font-display text-2xl font-semibold text-white">
                {content.aboutPage.ideaTitle}
              </h3>
              <p className="mt-4 text-base leading-8 text-slate-300">
                {content.aboutPage.ideaPara1}
              </p>
              <p className="mt-4 text-base leading-8 text-slate-300">
                {content.aboutPage.ideaPara2}
              </p>
            </FadeIn>

            <FadeIn delay={0.1} className="glass-strong p-8">
              <h3 className="font-display text-2xl font-semibold text-white">
                {content.aboutPage.websiteTitle}
              </h3>
              <p className="mt-4 text-base leading-8 text-slate-300">
                {content.aboutPage.websitePara1}
              </p>
              <p className="mt-4 text-base leading-8 text-slate-300">
                {content.aboutPage.websitePara2}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.aboutPage.howEyebrow}
            title={content.aboutPage.howTitle}
            description={content.aboutPage.howDescription}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {content.journeySteps.map((item, index) => (
              <FadeIn key={item.step} delay={index * 0.08} className="glass p-6">
                <p className="font-display text-4xl font-semibold text-white/30">
                  {item.step}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">
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

      <section className="section-shell pt-0">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.aboutPage.coreEyebrow}
            title={content.aboutPage.coreTitle}
            description={content.aboutPage.coreDescription}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {content.impactAreas.map((item, index) => (
              <FadeIn
                key={item.title}
                delay={index * 0.08}
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
    </main>
  )
}