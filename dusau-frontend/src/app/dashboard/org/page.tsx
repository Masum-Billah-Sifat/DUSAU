'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/dashboard/AdminPageHeader'
import AdminFileUploadField from '@/components/dashboard/AdminFileUploadloadField'
import { adminJson } from '@/lib/frontend/admin-api'
import type { Organization } from '@/lib/frontend/admin-types'

const initialState: Organization = {
  id: 1,
  email: '',
  phone: '',
  cover_image_path: null,
  cover_title: '',
  cover_description: '',
}

export default function DashboardOrgPage() {
  const [form, setForm] = useState<Organization>(initialState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await adminJson<Organization>('/api/admin/org')
        if (active) setForm(data)
      } catch (error) {
        console.error('Failed to load organization data', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage('')

    try {
      const data = await adminJson<Organization>('/api/admin/org', {
        method: 'PATCH',
        body: JSON.stringify({
          email: form.email,
          phone: form.phone,
          cover_image_path: form.cover_image_path,
          cover_title: form.cover_title,
          cover_description: form.cover_description,
        }),
      })

      setForm(data)
      setMessage('Organization data updated successfully.')
    } catch (error) {
      console.error('Failed to update organization data', error)
      setMessage('Could not update organization data.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Organization"
        title="Edit public organization metadata"
        description="Update the public cover section details shown on the platform."
      />

      <div className="glass-strong p-8">
        {loading ? <p className="text-slate-300">Loading organization data...</p> : null}

        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Organization email</label>
            <input
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Organization phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50"
            />
          </div>

          <AdminFileUploadField
            label="Cover image"
            folder="org"
            value={form.cover_image_path ?? ''}
            onChange={(value) => setForm((prev) => ({ ...prev, cover_image_path: value }))}
          />

          <div>
            <label className="mb-2 block text-sm text-slate-300">Cover title</label>
            <input
              value={form.cover_title}
              onChange={(e) => setForm((prev) => ({ ...prev, cover_title: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Cover description</label>
            <textarea
              rows={5}
              value={form.cover_description}
              onChange={(e) => setForm((prev) => ({ ...prev, cover_description: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save organization data'}
            </button>
            {message ? <p className="text-sm text-slate-300">{message}</p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}