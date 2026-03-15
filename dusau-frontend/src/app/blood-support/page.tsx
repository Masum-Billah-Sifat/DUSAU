import Link from 'next/link'
import { FadeIn, SectionHeading } from '@/components/ui'
import { bloodGroupStats } from '@/data/store'

const steps = [
  {
    title: 'Request comes in',
    description:
      'An urgent request is submitted through the public-facing form or contact channel.',
  },
  {
    title: 'Admin checks private donor list',
    description:
      'Authorized coordinators filter by blood group and availability inside the admin dashboard.',
  },
  {
    title: 'Potential donors are contacted',
    description:
      'The system keeps donor information private while allowing quick coordination.',
  },
  {
    title: 'Response is tracked',
    description:
      'Later the backend can store response status, donor availability, and emergency notes.',
  },
]

export default function BloodSupportPage() {
  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Blood support"
            title="A useful and responsible feature for DUSAU’s community role"
            description="This page shows how the organization can publicly support urgent needs without exposing the full donor directory to everyone."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <FadeIn className="glass-strong p-8 sm:p-10">
              <span className="pill">Emergency-ready concept</span>
              <h2 className="font-display mt-5 text-3xl font-semibold text-white">
                Public requests. Private donor management.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                This is the best model for a student organization website. The
                public can request help, but detailed donor information stays
                under trusted admin control. That keeps things safer and more
                professional.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">
                  Request support
                </Link>
                <Link href="/admin-demo" className="btn-secondary">
                  See admin side
                </Link>
              </div>
            </FadeIn>

            <div className="grid gap-4 sm:grid-cols-2">
              {bloodGroupStats.map((item, index) => (
                <FadeIn
                  key={item.group}
                  delay={index * 0.04}
                  className="glass p-5"
                >
                  <p className="font-display text-3xl font-semibold text-white">
                    {item.group}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {item.available} demo donors available
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
            eyebrow="Suggested workflow"
            title="How this feature should work later"
            description="This is one of the most practical future modules for the backend phase."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
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