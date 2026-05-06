'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FadeIn } from '@/components/ui'
import {
  getPublicEventDetails,
  type PublicEventDetails,
  type PublicEventImage,
  type PublicEventVideo,
} from '@/lib/public/api'
import {
  formatDisplayDate,
  toMediaUrl,
  toYouTubeEmbedUrl,
} from '@/lib/public/media'

function EventDetailsSkeleton() {
  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <div className="h-10 w-40 animate-pulse rounded-full bg-white" />

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-4 rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-6 shadow-sm">
              <div className="h-4 w-28 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
              <div className="h-10 w-5/6 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
              <div className="h-4 w-full animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
            </div>

            <div className="h-[360px] animate-pulse rounded-[2rem] bg-white shadow-sm" />
          </div>
        </div>
      </section>
    </main>
  )
}

function EmptyMediaState({ text }: { text: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-[hsl(var(--border-strong))] bg-white/80 p-8 text-center shadow-sm md:col-span-2 xl:col-span-3">
      <p className="text-sm font-semibold leading-7 text-[hsl(var(--text-muted))]">
        {text}
      </p>
    </div>
  )
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <span className="pill">{eyebrow}</span>

      <h2 className="font-display mt-5 text-3xl font-black tracking-tight text-[hsl(var(--text-main))] sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-base leading-8 text-[hsl(var(--text-muted))]">
        {description}
      </p>
    </div>
  )
}

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>()
  const eventId = params.id

  const [event, setEvent] = useState<PublicEventDetails | null>(null)
  const [images, setImages] = useState<PublicEventImage[]>([])
  const [videos, setVideos] = useState<PublicEventVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadEvent() {
      try {
        const data = await getPublicEventDetails(eventId)

        if (!active) return

        setEvent(data.event)
        setImages(data.images)
        setVideos(data.videos)
      } catch {
        if (!active) return

        setEvent(null)
        setImages([])
        setVideos([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadEvent()

    return () => {
      active = false
    }
  }, [eventId])

  if (loading) {
    return <EventDetailsSkeleton />
  }

  if (!event) {
    return (
      <main className="page-shell">
        <section className="section-shell">
          <div className="container-app">
            <div className="mx-auto max-w-xl rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-8 text-center shadow-xl">
              <h1 className="font-display text-3xl font-black text-[hsl(var(--text-main))]">
                Event not found
              </h1>

              <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
                This event may have been removed, archived, or the link may be incorrect.
              </p>

              <Link href="/events" className="btn-primary mt-6 w-full sm:w-fit">
                Back to Events
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <FadeIn>
            <Link href="/events" className="btn-secondary w-full sm:w-fit">
              ← Back to Events
            </Link>
          </FadeIn>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <FadeIn className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <span className="pill">{event.category || 'Event'}</span>

              <h1 className="font-display mt-5 text-4xl font-black leading-tight tracking-tight text-[hsl(var(--text-main))] sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>

              <p className="mt-5 text-base leading-8 text-[hsl(var(--text-muted))] sm:text-lg">
                {event.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full border border-[hsl(var(--brand)_/_0.18)] bg-[hsl(var(--brand-soft))] px-3 py-1.5 text-xs font-extrabold text-[hsl(var(--brand))]">
                  {formatDisplayDate(event.event_date)}
                </span>

                {event.location_tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-3 py-1.5 text-xs font-bold text-[hsl(var(--text-muted))]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>

            <FadeIn
              delay={0.1}
              className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-3 shadow-xl"
            >
              <div className="relative h-[300px] overflow-hidden rounded-[1.5rem] bg-[hsl(var(--app-bg-soft))] sm:h-[420px]">
                <Image
                  src={toMediaUrl(event.cover_image_path)}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-app">
          <SectionIntro
            eyebrow="Photos"
            title="Event Gallery"
            description="Photos connected to this event."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {images.length === 0 && (
              <EmptyMediaState text="No images found for this event." />
            )}

            {images.map((image, index) => (
              <FadeIn
                key={image.id}
                delay={index * 0.05}
                className="group overflow-hidden rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl"
              >
                <div className="relative h-72 overflow-hidden rounded-[1.25rem] bg-[hsl(var(--app-bg-soft))]">
                  <Image
                    src={toMediaUrl(image.image_path)}
                    alt={`${event.title} image ${index + 1}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {videos.length > 0 && (
        <section className="section-shell pt-0">
          <div className="container-app">
            <SectionIntro
              eyebrow="Videos"
              title="Event Videos"
              description="Watch videos from this event."
            />

            <div className="grid gap-5 lg:grid-cols-2">
              {videos.map((video, index) => {
                const embedUrl = toYouTubeEmbedUrl(video.youtube_url)

                if (!embedUrl) return null

                return (
                  <FadeIn
                    key={video.id}
                    delay={index * 0.06}
                    className="overflow-hidden rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl"
                  >
                    <div className="aspect-video overflow-hidden rounded-[1.25rem] bg-[hsl(var(--app-bg-soft))]">
                      <iframe
                        src={embedUrl}
                        title={`${event.title} video ${index + 1}`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}