import { FadeIn, SectionHeading } from '@/components/ui'
import { adminModules, committeeYears, events, homeStats } from '@/data/store'

export default function AdminDemoPage() {
  const currentCommittee = committeeYears[0]

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Admin demo"
            title="This is how the future dynamic side of DUSAU can look"
            description="This page is still frontend-only, but it helps you show the organization how each new committee could manage content, people, and community data."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {homeStats.map((stat, index) => (
              <FadeIn
                key={stat.label}
                delay={index * 0.06}
                className="glass p-5"
              >
                <p className="font-display text-3xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </FadeIn>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <FadeIn className="glass-strong p-8">
              <span className="pill">Committee control</span>
              <h2 className="font-display mt-5 text-3xl font-semibold text-white">
                Create a new committee year with one action
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                This is one of the most important features for DUSAU. Every year,
                a new committee should be able to take ownership, add roles,
                assign members, and keep older years archived automatically.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="glass p-5">
                  <p className="text-sm text-slate-400">Current year</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {currentCommittee.year} Committee
                  </p>
                </div>
                <div className="glass p-5">
                  <p className="text-sm text-slate-400">Current members</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {currentCommittee.members.length} shown in demo
                  </p>
                </div>
                <div className="glass p-5">
                  <p className="text-sm text-slate-400">Published events</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {events.length} demo items
                  </p>
                </div>
                <div className="glass p-5">
                  <p className="text-sm text-slate-400">Future access</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Role-based admin system
                  </p>
                </div>
              </div>
            </FadeIn>

            <div className="grid gap-6 md:grid-cols-2">
              {adminModules.map((module, index) => (
                <FadeIn
                  key={module.title}
                  delay={index * 0.06}
                  className="glass p-6"
                >
                  <p className="pill">{module.count}</p>
                  <h3 className="font-display mt-4 text-xl font-semibold text-white">
                    {module.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {module.description}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}