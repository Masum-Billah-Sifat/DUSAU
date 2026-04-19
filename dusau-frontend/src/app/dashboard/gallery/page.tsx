'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/dashboard/AdminPageHeader'
import AdminEmptyState from '@/components/dashboard/AdminEmptyState'
import AdminFileUploadField from '@/components/dashboard/AdminFileUploadloadField'
import AdminStatusPill from '@/components/dashboard/AdminStatusPill'
import { adminJson } from '@/lib/frontend/admin-api'
import type { GalleryItem } from '@/lib/frontend/admin-types'
import { normalizeArray } from '@/lib/frontend/normalize'

const initialForm = {
  title: '',
  description: '',
  image_path: '',
  is_archived: false,
  is_pinned: true,
  sort_order: 0,
}

export default function DashboardGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [form, setForm] = useState(initialForm)

  async function loadItems() {
    try {
      const data = await adminJson<GalleryItem[]>('/api/admin/gallery')
      // setItems(data)
      setItems(normalizeArray<GalleryItem>(data, ['gallery', 'galleryItems']))
    } catch (error) {
      console.error('Failed to load gallery', error)
    }
  }

  useEffect(() => {
    void loadItems()
  }, [])

  async function handleCreate() {
    try {
      await adminJson('/api/admin/gallery', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
        }),
      })
      setForm(initialForm)
      await loadItems()
    } catch (error) {
      console.error('Failed to create gallery item', error)
    }
  }

  async function handleDelete(id: string) {
    try {
      await adminJson(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      await loadItems()
    } catch (error) {
      console.error('Failed to delete gallery item', error)
    }
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Gallery"
        title="Manage gallery items"
        description="Upload and organize pinned gallery items for the public gallery section."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-strong p-8">
          <div className="grid gap-5">
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Gallery title" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <textarea rows={5} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <AdminFileUploadField label="Gallery image" folder="gallery" value={form.image_path} onChange={(value) => setForm((p) => ({ ...p, image_path: value }))} />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm((p) => ({ ...p, is_pinned: e.target.checked }))} /> Pinned</label>
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.is_archived} onChange={(e) => setForm((p) => ({ ...p, is_archived: e.target.checked }))} /> Archived</label>
            </div>
            <button type="button" className="btn-primary w-fit" onClick={handleCreate}>Create gallery item</button>
          </div>
        </div>

        <div className="grid gap-4">
          {items.length === 0 ? <AdminEmptyState title="No gallery items yet" description="Create a gallery item from the left form." /> : null}
          {items.map((item) => (
            <div key={item.id} className="glass p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                  <p className="mt-3 text-xs break-all text-slate-400">{item.image_path}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminStatusPill active={item.is_pinned} activeText="Pinned" inactiveText="Not pinned" />
                  <AdminStatusPill active={!item.is_archived} activeText="Active" inactiveText="Archived" />
                </div>
              </div>
              <button type="button" onClick={() => handleDelete(item.id)} className="mt-5 text-sm text-red-300">Delete gallery item</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}