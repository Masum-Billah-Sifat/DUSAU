import Image from 'next/image'
import Link from 'next/link'
import { events, homeStats, siteConfig } from '@/data/store'
import { FadeIn } from '@/components/ui'

export default function Hero() {
  const highlightEvent = events[0]

  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="container-app grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <FadeIn>
          <span className="pill">Student-led • Service-driven • Uttara to DU</span>

          <h1 className="font-display mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            A modern digital home for{' '}
            <span className="text-gradient">{siteConfig.name}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {siteConfig.fullName} is a student-run platform built around
            welcome, welfare, events, alumni connection, and meaningful social
            work. This frontend is designed as a premium showcase that can later
            connect to a real admin dashboard and backend.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="#recent-events" className="btn-primary">
              See recent events
            </Link>
            <Link href="/admin-demo" className="btn-secondary">
              View admin demo
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {homeStats.map((item) => (
              <div key={item.label} className="glass p-5">
                <p className="font-display text-2xl font-semibold text-white">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="relative">
            <div className="glass-strong relative overflow-hidden p-3 sm:p-4">
              <div className="relative h-[380px] overflow-hidden rounded-[1.75rem] sm:h-[520px]">
                <Image
                  src={siteConfig.heroImage}
                  alt="DUSAU"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <span className="pill">{highlightEvent.category}</span>
                  <h3 className="font-display mt-4 text-2xl font-semibold text-white sm:text-3xl">
                    {highlightEvent.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
                    {highlightEvent.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass absolute -bottom-6 left-4 max-w-[230px] p-4 sm:-left-8 sm:max-w-[260px]">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Annual committee cycle
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                New students join. A new committee leads. Alumni stay connected.
                The story continues every year.
              </p>
            </div>

            <div className="glass absolute -right-2 top-6 max-w-[220px] p-4 sm:-right-8">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Platform vision
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Public-facing impact website now, dynamic backend-powered system
                next.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}