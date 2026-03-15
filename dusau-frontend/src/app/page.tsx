import Link from 'next/link'
import Hero from '@/components/hero'
import { AlumniCard, CommitteeCard, EventCard } from '@/components/cards'
import { FadeIn, SectionHeading } from '@/components/ui'
import {
  alumni,
  committeeYears,
  events,
  impactAreas,
  siteConfig,
} from '@/data/store'

export default function Home() {
  const featuredEvents = events.filter((event) => event.featured).slice(0, 3)
  const currentCommittee = committeeYears[0]
  const featuredAlumni = alumni.slice(0, 3)

  return (
    <main className="page-shell">
      <Hero />

      <section className="section-shell">
        <div className="container-app grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <FadeIn className="glass-strong p-8 sm:p-10">
            <span className="pill">Why this platform matters</span>
            <h2 className="font-display mt-5 text-3xl font-semibold text-white sm:text-4xl">
              DUSAU is not just an organization. It is a living student legacy.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Every year a new group of students joins Dhaka University from
              Uttara. They need connection, belonging, guidance, and community.
              DUSAU becomes that bridge. It welcomes them, serves people through
              social work, organizes events, and turns one year’s committee into
              the next year’s alumni foundation.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-300">
              This frontend is built to showcase that energy in a modern way:
              premium visuals outside, dynamic admin-ready structure inside.
            </p>
          </FadeIn>

          <div className="grid gap-6">
            {impactAreas.map((item, index) => (
              <FadeIn
                key={item.title}
                delay={index * 0.06}
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

      <section id="recent-events" className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Recent highlights"
            title="The homepage can immediately show what DUSAU is doing now"
            description="From welcome programs to social work, relief, winter support, sports, and alumni sessions — this is where your organization starts to look active, trusted, and alive."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredEvents.map((event, index) => (
              <FadeIn key={event.id} delay={index * 0.08}>
                <EventCard event={event} />
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-8">
            <Link href="/events" className="btn-secondary">
              Explore all events
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Current leadership"
            title={`Meet the ${currentCommittee.year} committee`}
            description="This section is designed so that every year a new committee can be displayed beautifully, while past committees remain archived."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentCommittee.members.slice(0, 6).map((member, index) => (
              <FadeIn key={member.name} delay={index * 0.08}>
                <CommitteeCard member={member} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="container-app">
          <div className="glass-strong grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.05fr_0.95fr]">
            <FadeIn>
              <span className="pill">Emergency support</span>
              <h2 className="font-display mt-5 text-3xl font-semibold text-white sm:text-4xl">
                DUSAU can also become a serious blood-support and emergency
                help platform
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                The public website can collect urgent requests, while the donor
                list remains private and admin-controlled for safety. That means
                the site looks responsible, useful, and well organized.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/blood-support" className="btn-primary">
                  Blood support page
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Contact DUSAU
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.12} className="grid gap-4 sm:grid-cols-2">
              <div className="glass p-5">
                <p className="text-sm text-slate-400">Public facing</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Urgent request form
                </p>
              </div>
              <div className="glass p-5">
                <p className="text-sm text-slate-400">Private system</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Donor directory for admins
                </p>
              </div>
              <div className="glass p-5">
                <p className="text-sm text-slate-400">Fast response</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Blood group filtering later
                </p>
              </div>
              <div className="glass p-5">
                <p className="text-sm text-slate-400">Trust</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Useful social impact feature
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Alumni strength"
            title="A strong alumni section gives DUSAU prestige and continuity"
            description="When visitors see former members now working in good places, the organization instantly feels established, real, and respected."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredAlumni.map((item, index) => (
              <FadeIn key={item.name} delay={index * 0.08}>
                <AlumniCard alumni={item} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pt-4">
        <div className="container-app">
          <FadeIn className="glass-strong p-8 sm:p-10">
            <span className="pill">Closing thought</span>
            <h2 className="font-display mt-5 text-3xl font-semibold text-white sm:text-4xl">
              A website like this can make DUSAU feel bigger than just a Facebook
              page
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              It can communicate identity, trust, activity, leadership, service,
              and long-term legacy. For DUSAU, the best direction is not an open
              social network at first. It is a premium public website plus a
              future admin dashboard where each new yearly committee can manage
              events, members, alumni, media, and support initiatives.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-300">
              That is the sweet spot: beautiful on the outside, dynamic on the
              inside, and built to grow into a real platform later.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/about" className="btn-secondary">
                Read the story
              </Link>
              <Link href="/admin-demo" className="btn-primary">
                See future admin vision
              </Link>
            </div>

            <p className="mt-8 text-sm text-slate-400">
              Demo note: All content here is placeholder frontend content using
              one shared image and centralized dummy data from store.ts.
            </p>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}