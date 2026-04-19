'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/dashboard/AdminPageHeader'
import AdminEmptyState from '@/components/dashboard/AdminEmptyState'
import AdminFileUploadField from '@/components/dashboard/AdminFileUploadloadField'
import AdminStatusPill from '@/components/dashboard/AdminStatusPill'
import { adminJson } from '@/lib/frontend/admin-api'
import type { Alumni } from '@/lib/frontend/admin-types'
import { normalizeArray } from '@/lib/frontend/normalize'

const initialForm = {
  name: '',
  profile_image_path: '',
  session: '',
  department: '',
  current_company: '',
  current_position: '',
  short_quote: '',
  latest_dusau_position: '',
  is_archived: false,
  is_pinned: true,
  sort_order: 0,
}

export default function DashboardAlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [form, setForm] = useState(initialForm)

  // async function loadAlumni() {
  //   try {
  //     const data = await adminJson<Alumni[]>('/api/admin/alumni')
  //     // setAlumni(data)
  //     setItems(normalizeArray<GalleryItem>(data, ['gallery', 'galleryItems']))
  //   } catch (error) {
  //     console.error('Failed to load alumni', error)
  //   }
  // }

  async function loadAlumni() {
  try {
    const data = await adminJson<unknown>('/api/admin/alumni')
    setAlumni(normalizeArray<Alumni>(data, ['alumni', 'items', 'data']))
  } catch (error) {
    console.error('Failed to load alumni', error)
  }
}



  useEffect(() => {
    void loadAlumni()
  }, [])

  async function handleCreate() {
    try {
      await adminJson('/api/admin/alumni', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          profile_image_path: form.profile_image_path || null,
          current_company: form.current_company || null,
          current_position: form.current_position || null,
          short_quote: form.short_quote || null,
          latest_dusau_position: form.latest_dusau_position || null,
        }),
      })
      setForm(initialForm)
      await loadAlumni()
    } catch (error) {
      console.error('Failed to create alumni', error)
    }
  }

  async function handleDelete(id: string) {
    try {
      await adminJson(`/api/admin/alumni/${id}`, { method: 'DELETE' })
      await loadAlumni()
    } catch (error) {
      console.error('Failed to delete alumni', error)
    }
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Alumni"
        title="Manage alumni visibility"
        description="Create pinned alumni entries that can be shown publicly on the website."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-strong p-8">
          <div className="grid gap-5">
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <AdminFileUploadField label="Profile image" folder="alumni" value={form.profile_image_path} onChange={(value) => setForm((p) => ({ ...p, profile_image_path: value }))} />
            <div className="grid gap-5 md:grid-cols-2">
              <input value={form.session} onChange={(e) => setForm((p) => ({ ...p, session: e.target.value }))} placeholder="Session" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <input value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} placeholder="Department" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <input value={form.current_company} onChange={(e) => setForm((p) => ({ ...p, current_company: e.target.value }))} placeholder="Current company" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <input value={form.current_position} onChange={(e) => setForm((p) => ({ ...p, current_position: e.target.value }))} placeholder="Current position" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            </div>
            <textarea rows={4} value={form.short_quote} onChange={(e) => setForm((p) => ({ ...p, short_quote: e.target.value }))} placeholder="Short quote" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <input value={form.latest_dusau_position} onChange={(e) => setForm((p) => ({ ...p, latest_dusau_position: e.target.value }))} placeholder="Latest DUSAU position" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm((p) => ({ ...p, is_pinned: e.target.checked }))} /> Pinned</label>
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.is_archived} onChange={(e) => setForm((p) => ({ ...p, is_archived: e.target.checked }))} /> Archived</label>
            </div>
            <button type="button" className="btn-primary w-fit" onClick={handleCreate}>Create alumni</button>
          </div>
        </div>

        <div className="grid gap-4">
          {alumni.length === 0 ? <AdminEmptyState title="No alumni yet" description="Create an alumni entry from the left form." /> : null}
          {alumni.map((item) => (
            <div key={item.id} className="glass p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-white">{item.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.current_position || 'No current position'}{item.current_company ? ` • ${item.current_company}` : ''}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.department} • {item.session}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminStatusPill active={item.is_pinned} activeText="Pinned" inactiveText="Not pinned" />
                  <AdminStatusPill active={!item.is_archived} activeText="Active" inactiveText="Archived" />
                </div>
              </div>
              {item.short_quote ? <p className="mt-4 text-sm italic text-slate-300">“{item.short_quote}”</p> : null}
              <button type="button" onClick={() => handleDelete(item.id)} className="mt-5 text-sm text-red-300">Delete alumni</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}