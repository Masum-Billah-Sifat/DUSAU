'use client'

import { useEffect, useState } from 'react'
import { AdvisorCard } from '@/components/cards'
import { FadeIn, SectionHeading } from '@/components/ui'
import { getAllAdvisors, type PublicAdvisor } from '@/lib/public/api'

export default function AdvisorsPage() {
  const [advisors, setAdvisors] = useState<PublicAdvisor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAdvisors() {
      try {
        const data = await getAllAdvisors()
        setAdvisors(data.advisors)
      } catch {
        setAdvisors([])
      } finally {
        setLoading(false)
      }
    }

    loadAdvisors()
  }, [])

  return (
    <main className="page-shell">
      <section className="section-shell">
        <div className="container-app">
          <SectionHeading
            eyebrow="Advisors"
            title="Our Advisors"
            description="Meet the advisors guiding DUSAU with experience, leadership, and professional insight."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loading && <p className="text-sm text-slate-400">Loading advisors...</p>}

            {!loading && advisors.length === 0 && (
              <p className="text-sm text-slate-400">No advisors found.</p>
            )}

            {advisors.map((advisor, index) => (
              <FadeIn key={advisor.id} delay={index * 0.06}>
                <AdvisorCard advisor={advisor} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}