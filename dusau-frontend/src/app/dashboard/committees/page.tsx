'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/dashboard/AdminPageHeader'
import AdminEmptyState from '@/components/dashboard/AdminEmptyState'
import AdminStatusPill from '@/components/dashboard/AdminStatusPill'
import { adminJson } from '@/lib/frontend/admin-api'
import type { Committee } from '@/lib/frontend/admin-types'
import { normalizeArray } from '@/lib/frontend/normalize'

const initialForm = {
  from_year: 2025,
  to_year: 2026,
  summary: '',
  is_archived: false,
  is_pinned: false,
}

export default function DashboardCommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // async function loadCommittees() {
  //   try {
  //     const data = await adminJson<Committee[]>('/api/admin/committees')
  //     // setCommittees(data)
  //     setItems(normalizeArray<GalleryItem>(data, ['gallery', 'galleryItems']))
  //   } catch (error) {
  //     console.error('Failed to load committees', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }


  async function loadCommittees() {
  try {
    const data = await adminJson<unknown>('/api/admin/committees')
    setCommittees(
      normalizeArray<Committee>(data, ['committees', 'items', 'data'])
    )
  } catch (error) {
    console.error('Failed to load committees', error)
  } finally {
    setLoading(false)
  }
}


  useEffect(() => {
    void loadCommittees()
  }, [])

  async function handleCreate() {
    setSaving(true)
    try {
      await adminJson('/api/admin/committees', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setForm(initialForm)
      await loadCommittees()
    } catch (error) {
      console.error('Failed to create committee', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Committees"
        title="Create and manage yearly committees"
        description="Only one committee should stay pinned at a time. Open a committee to manage its members."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-strong p-8">
          <h2 className="font-display text-2xl font-semibold text-white">Create new committee</h2>
          <div className="mt-6 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <input type="number" value={form.from_year} onChange={(e) => setForm((p) => ({ ...p, from_year: Number(e.target.value) }))} placeholder="From year" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <input type="number" value={form.to_year} onChange={(e) => setForm((p) => ({ ...p, to_year: Number(e.target.value) }))} placeholder="To year" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            </div>
            <textarea rows={4} value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} placeholder="Committee summary" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.is_archived} onChange={(e) => setForm((p) => ({ ...p, is_archived: e.target.checked }))} /> Archived</label>
            <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm((p) => ({ ...p, is_pinned: e.target.checked }))} /> Pin this committee</label>
            <button type="button" className="btn-primary w-fit" onClick={handleCreate} disabled={saving}>
              {saving ? 'Creating committee...' : 'Create committee'}
            </button>
          </div>
        </div>

        <div className="grid gap-5">
          {loading ? <p className="text-slate-300">Loading committees...</p> : null}
          {!loading && committees.length === 0 ? (
            <AdminEmptyState title="No committees yet" description="Create your first committee from the left panel." />
          ) : null}

          {committees.map((committee) => (
            <div key={committee.id} className="glass p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Committee cycle</p>
                  <h3 className="font-display mt-3 text-2xl font-semibold text-white">{committee.from_year} - {committee.to_year}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{committee.summary || 'No summary provided yet.'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminStatusPill active={committee.is_pinned} activeText="Pinned" inactiveText="Not pinned" />
                  <AdminStatusPill active={committee.is_archived} activeText="Archived" inactiveText="Active" />
                </div>
              </div>
              <div className="mt-6">
                <Link href={`/dashboard/committees/${committee.id}`} className="btn-primary inline-flex">
                  Open committee
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}