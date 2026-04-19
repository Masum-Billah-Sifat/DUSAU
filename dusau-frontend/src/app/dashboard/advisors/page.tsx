'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/dashboard/AdminPageHeader'
import AdminEmptyState from '@/components/dashboard/AdminEmptyState'
import AdminFileUploadField from '@/components/dashboard/AdminFileUploadloadField'
import AdminStatusPill from '@/components/dashboard/AdminStatusPill'
import { adminJson } from '@/lib/frontend/admin-api'
import type { Advisor } from '@/lib/frontend/admin-types'
import { normalizeArray } from '@/lib/frontend/normalize'

const initialForm = {
  name: '',
  description: '',
  profile_image_path: '',
  is_archived: false,
  is_pinned: true,
  sort_order: 0,
}

export default function DashboardAdvisorsPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [form, setForm] = useState(initialForm)

  // async function loadAdvisors() {
  //   try {
  //     const data = await adminJson<Advisor[]>('/api/admin/advisors')
  //     // setAdvisors(data)
  //     setItems(normalizeArray<GalleryItem>(data, ['gallery', 'galleryItems']))

  //   } catch (error) {
  //     console.error('Failed to load advisors', error)
  //   }
  // }

  async function loadAdvisors() {
  try {
    const data = await adminJson<unknown>('/api/admin/advisors')
    setAdvisors(normalizeArray<Advisor>(data, ['advisors', 'items', 'data']))
  } catch (error) {
    console.error('Failed to load advisors', error)
  }
}


  useEffect(() => {
    void loadAdvisors()
  }, [])

  async function handleCreate() {
    try {
      await adminJson('/api/admin/advisors', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          profile_image_path: form.profile_image_path || null,
        }),
      })
      setForm(initialForm)
      await loadAdvisors()
    } catch (error) {
      console.error('Failed to create advisor', error)
    }
  }

  async function handleDelete(id: string) {
    try {
      await adminJson(`/api/admin/advisors/${id}`, { method: 'DELETE' })
      await loadAdvisors()
    } catch (error) {
      console.error('Failed to delete advisor', error)
    }
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Advisors"
        title="Manage advisor profiles"
        description="Create advisor entries and control whether they appear publicly."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-strong p-8">
          <div className="grid gap-5">
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Advisor name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <textarea rows={5} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <AdminFileUploadField label="Profile image" folder="advisors" value={form.profile_image_path} onChange={(value) => setForm((p) => ({ ...p, profile_image_path: value }))} />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm((p) => ({ ...p, is_pinned: e.target.checked }))} /> Pinned</label>
              <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.is_archived} onChange={(e) => setForm((p) => ({ ...p, is_archived: e.target.checked }))} /> Archived</label>
            </div>
            <button type="button" className="btn-primary w-fit" onClick={handleCreate}>Create advisor</button>
          </div>
        </div>

        <div className="grid gap-4">
          {advisors.length === 0 ? <AdminEmptyState title="No advisors yet" description="Create an advisor profile from the left form." /> : null}
          {advisors.map((item) => (
            <div key={item.id} className="glass p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-white">{item.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminStatusPill active={item.is_pinned} activeText="Pinned" inactiveText="Not pinned" />
                  <AdminStatusPill active={!item.is_archived} activeText="Active" inactiveText="Archived" />
                </div>
              </div>
              <button type="button" onClick={() => handleDelete(item.id)} className="mt-5 text-sm text-red-300">Delete advisor</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}