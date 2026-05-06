'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FadeIn, SectionHeading } from '@/components/ui'
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

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>()
  const eventId = params.id

  const [event, setEvent] = useState<PublicEventDetails | null>(null)
  const [images, setImages] = useState<PublicEventImage[]>([])
  const [videos, setVideos] = useState<PublicEventVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getPublicEventDetails(eventId)
        setEvent(data.event)
        setImages(data.images)
        setVideos(data.videos)
      } catch {
        setEvent(null)
        setImages([])
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [eventId])

  if (loading) {
    return (
      <main className="page-shell">
        <section className="section-shell">
          <div className="container-app">
            <p className="text-sm text-slate-400">Loading event...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="page-shell">
        <section className="section-shell">
          <div className="container-app">
            <p className="text-sm text-slate-400">Event not found.</p>
            <Link href="/events" className="mt-5 inline-block btn-secondary">
              Back to Events
            </Link>
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
            <Link href="/events" className="text-sm text-blue-300">
              ← Back to Events
            </Link>
          </FadeIn>

          <div className="mt-8">
            <SectionHeading
              eyebrow={event.category}
              title={event.title}
              description={event.description}
            />
          </div>

          <FadeIn className="mt-8 flex flex-wrap gap-3">
            <span className="pill">{formatDisplayDate(event.event_date)}</span>
            {event.location_tags.map((tag) => (
              <span key={tag} className="pill">
                {tag}
              </span>
            ))}
          </FadeIn>

          <FadeIn className="glass mt-10 overflow-hidden">
            <div className="relative h-[420px] overflow-hidden">
              <Image
                src={toMediaUrl(event.cover_image_path)}
                alt={event.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-app">
          <SectionHeading
            eyebrow="Photos"
            title="Event Gallery"
            description="Photos connected to this event."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {images.length === 0 && (
              <p className="text-sm text-slate-400">No images found.</p>
            )}

            {images.map((image, index) => (
              <FadeIn key={image.id} delay={index * 0.05} className="glass overflow-hidden">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={toMediaUrl(image.image_path)}
                    alt={`${event.title} image ${index + 1}`}
                    fill
                    className="object-cover transition duration-700 hover:scale-105"
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
            <SectionHeading
              eyebrow="Videos"
              title="Event Videos"
              description="Watch videos from this event."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {videos.map((video, index) => {
                const embedUrl = toYouTubeEmbedUrl(video.youtube_url)

                if (!embedUrl) return null

                return (
                  <FadeIn key={video.id} delay={index * 0.06} className="glass overflow-hidden p-3">
                    <div className="aspect-video overflow-hidden rounded-2xl">
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