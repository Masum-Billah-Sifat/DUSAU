'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminPageHeader from '@/components/dashboard/AdminPageHeader'
import AdminFileUploadField from '@/components/dashboard/AdminFileUploadloadField'
import { adminJson } from '@/lib/frontend/admin-api'
import type { EventImage, EventItem, EventVideo } from '@/lib/frontend/admin-types'

export default function DashboardEventDetailPage() {
  const params = useParams<{ id: string }>()
  const id = useMemo(() => String(params?.id ?? ''), [params])

  const [event, setEvent] = useState<EventItem | null>(null)
  const [images, setImages] = useState<EventImage[]>([])
  const [videos, setVideos] = useState<EventVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newImagePath, setNewImagePath] = useState('')
  const [newImageAlt, setNewImageAlt] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')

  // async function load() {
  //   try {
  //     const [eventData, imageData, videoData] = await Promise.all([
  //       adminJson<EventItem>(`/api/admin/events/${id}`),
  //       adminJson<EventImage[]>(`/api/admin/events/${id}/images`),
  //       adminJson<EventVideo[]>(`/api/admin/events/${id}/videos`),
  //     ])

  //     setEvent(eventData)
  //     setImages(imageData)
  //     setVideos(videoData)
  //   } catch (error) {
  //     console.error('Failed to load event detail', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }



  async function load() {
  try {
    const [eventData, imageData, videoData] = await Promise.all([
      adminJson<EventItem>(`/api/admin/events/${id}`),
      adminJson<unknown>(`/api/admin/events/${id}/images`),
      adminJson<unknown>(`/api/admin/events/${id}/videos`),
    ])

    setEvent(eventData)
    setImages(normalizeArray<EventImage>(imageData, ['images', 'eventImages', 'items', 'data']))
    setVideos(normalizeArray<EventVideo>(videoData, ['videos', 'eventVideos', 'items', 'data']))
  } catch (error) {
    console.error('Failed to load event detail', error)
  } finally {
    setLoading(false)
  }
}


  useEffect(() => {
    if (!id) return
    void load()
  }, [id])

  async function handleSaveEvent() {
    if (!event) return
    setSaving(true)
    try {
      const updated = await adminJson<EventItem>(`/api/admin/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(event),
      })
      setEvent(updated)
    } catch (error) {
      console.error('Failed to update event', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddImage() {
    try {
      await adminJson(`/api/admin/events/${id}/images`, {
        method: 'POST',
        body: JSON.stringify({
          image_path: newImagePath,
          alt_text: newImageAlt || null,
          sort_order: images.length + 1,
        }),
      })
      setNewImagePath('')
      setNewImageAlt('')
      await load()
    } catch (error) {
      console.error('Failed to add image', error)
    }
  }

  async function handleDeleteImage(imageId: string) {
    try {
      await adminJson(`/api/admin/events/${id}/images/${imageId}`, { method: 'DELETE' })
      await load()
    } catch (error) {
      console.error('Failed to delete image', error)
    }
  }

  async function handleAddVideo() {
    try {
      await adminJson(`/api/admin/events/${id}/videos`, {
        method: 'POST',
        body: JSON.stringify({
          youtube_url: newVideoUrl,
          sort_order: videos.length + 1,
        }),
      })
      setNewVideoUrl('')
      await load()
    } catch (error) {
      console.error('Failed to add video', error)
    }
  }

  async function handleDeleteVideo(videoId: string) {
    try {
      await adminJson(`/api/admin/events/${id}/videos/${videoId}`, { method: 'DELETE' })
      await load()
    } catch (error) {
      console.error('Failed to delete video', error)
    }
  }

  if (loading || !event) {
    return <p className="text-slate-300">Loading event detail...</p>
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Event detail"
        title={event.title}
        description="Edit event metadata, image gallery, and video links."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-strong p-8">
          <div className="grid gap-5">
            <input value={event.slug} onChange={(e) => setEvent((prev) => (prev ? { ...prev, slug: e.target.value } : prev))} placeholder="Slug" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <input value={event.title} onChange={(e) => setEvent((prev) => (prev ? { ...prev, title: e.target.value } : prev))} placeholder="Title" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <textarea rows={4} value={event.description} onChange={(e) => setEvent((prev) => (prev ? { ...prev, description: e.target.value } : prev))} placeholder="Description" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <div className="grid gap-5 md:grid-cols-2">
              <input type="date" value={event.event_date} onChange={(e) => setEvent((prev) => (prev ? { ...prev, event_date: e.target.value } : prev))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <input value={event.category} onChange={(e) => setEvent((prev) => (prev ? { ...prev, category: e.target.value } : prev))} placeholder="Category" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            </div>
            {/* <input value={event.location_tags.join(', ')} onChange={(e) => setEvent((prev) => (prev ? { ...prev, location_tags: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) } : prev))} placeholder="Locations, comma separated" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" /> */}
           
           <input
  value={Array.isArray(event.location_tags) ? event.location_tags.join(', ') : ''}
  onChange={(e) =>
    setEvent((prev) =>
      prev
        ? {
            ...prev,
            location_tags: e.target.value
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean),
          }
        : prev
    )
  }
  placeholder="Locations, comma separated"
  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50"
/>

            <AdminFileUploadField label="Cover image" folder="events" value={event.cover_image_path ?? ''} onChange={(value) => setEvent((prev) => (prev ? { ...prev, cover_image_path: value } : prev))} />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={event.is_published} onChange={(e) => setEvent((prev) => (prev ? { ...prev, is_published: e.target.checked } : prev))} /> Published</label>
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={event.is_archived} onChange={(e) => setEvent((prev) => (prev ? { ...prev, is_archived: e.target.checked } : prev))} /> Archived</label>
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={event.show_on_homepage} onChange={(e) => setEvent((prev) => (prev ? { ...prev, show_on_homepage: e.target.checked } : prev))} /> Show on homepage</label>
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={event.show_on_events_page} onChange={(e) => setEvent((prev) => (prev ? { ...prev, show_on_events_page: e.target.checked } : prev))} /> Show on events page</label>
            </div>
            <button type="button" onClick={handleSaveEvent} disabled={saving} className="btn-primary w-fit">
              {saving ? 'Saving event...' : 'Save event'}
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="glass p-6">
            <h2 className="font-display text-xl font-semibold text-white">Gallery images</h2>
            <div className="mt-5 grid gap-4">
              <AdminFileUploadField label="Add image" folder="events" value={newImagePath} onChange={setNewImagePath} />
              <input value={newImageAlt} onChange={(e) => setNewImageAlt(e.target.value)} placeholder="Alt text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <button type="button" className="btn-primary w-fit" onClick={handleAddImage}>Add image</button>
            </div>
            <div className="mt-6 grid gap-3">
              {images.map((image) => (
                <div key={image.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300 break-all">{image.image_path}</p>
                  <p className="mt-2 text-xs text-slate-400">{image.alt_text || 'No alt text'}</p>
                  <button type="button" onClick={() => handleDeleteImage(image.id)} className="mt-3 text-sm text-red-300">Delete image</button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6">
            <h2 className="font-display text-xl font-semibold text-white">Video links</h2>
            <div className="mt-5 grid gap-4">
              <input value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="YouTube URL" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <button type="button" className="btn-primary w-fit" onClick={handleAddVideo}>Add video</button>
            </div>
            <div className="mt-6 grid gap-3">
              {videos.map((video) => (
                <div key={video.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300 break-all">{video.youtube_url}</p>
                  <button type="button" onClick={() => handleDeleteVideo(video.id)} className="mt-3 text-sm text-red-300">Delete video</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}