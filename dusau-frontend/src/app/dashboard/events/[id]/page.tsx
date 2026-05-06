'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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

type EventImage = {
  id: string
  event_id: string
  image_path: string
  is_archived: boolean
  sort_order: number
}

type EventVideo = {
  id: string
  event_id: string
  youtube_url: string
  is_archived: boolean
  sort_order: number
}

type EventDetailsResponse = {
  ok: boolean
  event: EventItem
  images: EventImage[]
  videos: EventVideo[]
}

function parseCommaList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function LoadingState() {
  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-6 shadow-sm">
        <div className="h-7 w-56 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="mt-6 h-72 animate-pulse rounded-[1.5rem] bg-[hsl(var(--app-bg-soft))]" />
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

function ImageCard({
  image,
  index,
  images,
  onMoveUp,
  onMoveDown,
  onToggleArchive,
}: {
  image: EventImage
  index: number
  images: EventImage[]
  onMoveUp: () => void
  onMoveDown: () => void
  onToggleArchive: () => void
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white shadow-sm">
      <div className="relative h-56 bg-[hsl(var(--app-bg-soft))] sm:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={toMediaUrl(image.image_path)}
          alt={`Event image ${index + 1}`}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[hsl(var(--text-main))] shadow-sm backdrop-blur">
            Image {index + 1}
          </span>

          {image.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <p className="break-all text-xs font-semibold leading-6 text-[hsl(var(--text-muted))]">
          {image.image_path}
        </p>

        <div className="flex flex-wrap gap-2">
          <AdminButton
            variant="secondary"
            disabled={index === 0}
            onClick={onMoveUp}
          >
            Up
          </AdminButton>

          <AdminButton
            variant="secondary"
            disabled={index === images.length - 1}
            onClick={onMoveDown}
          >
            Down
          </AdminButton>

          <AdminButton
            variant={image.is_archived ? 'secondary' : 'danger'}
            onClick={onToggleArchive}
          >
            {image.is_archived ? 'Unarchive' : 'Archive'}
          </AdminButton>
        </div>
      </div>
    </div>
  )
}

function VideoCard({
  video,
  index,
  videos,
  editingVideoId,
  editingVideoUrl,
  setEditingVideoUrl,
  onMoveUp,
  onMoveDown,
  onStartEdit,
  onSaveUrl,
  onCancelEdit,
  onToggleArchive,
}: {
  video: EventVideo
  index: number
  videos: EventVideo[]
  editingVideoId: string | null
  editingVideoUrl: string
  setEditingVideoUrl: (value: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onStartEdit: () => void
  onSaveUrl: () => void
  onCancelEdit: () => void
  onToggleArchive: () => void
}) {
  const embedUrl = toYouTubeEmbedUrl(video.youtube_url)

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white shadow-sm">
      <div className="relative bg-[hsl(var(--app-bg-soft))]">
        {embedUrl ? (
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title={`Event video ${index + 1}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center p-5 text-center text-sm font-semibold text-[hsl(var(--text-muted))]">
            Invalid YouTube URL
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[hsl(var(--text-main))] shadow-sm backdrop-blur">
            Video {index + 1}
          </span>

          {video.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
        </div>
      </div>

      <div className="space-y-3 p-4">
        {editingVideoId === video.id ? (
          <input
            value={editingVideoUrl}
            onChange={(event) => setEditingVideoUrl(event.target.value)}
            className="w-full rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-sm font-semibold text-[hsl(var(--text-main))] outline-none transition focus:border-[hsl(var(--brand))] focus:bg-white"
          />
        ) : (
          <p className="break-all text-xs font-semibold leading-6 text-[hsl(var(--text-muted))]">
            {video.youtube_url}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <AdminButton
            variant="secondary"
            disabled={index === 0}
            onClick={onMoveUp}
          >
            Up
          </AdminButton>

          <AdminButton
            variant="secondary"
            disabled={index === videos.length - 1}
            onClick={onMoveDown}
          >
            Down
          </AdminButton>

          {editingVideoId === video.id ? (
            <>
              <AdminButton variant="secondary" onClick={onSaveUrl}>
                Save URL
              </AdminButton>

              <AdminButton variant="secondary" onClick={onCancelEdit}>
                Cancel
              </AdminButton>
            </>
          ) : (
            <AdminButton variant="secondary" onClick={onStartEdit}>
              Edit URL
            </AdminButton>
          )}

          <AdminButton
            variant={video.is_archived ? 'secondary' : 'danger'}
            onClick={onToggleArchive}
          >
            {video.is_archived ? 'Unarchive' : 'Archive'}
          </AdminButton>
        </div>
      </div>
    </div>
  )
}

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>()
  const eventId = params.id

  const [eventItem, setEventItem] = useState<EventItem | null>(null)
  const [images, setImages] = useState<EventImage[]>([])
  const [videos, setVideos] = useState<EventVideo[]>([])
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    category: '',
    location_tags_text: '',
    cover_image_path: '',
  })
  const [newImagePath, setNewImagePath] = useState('')
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('')
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null)
  const [editingVideoUrl, setEditingVideoUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingEvent, setSavingEvent] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const activeImages = useMemo(
    () => images.filter((image) => !image.is_archived),
    [images],
  )

  async function loadEvent() {
    try {
      const data = await adminJson<EventDetailsResponse>(`/api/admin/events/${eventId}`)
      setEventItem(data.event)
      setImages(data.images || [])
      setVideos(data.videos || [])
      setEventForm({
        title: data.event.title,
        description: data.event.description,
        event_date: data.event.event_date,
        category: data.event.category,
        location_tags_text: data.event.location_tags.join(', '),
        cover_image_path: data.event.cover_image_path,
      })
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load event.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  async function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSavingEvent(true)
    setNotice(null)

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
      })

      await loadEvent()
      setNotice('Event updated.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update event.')
    } finally {
      setSavingEvent(false)
    }
  }

  async function toggleEventArchive() {
    if (!eventItem) return

    try {
      await adminJson(`/api/admin/events/${eventId}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !eventItem.is_archived,
        }),
      })

      await loadEvent()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update archive status.')
    }
  }

  async function toggleEventPin() {
    if (!eventItem) return

    try {
      await adminJson(`/api/admin/events/${eventId}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !eventItem.is_pinned,
        }),
      })

      await loadEvent()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update pin status.')
    }
  }

  async function addImage() {
    if (!newImagePath) {
      setNotice('Upload/select an image first.')
      return
    }

    try {
      await adminJson(`/api/admin/events/${eventId}/images`, {
        method: 'POST',
        body: JSON.stringify({
          image_path: newImagePath,
        }),
      })

      setNewImagePath('')
      await loadEvent()
      setNotice('Image added.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not add image.')
    }
  }

  async function toggleImageArchive(image: EventImage) {
    try {
      await adminJson(`/api/admin/events/${eventId}/images/${image.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !image.is_archived,
        }),
      })

      await loadEvent()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update image archive status.')
    }
  }

  async function saveImageOrder(nextImages: EventImage[]) {
    setImages(nextImages)

    try {
      const data = await adminJson<{ ok: boolean; images: EventImage[] }>(
        `/api/admin/events/${eventId}/images/reorder`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            ids: nextImages.map((image) => image.id),
          }),
        },
      )

      setImages(data.images || [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder images.')
      await loadEvent()
    }
  }

  async function addVideo() {
    if (!newYoutubeUrl.trim()) {
      setNotice('YouTube URL is required.')
      return
    }

    try {
      await adminJson(`/api/admin/events/${eventId}/videos`, {
        method: 'POST',
        body: JSON.stringify({
          youtube_url: newYoutubeUrl.trim(),
        }),
      })

      setNewYoutubeUrl('')
      await loadEvent()
      setNotice('Video added.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not add video.')
    }
  }

  function startEditVideo(video: EventVideo) {
    setEditingVideoId(video.id)
    setEditingVideoUrl(video.youtube_url)
  }

  async function saveVideoUrl(video: EventVideo) {
    try {
      await adminJson(`/api/admin/events/${eventId}/videos/${video.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          youtube_url: editingVideoUrl,
        }),
      })

      setEditingVideoId(null)
      setEditingVideoUrl('')
      await loadEvent()
      setNotice('Video URL updated.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update video URL.')
    }
  }

  async function toggleVideoArchive(video: EventVideo) {
    try {
      await adminJson(`/api/admin/events/${eventId}/videos/${video.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !video.is_archived,
        }),
      })

      await loadEvent()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update video archive status.')
    }
  }

  async function saveVideoOrder(nextVideos: EventVideo[]) {
    setVideos(nextVideos)

    try {
      const data = await adminJson<{ ok: boolean; videos: EventVideo[] }>(
        `/api/admin/events/${eventId}/videos/reorder`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            ids: nextVideos.map((video) => video.id),
          }),
        },
      )

      setVideos(data.videos || [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder videos.')
      await loadEvent()
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (!eventItem) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-8 text-center shadow-xl">
        <h1 className="font-display text-3xl font-black text-[hsl(var(--text-main))]">
          Event not found
        </h1>

        <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
          This event may have been removed or the link may be incorrect.
        </p>

        <Link href="/dashboard/events" className="btn-secondary mt-6">
          Back to events
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white p-4 text-sm font-semibold leading-6 text-[hsl(var(--text-main))] shadow-sm">
          {notice}
        </div>
      )}

      <Link href="/dashboard/events" className="btn-secondary">
        ← Back to events
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl">
        <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[hsl(var(--text-main))] p-6 text-white sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/70">
              Event details
            </p>

            <h1 className="font-display mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {eventItem.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {eventItem.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
              {eventItem.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
              <StatusBadge tone="blue">{activeImages.length} active images</StatusBadge>
              <StatusBadge tone="blue">{videos.length} videos</StatusBadge>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
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

          <div className="bg-[hsl(var(--surface-soft))] p-4 sm:p-6">
            <div className="overflow-hidden rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white p-3 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={toMediaUrl(eventItem.cover_image_path)}
                alt={eventItem.title}
                className="h-64 w-full rounded-[1.1rem] object-cover sm:h-80"
              />
            </div>
          </div>
        </div>

        <form onSubmit={saveEvent} className="grid gap-5 p-6 sm:p-8 md:grid-cols-2">
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

          <div className="border-t border-[hsl(var(--border-soft))] pt-6 md:col-span-2">
            <AdminButton type="submit" disabled={savingEvent}>
              {savingEvent ? 'Saving...' : 'Save event metadata'}
            </AdminButton>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
              Event images
            </h2>

            <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
              Event must keep at least one active image. All uploaded event images are shown below.
            </p>
          </div>

          <StatusBadge tone="blue">{images.length} total images</StatusBadge>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <ImageUploadField
            label="Add new event image"
            value={newImagePath}
            onChange={setNewImagePath}
          />

          <AdminButton onClick={addImage}>Add image</AdminButton>
        </div>

        <div className="mt-6">
          {images.length === 0 ? (
            <EmptyState>No images yet.</EmptyState>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {images.map((image, index) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  images={images}
                  onMoveUp={() => saveImageOrder(moveItemById(images, image.id, 'up'))}
                  onMoveDown={() => saveImageOrder(moveItemById(images, image.id, 'down'))}
                  onToggleArchive={() => toggleImageArchive(image)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
              YouTube videos
            </h2>

            <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
              Every saved YouTube URL is shown as an embedded video preview.
            </p>
          </div>

          <StatusBadge tone="blue">{videos.length} videos</StatusBadge>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <TextInput
            label="New YouTube URL"
            value={newYoutubeUrl}
            onChange={setNewYoutubeUrl}
            placeholder="https://www.youtube.com/watch?v=..."
          />

          <AdminButton onClick={addVideo}>Add video</AdminButton>
        </div>

        <div className="mt-6">
          {videos.length === 0 ? (
            <EmptyState>No videos yet.</EmptyState>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {videos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={index}
                  videos={videos}
                  editingVideoId={editingVideoId}
                  editingVideoUrl={editingVideoUrl}
                  setEditingVideoUrl={setEditingVideoUrl}
                  onMoveUp={() => saveVideoOrder(moveItemById(videos, video.id, 'up'))}
                  onMoveDown={() => saveVideoOrder(moveItemById(videos, video.id, 'down'))}
                  onStartEdit={() => startEditVideo(video)}
                  onSaveUrl={() => saveVideoUrl(video)}
                  onCancelEdit={() => {
                    setEditingVideoId(null)
                    setEditingVideoUrl('')
                  }}
                  onToggleArchive={() => toggleVideoArchive(video)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}