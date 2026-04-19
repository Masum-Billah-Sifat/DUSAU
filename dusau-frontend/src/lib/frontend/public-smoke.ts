import { publicJson } from '@/lib/frontend/api'

type SmokeResult = {
  label: string
  ok: boolean
  data?: unknown
  error?: unknown
}

function logSuccess(label: string, data: unknown) {
  console.log(`[public] ${label}`, data)
  return { label, ok: true, data } satisfies SmokeResult
}

function logFailure(label: string, error: unknown) {
  console.error(`[public] ${label}`, error)
  return { label, ok: false, error } satisfies SmokeResult
}

export async function runPublicChecks(eventSlug?: string) {
  const endpoints = [
    { label: 'GET /api/public/org', url: '/api/public/org' },
    { label: 'GET /api/public/events/homepage', url: '/api/public/events/homepage' },
    { label: 'GET /api/public/events/page', url: '/api/public/events/page' },
    {
      label: eventSlug
        ? `GET /api/public/events/${eventSlug}`
        : 'GET /api/public/events/[slug] skipped',
      url: eventSlug ? `/api/public/events/${eventSlug}` : null,
    },
    {
      label: 'GET /api/public/committee/current/pinned-members',
      url: '/api/public/committee/current/pinned-members',
    },
    {
      label: 'GET /api/public/committee/current/members',
      url: '/api/public/committee/current/members',
    },
    { label: 'GET /api/public/alumni', url: '/api/public/alumni' },
    { label: 'GET /api/public/advisors/pinned', url: '/api/public/advisors/pinned' },
    { label: 'GET /api/public/advisors', url: '/api/public/advisors' },
    { label: 'GET /api/public/gallery/pinned', url: '/api/public/gallery/pinned' },
  ]

  const results: SmokeResult[] = []

  for (const endpoint of endpoints) {
    if (!endpoint.url) {
      const skipped = {
        label: endpoint.label,
        ok: true,
        data: { skipped: true },
      } satisfies SmokeResult
      console.log('[public] skipped event detail endpoint because no slug was provided')
      results.push(skipped)
      continue
    }

    try {
      const data = await publicJson(endpoint.url, { method: 'GET' })
      results.push(logSuccess(endpoint.label, data))
    } catch (error) {
      results.push(logFailure(endpoint.label, error))
    }
  }

  return results
}