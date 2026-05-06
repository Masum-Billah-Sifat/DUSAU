// 'use client'

// import { EventCard } from '@/components/cards'
// import { FadeIn, SectionHeading } from '@/components/ui'
// import { useLocalizedContent } from '@/hooks/use-locallized-content'

// export default function EventsPage() {
//   const { content } = useLocalizedContent()
//   const categories = Array.from(new Set(content.events.map((event) => event.category)))

//   return (
//     <main className="page-shell">
//       <section className="section-shell">
//         <div className="container-app">
//           <SectionHeading
//             eyebrow={content.eventsPage.eyebrow}
//             title={content.eventsPage.title}
//             description={content.eventsPage.description}
//           />

//           <FadeIn className="mt-8 flex flex-wrap gap-3">
//             {categories.map((category) => (
//               <span key={category} className="pill">
//                 {category}
//               </span>
//             ))}
//           </FadeIn>

//           <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {content.events.map((event, index) => (
//               <FadeIn key={event.id} delay={index * 0.05}>
//                 <EventCard event={event} />
//               </FadeIn>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }

'use client'

import { useEffect, useMemo, useState } from 'react'
import { EventCard } from '@/components/cards'
import { FadeIn, SectionHeading } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'
import { getAllEvents, type PublicEventSummary } from '@/lib/public/api'

export default function EventsPage() {
  const { content } = useLocalizedContent()
  const [events, setEvents] = useState<PublicEventSummary[]>([])
  const [loading, setLoading] = useState(true)

  const categories = useMemo(() => ['All Events'], [])

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getAllEvents()
        setEvents(data.events)
      } catch {
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow={content.eventsPage.eyebrow}
            title={content.eventsPage.title}
            description={content.eventsPage.description}
          />

          <FadeIn className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <span key={category} className="pill">
                {category}
              </span>
            ))}
          </FadeIn>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loading && (
              <p className="text-sm text-slate-400">Loading events...</p>
            )}

            {!loading && events.length === 0 && (
              <p className="text-sm text-slate-400">No events found.</p>
            )}

            {events.map((event, index) => (
              <FadeIn key={event.id} delay={index * 0.05}>
                <EventCard event={event} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}