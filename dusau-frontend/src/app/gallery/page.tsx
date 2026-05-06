'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FadeIn } from '@/components/ui'
import { useLocalizedContent } from '@/hooks/use-locallized-content'
import { getAllGallery, type PublicGalleryItem } from '@/lib/public/api'
import { toMediaUrl } from '@/lib/public/media'

const heights = ['h-[260px]', 'h-[340px]', 'h-[300px]']

function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="pill">{eyebrow}</span>

      <h1 className="font-display mt-5 text-4xl font-black tracking-tight text-[hsl(var(--text-main))] sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      <p className="mt-5 text-base leading-8 text-[hsl(var(--text-muted))] sm:text-lg">
        {description}
      </p>
    </div>
  )
}

function GallerySkeleton() {
  return (
    <div className="masonry-columns mt-12">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="masonry-item mb-4">
          <div className="overflow-hidden rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white shadow-sm">
            <div
              className={`${heights[index % heights.length]} animate-pulse bg-[hsl(var(--app-bg-soft))]`}
            />
            <div className="space-y-3 p-5">
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
              <div className="h-3 w-full animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mt-12 rounded-[2rem] border border-dashed border-[hsl(var(--border-strong))] bg-white/80 p-8 text-center shadow-sm">
      <h3 className="font-display text-2xl font-black text-[hsl(var(--text-main))]">
        No gallery items found
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[hsl(var(--text-muted))]">
        Gallery photos will appear here once they are added from the admin dashboard.
      </p>
    </div>
  )
}

export default function GalleryPage() {
  const { content } = useLocalizedContent()
  const [galleryItems, setGalleryItems] = useState<PublicGalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadGallery() {
      try {
        const data = await getAllGallery()
        if (active) setGalleryItems(data.gallery_items)
      } catch {
        if (active) setGalleryItems([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadGallery()

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <PageHero
            eyebrow={content.galleryPage.eyebrow}
            title={content.galleryPage.title}
            description={content.galleryPage.description}
          />

          {loading ? (
            <GallerySkeleton />
          ) : galleryItems.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="masonry-columns mt-12">
              {galleryItems.map((item, index) => (
                <div key={item.id} className="masonry-item mb-4">
                  <FadeIn
                    delay={index * 0.04}
                    className="group overflow-hidden rounded-[1.7rem] border border-[hsl(var(--border-soft))] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--brand)_/_0.35)] hover:shadow-xl"
                  >
                    <div
                      className={`relative ${heights[index % heights.length]} overflow-hidden bg-[hsl(var(--app-bg-soft))]`}
                    >
                      <Image
                        src={toMediaUrl(item.image_path)}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
                        Gallery
                      </p>

                      <h3 className="font-display mt-2 text-xl font-black tracking-tight text-[hsl(var(--text-main))]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
                        {item.description}
                      </p>
                    </div>
                  </FadeIn>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}