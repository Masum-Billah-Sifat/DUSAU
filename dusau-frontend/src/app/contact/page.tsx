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

export default function ContactPage() {
  const { content } = useLocalizedContent()

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <PageHero
            eyebrow={content.contactPage.eyebrow}
            title={content.contactPage.title}
            description={content.contactPage.description}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="grid gap-5">
              {content.contactCards.map((card, index) => (
                <FadeIn
                  key={card.title}
                  delay={index * 0.08}
                  className="rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl"
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
                    {card.title}
                  </p>

                  <h3 className="font-display mt-3 text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
                    {card.value}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
                    {card.description}
                  </p>
                </FadeIn>
              ))}
            </div>

            <FadeIn
              delay={0.1}
              className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl"
            >
              <div className="border-b border-[hsl(var(--border-soft))] bg-[hsl(var(--brand-soft))] p-6 sm:p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
                  Send Message
                </p>

                <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-[hsl(var(--text-main))]">
                  Contact DUSAU
                </h2>

                <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
                  Fill out the form below and the organization team can follow up.
                </p>
              </div>

              <form className="grid gap-5 p-6 sm:p-8">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[hsl(var(--text-main))]">
                    {content.contactPage.form.nameLabel}
                  </label>

                  <input
                    type="text"
                    placeholder={content.contactPage.form.namePlaceholder}
                    className="w-full rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-[hsl(var(--text-main))] outline-none transition placeholder:text-[hsl(var(--text-soft))] focus:border-[hsl(var(--brand))] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[hsl(var(--text-main))]">
                    {content.contactPage.form.emailLabel}
                  </label>

                  <input
                    type="email"
                    placeholder={content.contactPage.form.emailPlaceholder}
                    className="w-full rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-[hsl(var(--text-main))] outline-none transition placeholder:text-[hsl(var(--text-soft))] focus:border-[hsl(var(--brand))] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[hsl(var(--text-main))]">
                    {content.contactPage.form.subjectLabel}
                  </label>

                  <input
                    type="text"
                    placeholder={content.contactPage.form.subjectPlaceholder}
                    className="w-full rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-[hsl(var(--text-main))] outline-none transition placeholder:text-[hsl(var(--text-soft))] focus:border-[hsl(var(--brand))] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[hsl(var(--text-main))]">
                    {content.contactPage.form.messageLabel}
                  </label>

                  <textarea
                    rows={6}
                    placeholder={content.contactPage.form.messagePlaceholder}
                    className="w-full resize-none rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-[hsl(var(--text-main))] outline-none transition placeholder:text-[hsl(var(--text-soft))] focus:border-[hsl(var(--brand))] focus:bg-white"
                  />
                </div>

                <button type="button" className="btn-primary w-full sm:w-fit">
                  {content.contactPage.form.buttonLabel}
                </button>

                <p className="rounded-2xl bg-[hsl(var(--app-bg-soft))] p-4 text-sm leading-7 text-[hsl(var(--text-muted))]">
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