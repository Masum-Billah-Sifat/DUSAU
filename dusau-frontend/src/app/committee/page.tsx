import { CommitteeCard } from '@/components/cards'
import { FadeIn, SectionHeading } from '@/components/ui'
import { committeeYears } from '@/data/store'

export default function CommitteePage() {
  const currentCommittee = committeeYears[0]
  const archiveCommittees = committeeYears.slice(1)

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Committee structure"
            title={`Current leadership: ${currentCommittee.year}`}
            description="Every year a new committee can take over, manage the organization, publish events, and later move into the alumni archive."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentCommittee.members.map((member, index) => (
              <FadeIn key={member.name} delay={index * 0.08}>
                <CommitteeCard member={member} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-app">
          <SectionHeading
            eyebrow="Archive"
            title="Past committees should remain part of the story"
            description="Instead of deleting old leadership, this design keeps every year discoverable so DUSAU feels continuous and established."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {archiveCommittees.map((committee, index) => (
              <FadeIn
                key={committee.year}
                delay={index * 0.08}
                className="glass-strong p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="pill">{committee.year} Committee</p>
                    <h3 className="font-display mt-4 text-2xl font-semibold text-white">
                      Yearly archive
                    </h3>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    {committee.members.length} members shown
                  </div>
                </div>

                <p className="mt-5 text-base leading-8 text-slate-300">
                  {committee.summary}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {committee.members.map((member) => (
                    <span key={member.name} className="pill">
                      {member.role}
                    </span>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}