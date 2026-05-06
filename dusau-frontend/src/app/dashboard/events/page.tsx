'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { AdminButton, TextInput, TextareaInput } from '@/components/admin/form-fields';
import { StatusBadge } from '@/components/admin/status-badge';
import { adminJson } from '@/lib/admin/api';
import { moveItemById } from '@/lib/admin/reorder';

type EventItem = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  category: string;
  location_tags: string[];
  cover_image_path: string;
  is_archived: boolean;
  is_pinned: boolean;
  sort_order: number;
  pinned_sort_order: number;
};

type EventListResponse = {
  ok: boolean;
  events: EventItem[];
};

type EventCreateResponse = {
  ok: boolean;
  event: EventItem;
};

const emptyForm = {
  title: '',
  description: '',
  event_date: '',
  category: '',
  location_tags_text: '',
  cover_image_path: '',
  first_image_path: '',
  youtube_urls_text: '',
};

function parseCommaList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLineList(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const pinnedEvents = useMemo(
    () =>
      events
        .filter((event) => event.is_pinned && !event.is_archived)
        .sort((a, b) => (a.pinned_sort_order || 0) - (b.pinned_sort_order || 0)),
    [events],
  );

  async function loadEvents() {
    try {
      const data = await adminJson<EventListResponse>('/api/admin/events');
      setEvents(data.events || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load events.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const data = await adminJson<EventCreateResponse>('/api/admin/events', {
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
      });

      setForm(emptyForm);
      await loadEvents();
      setNotice(`Event created. Open it to manage images/videos. Event ID: ${data.event.id}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create event.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleArchive(eventItem: EventItem) {
    try {
      await adminJson(`/api/admin/events/${eventItem.id}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !eventItem.is_archived,
        }),
      });

      await loadEvents();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update archive status.');
    }
  }

  async function togglePin(eventItem: EventItem) {
    try {
      await adminJson(`/api/admin/events/${eventItem.id}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !eventItem.is_pinned,
        }),
      });

      await loadEvents();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update pin status.');
    }
  }

  async function saveNormalOrder(nextEvents: EventItem[]) {
    setEvents(nextEvents);

    try {
      const data = await adminJson<EventListResponse>('/api/admin/events/reorder', {
        method: 'PATCH',
        body: JSON.stringify({
          ids: nextEvents.map((eventItem) => eventItem.id),
        }),
      });

      setEvents(data.events || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder events.');
      await loadEvents();
    }
  }

  async function savePinnedOrder(nextPinnedEvents: EventItem[]) {
    try {
      const data = await adminJson<EventListResponse>('/api/admin/events/reorder-pinned', {
        method: 'PATCH',
        body: JSON.stringify({
          ids: nextPinnedEvents.map((eventItem) => eventItem.id),
        }),
      });

      setEvents(data.events || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder pinned events.');
      await loadEvents();
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-300">Loading events...</p>;
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          {notice}
        </div>
      )}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="mt-2 text-sm text-slate-400">
          Create events with a cover image and at least one event image. Open an event to manage
          metadata, images, videos, archive, pin, and ordering.
        </p>

        <form onSubmit={createEvent} className="mt-6 grid gap-5 md:grid-cols-2">
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
              onChange={(value) => setForm({ ...form, youtube_urls_text: value })}
            />
          </div>

          <div className="md:col-span-2">
            <AdminButton type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create event'}
            </AdminButton>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Pinned event order</h2>
            <p className="mt-1 text-sm text-slate-400">Maximum 10 events can be pinned.</p>
          </div>

          <StatusBadge tone="blue">{pinnedEvents.length}/10 pinned</StatusBadge>
        </div>

        <div className="mt-5 space-y-3">
          {pinnedEvents.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-400">
              No pinned events yet.
            </p>
          )}

          {pinnedEvents.map((eventItem, index) => (
            <div key={eventItem.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{eventItem.title}</p>
                <p className="mt-1 text-xs text-slate-500">{eventItem.event_date}</p>
              </div>

              <div className="flex gap-2">
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

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold">All events</h2>

        <div className="mt-5 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
          {events.length === 0 && <p className="p-4 text-sm text-slate-400">No events yet.</p>}

          {events.map((eventItem, index) => (
            <div key={eventItem.id} className="grid gap-4 p-4 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{eventItem.title}</h3>
                  {eventItem.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
                  {eventItem.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  {eventItem.event_date} • {eventItem.category}
                </p>
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
                  className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
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
          ))}
        </div>
      </section>
    </div>
  );
}