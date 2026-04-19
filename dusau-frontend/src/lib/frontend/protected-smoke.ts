import { adminJson } from '@/lib/frontend/api'

type JsonRecord = Record<string, unknown>

type SmokeResult = {
  label: string
  ok: boolean
  data?: unknown
  error?: unknown
}

function logSuccess(label: string, data: unknown) {
  console.log(`[protected] ${label}`, data)
  return { label, ok: true, data } satisfies SmokeResult
}

function logFailure(label: string, error: unknown) {
  console.error(`[protected] ${label}`, error)
  return { label, ok: false, error } satisfies SmokeResult
}

export async function runProtectedGetChecks() {
  const endpoints = [
    { label: 'GET /api/admin/org', url: '/api/admin/org' },
    { label: 'GET /api/admin/committees', url: '/api/admin/committees' },
    { label: 'GET /api/admin/alumni', url: '/api/admin/alumni' },
    { label: 'GET /api/admin/advisors', url: '/api/admin/advisors' },
    { label: 'GET /api/admin/events', url: '/api/admin/events' },
    { label: 'GET /api/admin/member-directory', url: '/api/admin/member-directory' },
    { label: 'GET /api/admin/gallery', url: '/api/admin/gallery' },
  ]

  const results: SmokeResult[] = []

  for (const endpoint of endpoints) {
    try {
      const data = await adminJson(endpoint.url, { method: 'GET' })
      results.push(logSuccess(endpoint.label, data))
    } catch (error) {
      results.push(logFailure(endpoint.label, error))
    }
  }

  return results
}

