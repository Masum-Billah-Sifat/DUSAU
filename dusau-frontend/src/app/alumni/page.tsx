'use client'

import { AlumniCard } from '@/components/cards'
import { FadeIn, SectionHeading } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'

export default function AlumniPage() {
  const { content } = useLocalizedContent()

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.alumniPage.eyebrow}
            title={content.alumniPage.title}
            description={content.alumniPage.description}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {content.alumni.map((item, index) => (
              <FadeIn key={item.name} delay={index * 0.06}>
                <AlumniCard alumni={item} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-app">
          <div className="grid gap-6 md:grid-cols-3">
            {content.alumniPage.reasons.map((item, index) => (
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