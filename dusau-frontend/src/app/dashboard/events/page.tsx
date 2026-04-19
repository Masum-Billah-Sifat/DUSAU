'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/dashboard/AdminPageHeader'
import AdminEmptyState from '@/components/dashboard/AdminEmptyState'
import AdminFileUploadField from '@/components/dashboard/AdminFileUploadloadField'
import AdminStatusPill from '@/components/dashboard/AdminStatusPill'
import { adminJson } from '@/lib/frontend/admin-api'
import type { EventItem } from '@/lib/frontend/admin-types'
import { normalizeArray } from '@/lib/frontend/normalize'

const initialForm = {
  slug: '',
  title: '',
  description: '',
  event_date: '',
  category: '',
  location_tags: '',
  cover_image_path: '',
  is_archived: false,
  is_published: true,
  show_on_homepage: true,
  show_on_events_page: true,
  sort_order_homepage: 0,
  sort_order_events_page: 0,
}

export default function DashboardEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // async function loadEvents() {
  //   try {
  //     const data = await adminJson<EventItem[]>('/api/admin/events')
  //     setEvents(data)
  //   } catch (error) {
  //     console.error('Failed to load events', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  async function loadEvents() {
  try {
    const data = await adminJson<unknown>('/api/admin/events')
    setEvents(normalizeArray<EventItem>(data, ['events', 'items', 'data']))
  } catch (error) {
    console.error('Failed to load events', error)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    void loadEvents()
  }, [])

  async function handleCreate() {
    setSaving(true)
    try {
      await adminJson('/api/admin/events', {
        method: 'POST',
        body: JSON.stringify({
          slug: form.slug,
          title: form.title,
          description: form.description,
          event_date: form.event_date,
          category: form.category,
          location_tags: form.location_tags
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          cover_image_path: form.cover_image_path || null,
          is_archived: form.is_archived,
          is_published: form.is_published,
          show_on_homepage: form.show_on_homepage,
          show_on_events_page: form.show_on_events_page,
          sort_order_homepage: Number(form.sort_order_homepage),
          sort_order_events_page: Number(form.sort_order_events_page),
        }),
      })

      setForm(initialForm)
      await loadEvents()
    } catch (error) {
      console.error('Failed to create event', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Events"
        title="Create and manage events"
        description="Control event visibility for the homepage and the events page, then open each event to manage media and details."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-strong p-8">
          <h2 className="font-display text-2xl font-semibold text-white">Create new event</h2>
          <div className="mt-6 grid gap-5">
            <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="event-slug" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Event title" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <textarea rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Event description" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <div className="grid gap-5 md:grid-cols-2">
              <input type="date" value={form.event_date} onChange={(e) => setForm((p) => ({ ...p, event_date: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            </div>
            <input value={form.location_tags} onChange={(e) => setForm((p) => ({ ...p, location_tags: e.target.value }))} placeholder="Location tags, comma separated" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <AdminFileUploadField label="Cover image" folder="events" value={form.cover_image_path} onChange={(value) => setForm((p) => ({ ...p, cover_image_path: value }))} />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} /> Published</label>
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.is_archived} onChange={(e) => setForm((p) => ({ ...p, is_archived: e.target.checked }))} /> Archived</label>
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.show_on_homepage} onChange={(e) => setForm((p) => ({ ...p, show_on_homepage: e.target.checked }))} /> Show on homepage</label>
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.show_on_events_page} onChange={(e) => setForm((p) => ({ ...p, show_on_events_page: e.target.checked }))} /> Show on events page</label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <input type="number" value={form.sort_order_homepage} onChange={(e) => setForm((p) => ({ ...p, sort_order_homepage: Number(e.target.value) }))} placeholder="Homepage sort order" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <input type="number" value={form.sort_order_events_page} onChange={(e) => setForm((p) => ({ ...p, sort_order_events_page: Number(e.target.value) }))} placeholder="Events page sort order" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            </div>

            <button type="button" onClick={handleCreate} disabled={saving} className="btn-primary w-fit">
              {saving ? 'Creating event...' : 'Create event'}
            </button>
          </div>
        </div>

        <div className="grid gap-5">
          {loading ? <p className="text-slate-300">Loading events...</p> : null}
          {!loading && events.length === 0 ? (
            <AdminEmptyState title="No events yet" description="Create your first event from the form on the left." />
          ) : null}

          {events.map((event) => (
            <div key={event.id} className="glass p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{event.category}</p>
                  <h3 className="font-display mt-3 text-2xl font-semibold text-white">{event.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{event.description}</p>
                  <p className="mt-4 text-sm text-slate-400">{event.event_date}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminStatusPill active={event.is_published} activeText="Published" inactiveText="Draft" />
                  <AdminStatusPill active={event.show_on_homepage} activeText="Homepage" inactiveText="Not on homepage" />
                  <AdminStatusPill active={event.show_on_events_page} activeText="Events page" inactiveText="Hidden on page" />
                </div>
              </div>

              <div className="mt-6">
                <Link href={`/dashboard/events/${event.id}`} className="btn-primary inline-flex">
                  Open event detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}