export async function runProtectedCrudSmokeTest() {
  const results: SmokeResult[] = []
  const stamp = Date.now()

  let committeeId = ''
  let committeeMemberId = ''
  let alumniId = ''
  let advisorId = ''
  let eventId = ''
  let eventImageId = ''
  let eventVideoId = ''
  let memberDirectoryId = ''
  let galleryId = ''
  const eventSlug = `frontend-smoke-event-${stamp}`

  async function step<T>(label: string, runner: () => Promise<T>) {
    try {
      const data = await runner()
      results.push(logSuccess(label, data))
      return data
    } catch (error) {
      results.push(logFailure(label, error))
      return null
    }
  }

  await step('PATCH /api/admin/org', () =>
    adminJson('/api/admin/org', {
      method: 'PATCH',
      body: JSON.stringify({
        email: `admin+${stamp}@dusau.org`,
        phone: '+8801700000000',
        cover_image_path: `org/${stamp}/cover.jpg`,
        cover_title: `Smoke cover ${stamp}`,
        cover_description: `Smoke description ${stamp}`,
      }),
    })
  )

  const createdCommittee = (await step('POST /api/admin/committees', () =>
    adminJson<JsonRecord>('/api/admin/committees', {
      method: 'POST',
      body: JSON.stringify({
        from_year: 2025,
        to_year: 2026,
        summary: `Smoke committee ${stamp}`,
        is_archived: false,
        is_pinned: true,
      }),
    })
  )) as JsonRecord | null

  committeeId = typeof createdCommittee?.id === 'string' ? createdCommittee.id : ''

  if (committeeId) {
    await step(`GET /api/admin/committees/${committeeId}`, () =>
      adminJson(`/api/admin/committees/${committeeId}`, { method: 'GET' })
    )

    await step(`PATCH /api/admin/committees/${committeeId}`, () =>
      adminJson(`/api/admin/committees/${committeeId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          summary: `Updated smoke committee ${stamp}`,
          is_archived: false,
          is_pinned: true,
        }),
      })
    )

    const createdMember = (await step(
      `POST /api/admin/committees/${committeeId}/members`,
      () =>
        adminJson<JsonRecord>(`/api/admin/committees/${committeeId}/members`, {
          method: 'POST',
          body: JSON.stringify({
            name: `Smoke Member ${stamp}`,
            profile_image_path: null,
            session: '2022-23',
            department: 'Economics',
            position: 'President',
            is_pinned: true,
            sort_order: 1,
          }),
        })
    )) as JsonRecord | null

    committeeMemberId = typeof createdMember?.id === 'string' ? createdMember.id : ''

    await step(`GET /api/admin/committees/${committeeId}/members`, () =>
      adminJson(`/api/admin/committees/${committeeId}/members`, { method: 'GET' })
    )

    if (committeeMemberId) {
      await step(
        `GET /api/admin/committees/${committeeId}/members/${committeeMemberId}`,
        () =>
          adminJson(
            `/api/admin/committees/${committeeId}/members/${committeeMemberId}`,
            { method: 'GET' }
          )
      )

      await step(
        `PATCH /api/admin/committees/${committeeId}/members/${committeeMemberId}`,
        () =>
          adminJson(
            `/api/admin/committees/${committeeId}/members/${committeeMemberId}`,
            {
              method: 'PATCH',
              body: JSON.stringify({
                position: 'Updated President',
                is_pinned: true,
                sort_order: 2,
              }),
            }
          )
      )
    }
  }

  const createdAlumni = (await step('POST /api/admin/alumni', () =>
    adminJson<JsonRecord>('/api/admin/alumni', {
      method: 'POST',
      body: JSON.stringify({
        name: `Smoke Alumni ${stamp}`,
        profile_image_path: null,
        session: '2018',
        department: 'CSE',
        current_company: 'Mock Company',
        current_position: 'Engineer',
        short_quote: 'Testing alumni endpoint.',
        latest_dusau_position: 'Former Member',
        is_archived: false,
        is_pinned: true,
        sort_order: 1,
      }),
    })
  )) as JsonRecord | null

  alumniId = typeof createdAlumni?.id === 'string' ? createdAlumni.id : ''

  await step('GET /api/admin/alumni', () => adminJson('/api/admin/alumni', { method: 'GET' }))

  if (alumniId) {
    await step(`GET /api/admin/alumni/${alumniId}`, () =>
      adminJson(`/api/admin/alumni/${alumniId}`, { method: 'GET' })
    )

    await step(`PATCH /api/admin/alumni/${alumniId}`, () =>
      adminJson(`/api/admin/alumni/${alumniId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          current_position: 'Senior Engineer',
          short_quote: 'Updated alumni quote.',
        }),
      })
    )
  }

  const createdAdvisor = (await step('POST /api/admin/advisors', () =>
    adminJson<JsonRecord>('/api/admin/advisors', {
      method: 'POST',
      body: JSON.stringify({
        name: `Smoke Advisor ${stamp}`,
        description: 'Testing advisor endpoint.',
        profile_image_path: null,
        is_archived: false,
        is_pinned: true,
        sort_order: 1,
      }),
    })
  )) as JsonRecord | null

  advisorId = typeof createdAdvisor?.id === 'string' ? createdAdvisor.id : ''

  await step('GET /api/admin/advisors', () =>
    adminJson('/api/admin/advisors', { method: 'GET' })
  )

  if (advisorId) {
    await step(`GET /api/admin/advisors/${advisorId}`, () =>
      adminJson(`/api/admin/advisors/${advisorId}`, { method: 'GET' })
    )

    await step(`PATCH /api/admin/advisors/${advisorId}`, () =>
      adminJson(`/api/admin/advisors/${advisorId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          description: 'Updated advisor description.',
        }),
      })
    )
  }

  const createdEvent = (await step('POST /api/admin/events', () =>
    adminJson<JsonRecord>('/api/admin/events', {
      method: 'POST',
      body: JSON.stringify({
        slug: eventSlug,
        title: `Smoke Event ${stamp}`,
        description: 'Testing event endpoint.',
        event_date: '2026-01-12',
        category: 'Testing',
        location_tags: ['Uttara', 'Dhaka University'],
        cover_image_path: null,
        is_archived: false,
        is_published: true,
        show_on_homepage: true,
        show_on_events_page: true,
        sort_order_homepage: 1,
        sort_order_events_page: 1,
      }),
    })
  )) as JsonRecord | null

  eventId = typeof createdEvent?.id === 'string' ? createdEvent.id : ''

  await step('GET /api/admin/events', () => adminJson('/api/admin/events', { method: 'GET' }))

  if (eventId) {
    await step(`GET /api/admin/events/${eventId}`, () =>
      adminJson(`/api/admin/events/${eventId}`, { method: 'GET' })
    )

    await step(`PATCH /api/admin/events/${eventId}`, () =>
      adminJson(`/api/admin/events/${eventId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          description: 'Updated event description.',
          show_on_homepage: true,
          show_on_events_page: true,
        }),
      })
    )

    const createdImage = (await step(`POST /api/admin/events/${eventId}/images`, () =>
      adminJson<JsonRecord>(`/api/admin/events/${eventId}/images`, {
        method: 'POST',
        body: JSON.stringify({
          image_path: `events/${stamp}/cover.jpg`,
          alt_text: 'Smoke image',
          sort_order: 1,
        }),
      })
    )) as JsonRecord | null

    eventImageId = typeof createdImage?.id === 'string' ? createdImage.id : ''

    await step(`GET /api/admin/events/${eventId}/images`, () =>
      adminJson(`/api/admin/events/${eventId}/images`, { method: 'GET' })
    )

    if (eventImageId) {
      await step(`PATCH /api/admin/events/${eventId}/images/${eventImageId}`, () =>
        adminJson(`/api/admin/events/${eventId}/images/${eventImageId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            alt_text: 'Updated smoke image',
            sort_order: 2,
          }),
        })
      )
    }

    const createdVideo = (await step(`POST /api/admin/events/${eventId}/videos`, () =>
      adminJson<JsonRecord>(`/api/admin/events/${eventId}/videos`, {
        method: 'POST',
        body: JSON.stringify({
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sort_order: 1,
        }),
      })
    )) as JsonRecord | null

    eventVideoId = typeof createdVideo?.id === 'string' ? createdVideo.id : ''

    await step(`GET /api/admin/events/${eventId}/videos`, () =>
      adminJson(`/api/admin/events/${eventId}/videos`, { method: 'GET' })
    )

    if (eventVideoId) {
      await step(`PATCH /api/admin/events/${eventId}/videos/${eventVideoId}`, () =>
        adminJson(`/api/admin/events/${eventId}/videos/${eventVideoId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            sort_order: 2,
          }),
        })
      )
    }
  }

  const createdMemberDirectory = (await step('POST /api/admin/member-directory', () =>
    adminJson<JsonRecord>('/api/admin/member-directory', {
      method: 'POST',
      body: JSON.stringify({
        name: `Smoke Directory ${stamp}`,
        session: '2023-24',
        department: 'English',
        blood_group: 'B+',
        profile_image_path: null,
      }),
    })
  )) as JsonRecord | null

  memberDirectoryId =
    typeof createdMemberDirectory?.id === 'string' ? createdMemberDirectory.id : ''

  await step('GET /api/admin/member-directory', () =>
    adminJson('/api/admin/member-directory', { method: 'GET' })
  )

  if (memberDirectoryId) {
    await step(`GET /api/admin/member-directory/${memberDirectoryId}`, () =>
      adminJson(`/api/admin/member-directory/${memberDirectoryId}`, {
        method: 'GET',
      })
    )

    await step(`PATCH /api/admin/member-directory/${memberDirectoryId}`, () =>
      adminJson(`/api/admin/member-directory/${memberDirectoryId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          department: 'Updated Department',
          blood_group: 'O+',
        }),
      })
    )
  }

  const createdGallery = (await step('POST /api/admin/gallery', () =>
    adminJson<JsonRecord>('/api/admin/gallery', {
      method: 'POST',
      body: JSON.stringify({
        title: `Smoke Gallery ${stamp}`,
        description: 'Testing gallery endpoint.',
        image_path: `gallery/${stamp}/item.jpg`,
        is_archived: false,
        is_pinned: true,
        sort_order: 1,
      }),
    })
  )) as JsonRecord | null

  galleryId = typeof createdGallery?.id === 'string' ? createdGallery.id : ''

  await step('GET /api/admin/gallery', () => adminJson('/api/admin/gallery', { method: 'GET' }))

  if (galleryId) {
    await step(`GET /api/admin/gallery/${galleryId}`, () =>
      adminJson(`/api/admin/gallery/${galleryId}`, { method: 'GET' })
    )

    await step(`PATCH /api/admin/gallery/${galleryId}`, () =>
      adminJson(`/api/admin/gallery/${galleryId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          description: 'Updated gallery description.',
        }),
      })
    )
  }

  // cleanup deletes so repeated testing stays manageable
  if (eventId && eventImageId) {
    await step(`DELETE /api/admin/events/${eventId}/images/${eventImageId}`, () =>
      adminJson(`/api/admin/events/${eventId}/images/${eventImageId}`, {
        method: 'DELETE',
      })
    )
  }

  if (eventId && eventVideoId) {
    await step(`DELETE /api/admin/events/${eventId}/videos/${eventVideoId}`, () =>
      adminJson(`/api/admin/events/${eventId}/videos/${eventVideoId}`, {
        method: 'DELETE',
      })
    )
  }

  if (galleryId) {
    await step(`DELETE /api/admin/gallery/${galleryId}`, () =>
      adminJson(`/api/admin/gallery/${galleryId}`, { method: 'DELETE' })
    )
  }

  if (memberDirectoryId) {
    await step(`DELETE /api/admin/member-directory/${memberDirectoryId}`, () =>
      adminJson(`/api/admin/member-directory/${memberDirectoryId}`, {
        method: 'DELETE',
      })
    )
  }

  if (advisorId) {
    await step(`DELETE /api/admin/advisors/${advisorId}`, () =>
      adminJson(`/api/admin/advisors/${advisorId}`, { method: 'DELETE' })
    )
  }

  if (alumniId) {
    await step(`DELETE /api/admin/alumni/${alumniId}`, () =>
      adminJson(`/api/admin/alumni/${alumniId}`, { method: 'DELETE' })
    )
  }

  if (committeeId && committeeMemberId) {
    await step(
      `DELETE /api/admin/committees/${committeeId}/members/${committeeMemberId}`,
      () =>
        adminJson(
          `/api/admin/committees/${committeeId}/members/${committeeMemberId}`,
          {
            method: 'DELETE',
          }
        )
    )
  }

  if (eventId) {
    await step(`DELETE /api/admin/events/${eventId}`, () =>
      adminJson(`/api/admin/events/${eventId}`, { method: 'DELETE' })
    )
  }

  if (committeeId) {
    await step(`DELETE /api/admin/committees/${committeeId}`, () =>
      adminJson(`/api/admin/committees/${committeeId}`, { method: 'DELETE' })
    )
  }

  return results
}