'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { AdminButton, TextInput, TextareaInput } from '@/components/admin/form-fields'
import { StatusBadge } from '@/components/admin/status-badge'
import { adminJson } from '@/lib/admin/api'
import { moveItemById } from '@/lib/admin/reorder'
import { toMediaUrl, toYouTubeEmbedUrl } from '@/lib/public/media'

type EventItem = {
  id: string
  title: string
  description: string
  event_date: string
  category: string
  location_tags: string[]
  cover_image_path: string
  is_archived: boolean
  is_pinned: boolean
  sort_order: number
  pinned_sort_order: number
}

type EventListResponse = {
  ok: boolean
  events: EventItem[]
}

type EventCreateResponse = {
  ok: boolean
  event: EventItem
}

const emptyForm = {
  title: '',
  description: '',
  event_date: '',
  category: '',
  location_tags_text: '',
  cover_image_path: '',
  first_image_path: '',
  youtube_urls_text: '',
}

function parseCommaList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseLineList(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function LoadingState() {
  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-6 shadow-sm">
        <div className="h-7 w-44 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="mt-6 h-64 animate-pulse rounded-[1.5rem] bg-[hsl(var(--app-bg-soft))]" />
      </div>
    </div>
  )
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[hsl(var(--border-strong))] bg-white/80 p-6 text-center">
      <p className="text-sm font-semibold leading-7 text-[hsl(var(--text-muted))]">
        {children}
      </p>
    </div>
  )
}

function EventCoverThumb({ eventItem }: { eventItem: EventItem }) {
  if (!eventItem.cover_image_path) {
    return (
      <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--brand-soft))] text-xs font-black text-[hsl(var(--brand))] sm:h-24 sm:w-32">
        Event
      </div>
    )
  }

  return (
    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--app-bg-soft))] shadow-sm sm:h-24 sm:w-32">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={toMediaUrl(eventItem.cover_image_path)}
        alt={eventItem.title}
        className="h-full w-full object-cover"
      />
    </div>
  )
}

