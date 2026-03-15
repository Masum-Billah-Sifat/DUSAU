import { EventCard } from '@/components/cards'
import { FadeIn, SectionHeading } from '@/components/ui'
import { events } from '@/data/store'

export default function EventsPage() {
  const categories = Array.from(new Set(events.map((event) => event.category)))

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Events & programs"
            title="One platform for social work, welcome programs, bonding, and response"
            description="This page is built so future admins can keep adding events with titles, descriptions, images, videos, dates, and categories."
          />

          <FadeIn className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <span key={category} className="pill">
                {category}
              </span>
            ))}
          </FadeIn>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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