'use client'

import { FadeIn, SectionHeading } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'

export default function ContactPage() {
  const { content } = useLocalizedContent()

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.contactPage.eyebrow}
            title={content.contactPage.title}
            description={content.contactPage.description}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-6">
              {content.contactCards.map((card, index) => (
                <FadeIn
                  key={card.title}
                  delay={index * 0.08}
                  className="glass p-6"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    {card.title}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {card.value}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {card.description}
                  </p>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.1} className="glass-strong p-8">
              <form className="grid gap-5">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    {content.contactPage.form.nameLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={content.contactPage.form.namePlaceholder}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    {content.contactPage.form.emailLabel}
                  </label>
                  <input
                    type="email"
                    placeholder={content.contactPage.form.emailPlaceholder}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    {content.contactPage.form.subjectLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={content.contactPage.form.subjectPlaceholder}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    {content.contactPage.form.messageLabel}
                  </label>
                  <textarea
                    rows={6}
                    placeholder={content.contactPage.form.messagePlaceholder}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
                  />
                </div>

                <button type="button" className="btn-primary w-fit">
                  {content.contactPage.form.buttonLabel}
                </button>

                <p className="text-sm text-slate-400">
                  {content.contactPage.form.note}
                </p>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  )
}