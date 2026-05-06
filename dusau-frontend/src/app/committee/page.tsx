// 'use client'

// import { CommitteeCard } from '@/components/cards'
// import { FadeIn, SectionHeading } from '@/components/ui'
// import { useLocalizedContent } from '@/hooks/use-locallized-content'

// export default function CommitteePage() {
//   const { content } = useLocalizedContent()
//   const currentCommittee = content.committeeYears[0]
//   const archiveCommittees = content.committeeYears.slice(1)

//   return (
//     <main className="page-shell">
//       <section className="section-shell">
//         <div className="container-app">
//           <SectionHeading
//             eyebrow={content.committeePage.eyebrow}
//             title={`${content.committeePage.titlePrefix}${currentCommittee.year}${content.committeePage.titleSuffix}`}
//             description={content.committeePage.description}
//           />

//           <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {currentCommittee.members.map((member, index) => (
//               <FadeIn key={member.name} delay={index * 0.08}>
//                 <CommitteeCard member={member} />
//               </FadeIn>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="section-shell pt-0">
//         <div className="container-app">
//           <SectionHeading
//             eyebrow={content.committeePage.archiveEyebrow}
//             title={content.committeePage.archiveTitle}
//             description={content.committeePage.archiveDescription}
//           />

//           <div className="mt-10 grid gap-6 md:grid-cols-2">
//             {archiveCommittees.map((committee, index) => (
//               <FadeIn
//                 key={committee.year}
//                 delay={index * 0.08}
//                 className="glass-strong p-8"
//               >
//                 <div className="flex flex-wrap items-center justify-between gap-4">
//                   <div>
//                     <p className="pill">
//                       {committee.year}
//                       {content.committeePage.titleSuffix || ' Committee'}
//                     </p>
//                     <h3 className="font-display mt-4 text-2xl font-semibold text-white">
//                       {content.committeePage.archiveCardTitle}
//                     </h3>
//                   </div>
//                   <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
//                     {content.committeePage.archiveMembersPrefix}
//                     {committee.members.length}
//                     {content.committeePage.archiveMembersSuffix}
//                   </div>
//                 </div>

//                 <p className="mt-5 text-base leading-8 text-slate-300">
//                   {committee.summary}
//                 </p>

//                 <div className="mt-6 flex flex-wrap gap-3">
//                   {committee.members.map((member) => (
//                     <span key={member.name} className="pill">
//                       {member.role}
//                     </span>
//                   ))}
//                 </div>
//               </FadeIn>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import { CommitteeCard } from '@/components/cards'
import { FadeIn, SectionHeading } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'
import {
  getPinnedCommitteeWithAllMembers,
  type PublicCommittee,
  type PublicCommitteeMember,
} from '@/lib/public/api'

export default function CommitteePage() {
  const { content } = useLocalizedContent()
  const [committee, setCommittee] = useState<PublicCommittee | null>(null)
  const [members, setMembers] = useState<PublicCommitteeMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCommittee() {
      try {
        const data = await getPinnedCommitteeWithAllMembers()
        setCommittee(data.committee)
        setMembers(data.members)
      } catch {
        setCommittee(null)
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    loadCommittee()
  }, [])

  const title = committee
    ? `${content.committeePage.titlePrefix}${committee.from_year}–${committee.to_year}${content.committeePage.titleSuffix}`
    : content.committeePage.titlePrefix

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.committeePage.eyebrow}
            title={title}
            description={committee?.summary || content.committeePage.description}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loading && (
              <p className="text-sm text-slate-400">Loading committee...</p>
            )}

            {!loading && !committee && (
              <p className="text-sm text-slate-400">No pinned committee found.</p>
            )}

            {!loading && committee && members.length === 0 && (
              <p className="text-sm text-slate-400">No committee members found.</p>
            )}

            {members.map((member, index) => (
              <FadeIn key={member.id} delay={index * 0.08}>
                <CommitteeCard member={member} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}