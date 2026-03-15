import { FadeIn, SectionHeading } from '@/components/ui'
import { contactCards } from '@/data/store'

export default function ContactPage() {
  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Contact"
            title="A simple contact page now, a real submission system later"
            description="For this frontend demo, the form is only visual. In the backend phase we can connect this to real storage, admin review, and email workflows."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-6">
              {contactCards.map((card, index) => (
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
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Reason for contacting DUSAU"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
                  />
                </div>

                <button type="button" className="btn-primary w-fit">
                  Demo submit button
                </button>

                <p className="text-sm text-slate-400">
                  This is a frontend-only form for presentation. Real submission,
                  validation, and dashboard review will come with the backend.
                </p>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  )
}