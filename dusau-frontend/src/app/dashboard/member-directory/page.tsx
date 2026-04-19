'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/dashboard/AdminPageHeader'
import AdminEmptyState from '@/components/dashboard/AdminEmptyState'
import AdminFileUploadField from '@/components/dashboard/AdminFileUploadloadField'
import { adminJson } from '@/lib/frontend/admin-api'
import type { MemberDirectoryItem } from '@/lib/frontend/admin-types'
import { normalizeArray } from '@/lib/frontend/normalize'

const initialForm = {
  name: '',
  session: '',
  department: '',
  blood_group: '',
  profile_image_path: '',
}

export default function DashboardMemberDirectoryPage() {
  const [items, setItems] = useState<MemberDirectoryItem[]>([])
  const [form, setForm] = useState(initialForm)

  // async function loadItems() {
  //   try {
  //     const data = await adminJson<MemberDirectoryItem[]>('/api/admin/member-directory')
  //     setItems(data)
  //     setItems(normalizeArray<GalleryItem>(data, ['gallery', 'galleryItems']))

  //   } catch (error) {
  //     console.error('Failed to load member directory', error)
  //   }
  // }


  async function loadItems() {
  try {
    const data = await adminJson<unknown>('/api/admin/member-directory')
    setItems(
      normalizeArray<MemberDirectoryItem>(data, [
        'members',
        'memberDirectory',
        'items',
        'data',
      ])
    )
  } catch (error) {
    console.error('Failed to load member directory', error)
  }
}


  useEffect(() => {
    void loadItems()
  }, [])

  async function handleCreate() {
    try {
      await adminJson('/api/admin/member-directory', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          blood_group: form.blood_group || null,
          profile_image_path: form.profile_image_path || null,
        }),
      })
      setForm(initialForm)
      await loadItems()
    } catch (error) {
      console.error('Failed to create member directory row', error)
    }
  }

  async function handleDelete(id: string) {
    try {
      await adminJson(`/api/admin/member-directory/${id}`, { method: 'DELETE' })
      await loadItems()
    } catch (error) {
      console.error('Failed to delete member directory row', error)
    }
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Member directory"
        title="Manage internal member records"
        description="This section is for backend management and is not meant for public display."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-strong p-8">
          <div className="grid gap-5">
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <div className="grid gap-5 md:grid-cols-2">
              <input value={form.session} onChange={(e) => setForm((p) => ({ ...p, session: e.target.value }))} placeholder="Session" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <input value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} placeholder="Department or institute" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            </div>
            <input value={form.blood_group} onChange={(e) => setForm((p) => ({ ...p, blood_group: e.target.value }))} placeholder="Blood group (optional)" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <AdminFileUploadField label="Profile image" folder="member-directory" value={form.profile_image_path} onChange={(value) => setForm((p) => ({ ...p, profile_image_path: value }))} />
            <button type="button" className="btn-primary w-fit" onClick={handleCreate}>Create member record</button>
          </div>
        </div>

        <div className="grid gap-4">
          {items.length === 0 ? <AdminEmptyState title="No members yet" description="Create a member record from the left form." /> : null}
          {items.map((item) => (
            <div key={item.id} className="glass p-6">
              <h3 className="font-display text-2xl font-semibold text-white">{item.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.department}</p>
              <p className="mt-2 text-sm text-slate-400">{item.session}{item.blood_group ? ` • ${item.blood_group}` : ''}</p>
              <button type="button" onClick={() => handleDelete(item.id)} className="mt-5 text-sm text-red-300">Delete record</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}