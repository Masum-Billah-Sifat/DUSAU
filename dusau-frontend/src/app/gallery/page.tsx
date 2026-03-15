import Image from 'next/image'
import { FadeIn, SectionHeading } from '@/components/ui'
import { galleryItems } from '@/data/store'

const heights = ['h-[260px]', 'h-[340px]', 'h-[300px]']

export default function GalleryPage() {
  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Gallery"
            title="A visual story of service, people, memory, and movement"
            description="For now this uses the same dummy image everywhere. Later each item can be tied to real events, albums, and media uploads."
          />

          <div className="masonry-columns mt-10">
            {galleryItems.map((item, index) => (
              <div key={item.id} className="masonry-item mb-4">
                <FadeIn className="glass group overflow-hidden">
                  <div
                    className={`relative ${heights[index % heights.length]} overflow-hidden`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {item.caption}
                    </p>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}