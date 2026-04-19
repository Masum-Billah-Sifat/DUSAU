'use client'

import { useEffect, useState } from 'react'
import { runPublicChecks } from '@/lib/frontend/public-smoke'

type ResultItem = {
  label: string
  ok: boolean
  data?: unknown
  error?: unknown
}

export default function TestPage() {
  const [eventSlug, setEventSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])

  useEffect(() => {
    let active = true

    async function runInitialChecks() {
      setLoading(true)
      try {
        const nextResults = await runPublicChecks(eventSlug || undefined)
        if (active) {
          setResults(nextResults)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void runInitialChecks()

    return () => {
      active = false
    }
  }, [])

  async function handleRunChecks() {
    setLoading(true)
    try {
      const nextResults = await runPublicChecks(eventSlug || undefined)
      setResults(nextResults)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: '24px', display: 'grid', gap: '20px' }}>
      <section>
        <h1>Public Endpoint Test Page</h1>
        <p>This page calls all public endpoints and logs the responses in the console.</p>
        <div style={{ display: 'grid', gap: '12px', maxWidth: '520px' }}>
          <label>
            <div>Optional event slug for event detail endpoint</div>
            <input
              value={eventSlug}
              onChange={(e) => setEventSlug(e.target.value)}
              placeholder="nobinboron-2026"
              style={{ width: '100%', padding: '10px' }}
            />
          </label>

          <button onClick={handleRunChecks} disabled={loading}>
            {loading ? 'Running public checks...' : 'Run public checks'}
          </button>
        </div>
      </section>

      <section>
        <h2>Public results</h2>
        <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </section>
    </main>
  )
}