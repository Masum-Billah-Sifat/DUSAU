import { FadeIn, SectionHeading } from '@/components/ui'
import { impactAreas, journeySteps, siteConfig } from '@/data/store'

export default function AboutPage() {
  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="About DUSAU"
            title="Built by students, carried by students, remembered by alumni"
            description={`${siteConfig.fullName} began from a simple but powerful idea: students from Uttara studying at Dhaka University should not feel disconnected. They should have a community.`}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <FadeIn className="glass-strong p-8">
              <h3 className="font-display text-2xl font-semibold text-white">
                The idea behind the organization
              </h3>
              <p className="mt-4 text-base leading-8 text-slate-300">
                DUSAU exists to create belonging. It welcomes new students,
                builds friendships across batches, organizes events, and channels
                student energy into meaningful social work. It is both a support
                network and a leadership platform.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-300">
                Over time, what starts as a student community becomes something
                larger: a legacy of service, memory, responsibility, and alumni
                connection.
              </p>
            </FadeIn>

            <FadeIn delay={0.1} className="glass-strong p-8">
              <h3 className="font-display text-2xl font-semibold text-white">
                What this website should do
              </h3>
              <p className="mt-4 text-base leading-8 text-slate-300">
                This website should make DUSAU look organized, active, and
                future-ready. It should show current activities publicly while
                quietly preparing for a dynamic admin panel where each new yearly
                committee can manage events, content, and people.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-300">
                It is not just a design project. It is a digital foundation for
                continuity.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-app">
          <SectionHeading
            eyebrow="How it works"
            title="The DUSAU journey repeats every year — and that is its power"
            description="A strong website should reflect the yearly rhythm of welcome, leadership, service, and alumni transition."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {journeySteps.map((item, index) => (
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
            eyebrow="What DUSAU stands for"
            title="Core areas of activity"
            description="These are the kinds of work and programs the public-facing website should repeatedly highlight."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {impactAreas.map((item, index) => (
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