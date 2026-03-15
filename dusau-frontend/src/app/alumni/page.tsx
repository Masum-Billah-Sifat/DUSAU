import { AlumniCard } from '@/components/cards'
import { FadeIn, SectionHeading } from '@/components/ui'
import { alumni } from '@/data/store'

const reasons = [
  {
    title: 'Credibility',
    description:
      'A visible alumni network immediately shows that DUSAU has history, maturity, and long-term impact.',
  },
  {
    title: 'Mentorship',
    description:
      'Alumni can support current students with career advice, emotional support, and real-world perspective.',
  },
  {
    title: 'Continuity',
    description:
      'When committees change yearly, alumni become the bridge that keeps identity and values alive.',
  },
]

export default function AlumniPage() {
  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Alumni network"
            title="Former members become the long-term strength of DUSAU"
            description="This page is designed to show that the organization does not end with one year’s committee. It grows into a network."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {alumni.map((item, index) => (
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
            {reasons.map((item, index) => (
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