function YouTubePreviewGrid({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null

  return (
    <div className="md:col-span-2">
      <p className="mb-3 text-sm font-bold text-[hsl(var(--text-main))]">
        YouTube preview
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {urls.map((url, index) => {
          const embedUrl = toYouTubeEmbedUrl(url)

          return (
            <div
              key={`${url}-${index}`}
              className="overflow-hidden rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white p-3 shadow-sm"
            >
              {embedUrl ? (
                <div className="aspect-video overflow-hidden rounded-[1.1rem] bg-[hsl(var(--app-bg-soft))]">
                  <iframe
                    src={embedUrl}
                    title={`YouTube preview ${index + 1}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-[1.1rem] bg-[hsl(var(--app-bg-soft))] p-4 text-center text-sm font-semibold text-[hsl(var(--text-muted))]">
                  Invalid YouTube URL
                </div>
              )}

              <p className="mt-3 break-all text-xs font-semibold leading-6 text-[hsl(var(--text-muted))]">
                {url}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const pinnedEvents = useMemo(
    () =>
      events
        .filter((event) => event.is_pinned && !event.is_archived)
        .sort((a, b) => (a.pinned_sort_order || 0) - (b.pinned_sort_order || 0)),
    [events],
  )

  const youtubePreviewUrls = useMemo(
    () => parseLineList(form.youtube_urls_text),
    [form.youtube_urls_text],
  )

  async function loadEvents() {
    try {
      const data = await adminJson<EventListResponse>('/api/admin/events')
      setEvents(data.events || [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)

    try {
      await adminJson<EventCreateResponse>('/api/admin/events', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          event_date: form.event_date,
          category: form.category,
          location_tags: parseCommaList(form.location_tags_text),
          cover_image_path: form.cover_image_path,
          image_paths: [form.first_image_path].filter(Boolean),
          youtube_urls: parseLineList(form.youtube_urls_text),
        }),
      })

      setForm(emptyForm)
      await loadEvents()
      setNotice('Event created. Open it to manage images and videos.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create event.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleArchive(eventItem: EventItem) {
    try {
      await adminJson(`/api/admin/events/${eventItem.id}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !eventItem.is_archived,
        }),
      })

      await loadEvents()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update archive status.')
    }
  }

  async function togglePin(eventItem: EventItem) {
    try {
      await adminJson(`/api/admin/events/${eventItem.id}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !eventItem.is_pinned,
        }),
      })

      await loadEvents()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update pin status.')
    }
  }

  async function saveNormalOrder(nextEvents: EventItem[]) {
    setEvents(nextEvents)

    try {
      const data = await adminJson<EventListResponse>('/api/admin/events/reorder', {
        method: 'PATCH',
        body: JSON.stringify({
          ids: nextEvents.map((eventItem) => eventItem.id),
        }),
      })

      setEvents(data.events || [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder events.')
      await loadEvents()
    }
  }

  async function savePinnedOrder(nextPinnedEvents: EventItem[]) {
    try {
      const data = await adminJson<EventListResponse>('/api/admin/events/reorder-pinned', {
        method: 'PATCH',
        body: JSON.stringify({
          ids: nextPinnedEvents.map((eventItem) => eventItem.id),
        }),
      })

      setEvents(data.events || [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder pinned events.')
      await loadEvents()
    }
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white p-4 text-sm font-semibold leading-6 text-[hsl(var(--text-main))] shadow-sm">
          {notice}
        </div>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl">
        <div className="border-b border-[hsl(var(--border-soft))] bg-[hsl(var(--brand-soft))] p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
            Public events
          </p>

          <h1 className="font-display mt-2 text-3xl font-black tracking-tight text-[hsl(var(--text-main))]">
            Events
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[hsl(var(--text-muted))]">
            Create events with a cover image, event gallery image, and optional YouTube videos.
            Open an event later to manage all images, videos, archive, pin, and ordering.
          </p>
        </div>

        <form onSubmit={createEvent} className="grid gap-5 p-6 sm:p-8 md:grid-cols-2">
          <TextInput
            label="Title"
            value={form.title}
            required
            onChange={(value) => setForm({ ...form, title: value })}
          />

          <TextInput
            label="Category"
            value={form.category}
            required
            onChange={(value) => setForm({ ...form, category: value })}
          />

          <TextInput
            label="Event date"
            type="date"
            value={form.event_date}
            required
            onChange={(value) => setForm({ ...form, event_date: value })}
          />

          <TextInput
            label="Location tags, comma separated"
            value={form.location_tags_text}
            required
            placeholder="Dhaka, DU, Seminar Hall"
            onChange={(value) => setForm({ ...form, location_tags_text: value })}
          />

          <div className="md:col-span-2">
            <TextareaInput
              label="Description"
              value={form.description}
              required
              rows={5}
              onChange={(value) => setForm({ ...form, description: value })}
            />
          </div>

          <div className="md:col-span-2">
            <ImageUploadField
              label="Cover image"
              value={form.cover_image_path}
              onChange={(value) => setForm({ ...form, cover_image_path: value })}
            />
          </div>

          <div className="md:col-span-2">
            <ImageUploadField
              label="First event image"
              value={form.first_image_path}
              onChange={(value) => setForm({ ...form, first_image_path: value })}
            />
          </div>

          <div className="md:col-span-2">
            <TextareaInput
              label="YouTube URLs, one per line"
              value={form.youtube_urls_text}
              rows={3}
              placeholder="https://www.youtube.com/watch?v=..."
              onChange={(value) => setForm({ ...form, youtube_urls_text: value })}
            />
          </div>

          <YouTubePreviewGrid urls={youtubePreviewUrls} />

          <div className="border-t border-[hsl(var(--border-soft))] pt-6 md:col-span-2">
            <AdminButton type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create event'}
            </AdminButton>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
              Pinned event order
            </h2>

            <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
              Maximum 10 events can be pinned on the public website.
            </p>
          </div>

          <StatusBadge tone="blue">{pinnedEvents.length}/10 pinned</StatusBadge>
        </div>

        <div className="mt-5 space-y-3">
          {pinnedEvents.length === 0 && <EmptyState>No pinned events yet.</EmptyState>}

          {pinnedEvents.map((eventItem, index) => (
            <div
              key={eventItem.id}
              className="flex flex-col gap-4 rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                <EventCoverThumb eventItem={eventItem} />

                <div className="min-w-0">
                  <p className="font-display text-lg font-black text-[hsl(var(--text-main))]">
                    {eventItem.title}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[hsl(var(--text-muted))]">
                    {eventItem.event_date} • Position {index + 1}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <AdminButton
                  variant="secondary"
                  disabled={index === 0}
                  onClick={() => savePinnedOrder(moveItemById(pinnedEvents, eventItem.id, 'up'))}
                >
                  Up
                </AdminButton>

                <AdminButton
                  variant="secondary"
                  disabled={index === pinnedEvents.length - 1}
                  onClick={() => savePinnedOrder(moveItemById(pinnedEvents, eventItem.id, 'down'))}
                >
                  Down
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
          All events
        </h2>

        <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
          Open an event to manage all images and embedded YouTube videos.
        </p>

        <div className="mt-5 space-y-3">
          {events.length === 0 && <EmptyState>No events yet.</EmptyState>}

          {events.map((eventItem, index) => (
            <div
              key={eventItem.id}
              className="rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] p-4 transition hover:border-[hsl(var(--brand)_/_0.35)] hover:bg-white"
            >
              <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
                <div className="flex min-w-0 items-start gap-4">
                  <EventCoverThumb eventItem={eventItem} />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-black text-[hsl(var(--text-main))]">
                        {eventItem.title}
                      </h3>

                      {eventItem.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
                      {eventItem.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
                    </div>

                    <p className="mt-1 text-sm font-semibold text-[hsl(var(--text-muted))]">
                      {eventItem.event_date} • {eventItem.category} • Display order {index + 1}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {eventItem.location_tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[hsl(var(--text-muted))]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AdminButton
                    variant="secondary"
                    disabled={index === 0}
                    onClick={() => saveNormalOrder(moveItemById(events, eventItem.id, 'up'))}
                  >
                    Up
                  </AdminButton>

                  <AdminButton
                    variant="secondary"
                    disabled={index === events.length - 1}
                    onClick={() => saveNormalOrder(moveItemById(events, eventItem.id, 'down'))}
                  >
                    Down
                  </AdminButton>

                  <Link
                    href={`/dashboard/events/${eventItem.id}`}
                    className="inline-flex w-full items-center justify-center rounded-full border border-[hsl(var(--border-soft))] bg-white px-5 py-3 text-sm font-black text-[hsl(var(--text-main))] shadow-sm transition hover:bg-[hsl(var(--brand-soft))] sm:w-fit"
                  >
                    Open
                  </Link>

                  <AdminButton
                    variant="secondary"
                    disabled={eventItem.is_archived}
                    onClick={() => togglePin(eventItem)}
                  >
                    {eventItem.is_pinned ? 'Unpin' : 'Pin'}
                  </AdminButton>

                  <AdminButton
                    variant={eventItem.is_archived ? 'secondary' : 'danger'}
                    onClick={() => toggleArchive(eventItem)}
                  >
                    {eventItem.is_archived ? 'Unarchive' : 'Archive'}
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}