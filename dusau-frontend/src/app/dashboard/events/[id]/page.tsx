'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

type EventImage = {
  id: string;
  event_id: string;
  image_path: string;
  is_archived: boolean;
  sort_order: number;
};

type EventVideo = {
  id: string;
  event_id: string;
  youtube_url: string;
  is_archived: boolean;
  sort_order: number;
};

type EventDetailsResponse = {
  ok: boolean;
  event: EventItem;
  images: EventImage[];
  videos: EventVideo[];
};

function parseCommaList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;

  const [eventItem, setEventItem] = useState<EventItem | null>(null);
  const [images, setImages] = useState<EventImage[]>([]);
  const [videos, setVideos] = useState<EventVideo[]>([]);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    category: '',
    location_tags_text: '',
    cover_image_path: '',
  });
  const [newImagePath, setNewImagePath] = useState('');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingVideoUrl, setEditingVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingEvent, setSavingEvent] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const activeImages = useMemo(
    () => images.filter((image) => !image.is_archived),
    [images],
  );

  async function loadEvent() {
    try {
      const data = await adminJson<EventDetailsResponse>(`/api/admin/events/${eventId}`);
      setEventItem(data.event);
      setImages(data.images || []);
      setVideos(data.videos || []);
      setEventForm({
        title: data.event.title,
        description: data.event.description,
        event_date: data.event.event_date,
        category: data.event.category,
        location_tags_text: data.event.location_tags.join(', '),
        cover_image_path: data.event.cover_image_path,
      });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load event.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingEvent(true);
    setNotice(null);

    try {
      await adminJson(`/api/admin/events/${eventId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: eventForm.title,
          description: eventForm.description,
          event_date: eventForm.event_date,
          category: eventForm.category,
          location_tags: parseCommaList(eventForm.location_tags_text),
          cover_image_path: eventForm.cover_image_path,
        }),
      });

      await loadEvent();
      setNotice('Event updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update event.');
    } finally {
      setSavingEvent(false);
    }
  }

  async function toggleEventArchive() {
    if (!eventItem) return;

    try {
      await adminJson(`/api/admin/events/${eventId}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !eventItem.is_archived,
        }),
      });

      await loadEvent();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update archive status.');
    }
  }

  async function toggleEventPin() {
    if (!eventItem) return;

    try {
      await adminJson(`/api/admin/events/${eventId}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !eventItem.is_pinned,
        }),
      });

      await loadEvent();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update pin status.');
    }
  }

  async function addImage() {
    if (!newImagePath) {
      setNotice('Upload/select an image first.');
      return;
    }

    try {
      await adminJson(`/api/admin/events/${eventId}/images`, {
        method: 'POST',
        body: JSON.stringify({
          image_path: newImagePath,
        }),
      });

      setNewImagePath('');
      await loadEvent();
      setNotice('Image added.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not add image.');
    }
  }

  async function toggleImageArchive(image: EventImage) {
    try {
      await adminJson(`/api/admin/events/${eventId}/images/${image.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !image.is_archived,
        }),
      });

      await loadEvent();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update image archive status.');
    }
  }

  async function saveImageOrder(nextImages: EventImage[]) {
    setImages(nextImages);

    try {
      const data = await adminJson<{ ok: boolean; images: EventImage[] }>(
        `/api/admin/events/${eventId}/images/reorder`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            ids: nextImages.map((image) => image.id),
          }),
        },
      );

      setImages(data.images || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder images.');
      await loadEvent();
    }
  }

  async function addVideo() {
    if (!newYoutubeUrl.trim()) {
      setNotice('YouTube URL is required.');
      return;
    }

    try {
      await adminJson(`/api/admin/events/${eventId}/videos`, {
        method: 'POST',
        body: JSON.stringify({
          youtube_url: newYoutubeUrl.trim(),
        }),
      });

      setNewYoutubeUrl('');
      await loadEvent();
      setNotice('Video added.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not add video.');
    }
  }

  function startEditVideo(video: EventVideo) {
    setEditingVideoId(video.id);
    setEditingVideoUrl(video.youtube_url);
  }

  async function saveVideoUrl(video: EventVideo) {
    try {
      await adminJson(`/api/admin/events/${eventId}/videos/${video.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          youtube_url: editingVideoUrl,
        }),
      });

      setEditingVideoId(null);
      setEditingVideoUrl('');
      await loadEvent();
      setNotice('Video URL updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update video URL.');
    }
  }

  async function toggleVideoArchive(video: EventVideo) {
    try {
      await adminJson(`/api/admin/events/${eventId}/videos/${video.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !video.is_archived,
        }),
      });

      await loadEvent();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update video archive status.');
    }
  }

  async function saveVideoOrder(nextVideos: EventVideo[]) {
    setVideos(nextVideos);

    try {
      const data = await adminJson<{ ok: boolean; videos: EventVideo[] }>(
        `/api/admin/events/${eventId}/videos/reorder`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            ids: nextVideos.map((video) => video.id),
          }),
        },
      );

      setVideos(data.videos || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder videos.');
      await loadEvent();
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-300">Loading event...</p>;
  }

  if (!eventItem) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-200">Event not found.</p>
        <Link href="/dashboard/events" className="text-sm text-blue-300">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          {notice}
        </div>
      )}

      <div>
        <Link href="/dashboard/events" className="text-sm text-blue-300">
          ← Back to events
        </Link>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{eventItem.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {eventItem.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
              {eventItem.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
              <StatusBadge tone="blue">{activeImages.length} active images</StatusBadge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <AdminButton
              variant="secondary"
              disabled={eventItem.is_archived}
              onClick={toggleEventPin}
            >
              {eventItem.is_pinned ? 'Unpin event' : 'Pin event'}
            </AdminButton>

            <AdminButton
              variant={eventItem.is_archived ? 'secondary' : 'danger'}
              onClick={toggleEventArchive}
            >
              {eventItem.is_archived ? 'Unarchive event' : 'Archive event'}
            </AdminButton>
          </div>
        </div>

        <form onSubmit={saveEvent} className="mt-6 grid gap-5 md:grid-cols-2">
          <TextInput
            label="Title"
            value={eventForm.title}
            required
            onChange={(value) => setEventForm({ ...eventForm, title: value })}
          />

          <TextInput
            label="Category"
            value={eventForm.category}
            required
            onChange={(value) => setEventForm({ ...eventForm, category: value })}
          />

          <TextInput
            label="Event date"
            type="date"
            value={eventForm.event_date}
            required
            onChange={(value) => setEventForm({ ...eventForm, event_date: value })}
          />

          <TextInput
            label="Location tags, comma separated"
            value={eventForm.location_tags_text}
            required
            onChange={(value) => setEventForm({ ...eventForm, location_tags_text: value })}
          />

          <div className="md:col-span-2">
            <TextareaInput
              label="Description"
              value={eventForm.description}
              required
              rows={5}
              onChange={(value) => setEventForm({ ...eventForm, description: value })}
            />
          </div>

          <div className="md:col-span-2">
            <ImageUploadField
              label="Cover image"
              value={eventForm.cover_image_path}
              onChange={(value) => setEventForm({ ...eventForm, cover_image_path: value })}
            />
          </div>

          <div className="md:col-span-2">
            <AdminButton type="submit" disabled={savingEvent}>
              {savingEvent ? 'Saving...' : 'Save event metadata'}
            </AdminButton>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold">Event images</h2>
        <p className="mt-1 text-sm text-slate-400">
          Event must keep at least one active image.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <ImageUploadField
            label="Add new event image"
            value={newImagePath}
            onChange={setNewImagePath}
          />

          <AdminButton onClick={addImage}>Add image</AdminButton>
        </div>

        <div className="mt-5 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
          {images.length === 0 && <p className="p-4 text-sm text-slate-400">No images yet.</p>}

          {images.map((image, index) => (
            <div key={image.id} className="grid gap-4 p-4 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="break-all text-sm font-semibold">{image.image_path}</p>
                  {image.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <AdminButton
                  variant="secondary"
                  disabled={index === 0}
                  onClick={() => saveImageOrder(moveItemById(images, image.id, 'up'))}
                >
                  Up
                </AdminButton>

                <AdminButton
                  variant="secondary"
                  disabled={index === images.length - 1}
                  onClick={() => saveImageOrder(moveItemById(images, image.id, 'down'))}
                >
                  Down
                </AdminButton>

                <AdminButton
                  variant={image.is_archived ? 'secondary' : 'danger'}
                  onClick={() => toggleImageArchive(image)}
                >
                  {image.is_archived ? 'Unarchive' : 'Archive'}
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold">YouTube videos</h2>
        <p className="mt-1 text-sm text-slate-400">Videos are optional.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <TextInput
            label="New YouTube URL"
            value={newYoutubeUrl}
            onChange={setNewYoutubeUrl}
            placeholder="https://www.youtube.com/watch?v=..."
          />

          <AdminButton onClick={addVideo}>Add video</AdminButton>
        </div>

        <div className="mt-5 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
          {videos.length === 0 && <p className="p-4 text-sm text-slate-400">No videos yet.</p>}

          {videos.map((video, index) => (
            <div key={video.id} className="grid gap-4 p-4 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {editingVideoId === video.id ? (
                    <input
                      value={editingVideoUrl}
                      onChange={(event) => setEditingVideoUrl(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none"
                    />
                  ) : (
                    <p className="break-all text-sm font-semibold">{video.youtube_url}</p>
                  )}

                  {video.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <AdminButton
                  variant="secondary"
                  disabled={index === 0}
                  onClick={() => saveVideoOrder(moveItemById(videos, video.id, 'up'))}
                >
                  Up
                </AdminButton>

                <AdminButton
                  variant="secondary"
                  disabled={index === videos.length - 1}
                  onClick={() => saveVideoOrder(moveItemById(videos, video.id, 'down'))}
                >
                  Down
                </AdminButton>

                {editingVideoId === video.id ? (
                  <>
                    <AdminButton variant="secondary" onClick={() => saveVideoUrl(video)}>
                      Save URL
                    </AdminButton>

                    <AdminButton
                      variant="secondary"
                      onClick={() => {
                        setEditingVideoId(null);
                        setEditingVideoUrl('');
                      }}
                    >
                      Cancel
                    </AdminButton>
                  </>
                ) : (
                  <AdminButton variant="secondary" onClick={() => startEditVideo(video)}>
                    Edit URL
                  </AdminButton>
                )}

                <AdminButton
                  variant={video.is_archived ? 'secondary' : 'danger'}
                  onClick={() => toggleVideoArchive(video)}
                >
                  {video.is_archived ? 'Unarchive' : 'Archive'}
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}