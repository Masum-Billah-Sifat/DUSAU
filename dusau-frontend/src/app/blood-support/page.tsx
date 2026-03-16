'use client'

import Link from 'next/link'
import { FadeIn, SectionHeading } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'

export default function BloodSupportPage() {
  const { content } = useLocalizedContent()

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.bloodSupportPage.eyebrow}
            title={content.bloodSupportPage.title}
            description={content.bloodSupportPage.description}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <FadeIn className="glass-strong p-8 sm:p-10">
              <span className="pill">{content.bloodSupportPage.heroEyebrow}</span>
              <h2 className="font-display mt-5 text-3xl font-semibold text-white">
                {content.bloodSupportPage.heroTitle}
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                {content.bloodSupportPage.heroPara}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">
                  {content.bloodSupportPage.heroPrimaryCta}
                </Link>
                <Link href="/admin-demo" className="btn-secondary">
                  {content.bloodSupportPage.heroSecondaryCta}
                </Link>
              </div>
            </FadeIn>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.bloodGroupStats.map((item, index) => (
                <FadeIn
                  key={item.group}
                  delay={index * 0.04}
                  className="glass p-5"
                >
                  <p className="font-display text-3xl font-semibold text-white">
                    {item.group}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {item.available}
                    {content.bloodSupportPage.availableSuffix}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.bloodSupportPage.workflowEyebrow}
            title={content.bloodSupportPage.workflowTitle}
            description={content.bloodSupportPage.workflowDescription}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {content.bloodSupportPage.steps.map((step, index) => (
              <FadeIn
                key={step.title}
                delay={index * 0.08}
                className="glass p-6"
              >
                <h3 className="font-display text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {step.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}