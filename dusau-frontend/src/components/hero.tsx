// 'use client'

// import Image from 'next/image'
// import Link from 'next/link'
// import { FadeIn } from '@/components/ui'
// import { useLocalizedContent } from '@/hooks/use-locallized-content'

// export default function Hero() {
//   const { content } = useLocalizedContent()
//   const highlightEvent = content.events[0]

//   return (
//     <section className="section-shell pt-10 sm:pt-14">
//       <div className="container-app grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
//         <FadeIn>
//           <span className="pill">{content.hero.eyebrow}</span>

//           <h1 className="font-display mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
//             {content.hero.titleLead}{' '}
//             <span className="text-gradient">{content.siteConfig.name}</span>
//           </h1>

//           <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
//             {content.hero.description}
//           </p>

//           <div className="mt-8 flex flex-wrap gap-4">
//             <Link href="#recent-events" className="btn-primary">
//               {content.hero.primaryCta}
//             </Link>
//             <Link href="/admin-demo" className="btn-secondary">
//               {content.hero.secondaryCta}
//             </Link>
//           </div>

//           <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             {content.homeStats.map((item) => (
//               <div key={item.label} className="glass p-5">
//                 <p className="font-display text-2xl font-semibold text-white">
//                   {item.value}
//                 </p>
//                 <p className="mt-2 text-sm text-slate-400">{item.label}</p>
//               </div>
//             ))}
//           </div>
//         </FadeIn>

//         <FadeIn delay={0.15}>
//           <div className="relative">
//             <div className="glass-strong relative overflow-hidden p-3 sm:p-4">
//               <div className="relative h-[380px] overflow-hidden rounded-[1.75rem] sm:h-[520px]">
//                 <Image
//                   src={content.siteConfig.heroImage}
//                   alt={content.siteConfig.name}
//                   fill
//                   priority
//                   className="object-cover"
//                   sizes="(max-width: 1024px) 100vw, 50vw"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

//                 <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
//                   <span className="pill">{highlightEvent.category}</span>
//                   <h3 className="font-display mt-4 text-2xl font-semibold text-white sm:text-3xl">
//                     {highlightEvent.title}
//                   </h3>
//                   <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
//                     {highlightEvent.description}
//                   </p>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </FadeIn>
//       </div>
//     </section>
//   )
// }

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FadeIn } from '@/components/ui'
import { getPublicOrganization, type PublicOrganization } from '@/lib/public/api'
import { toMediaUrl } from '@/lib/public/media'

export default function Hero() {
  const [org, setOrg] = useState<PublicOrganization | null>(null)

  useEffect(() => {
    async function loadOrg() {
      try {
        const data = await getPublicOrganization()
        setOrg(data.organization)
      } catch {
        setOrg(null)
      }
    }

    loadOrg()
  }, [])

  return (
    <section className="relative min-h-[760px] overflow-hidden pt-28">
      {org?.cover_image_path && (
        <Image
          src={toMediaUrl(org.cover_image_path)}
          alt={org.cover_title || 'DUSAU'}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}

      <div className="absolute inset-0 bg-slate-950/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" />

      <div className="container-app relative z-10 flex min-h-[620px] items-center">
        <FadeIn className="max-w-4xl">
          <span className="pill">DUSAU</span>

          <h1 className="font-display mt-6 text-5xl font-semibold leading-tight text-white md:text-7xl">
            {org?.cover_title || 'Dhaka University Statistics Alumni Association'}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
            {org?.cover_description ||
              'A connected community of statistics graduates, students, mentors, and professionals.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/events" className="btn-primary">
              Explore Events
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>

          {(org?.public_email || org?.public_phone) && (
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              {org.public_email && <span className="pill">{org.public_email}</span>}
              {org.public_phone && <span className="pill">{org.public_phone}</span>}
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  )
}