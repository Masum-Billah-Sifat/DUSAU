'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminPageHeader from '@/components/dashboard/AdminPageHeader'
import AdminFileUploadField from '@/components/dashboard/AdminFileUploadloadField'
import AdminStatusPill from '@/components/dashboard/AdminStatusPill'
import { adminJson } from '@/lib/frontend/admin-api'
import type { Committee, CommitteeMember } from '@/lib/frontend/admin-types'

const initialMemberForm = {
  name: '',
  profile_image_path: '',
  session: '',
  department: '',
  position: '',
  is_pinned: false,
  sort_order: 0,
}

export default function DashboardCommitteeDetailPage() {
  const params = useParams<{ id: string }>()
  const id = useMemo(() => String(params?.id ?? ''), [params])

  const [committee, setCommittee] = useState<Committee | null>(null)
  const [members, setMembers] = useState<CommitteeMember[]>([])
  const [memberForm, setMemberForm] = useState(initialMemberForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // async function load() {
  //   try {
  //     const [committeeData, memberData] = await Promise.all([
  //       adminJson<Committee>(`/api/admin/committees/${id}`),
  //       adminJson<CommitteeMember[]>(`/api/admin/committees/${id}/members`),
  //     ])

  //     setCommittee(committeeData)
  //     setMembers(memberData)
  //   } catch (error) {
  //     console.error('Failed to load committee detail', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }


  async function load() {
  try {
    const [committeeData, memberData] = await Promise.all([
      adminJson<Committee>(`/api/admin/committees/${id}`),
      adminJson<unknown>(`/api/admin/committees/${id}/members`),
    ])

    setCommittee(committeeData)
    setMembers(
      normalizeArray<CommitteeMember>(memberData, [
        'members',
        'committeeMembers',
        'items',
        'data',
      ])
    )
  } catch (error) {
    console.error('Failed to load committee detail', error)
  } finally {
    setLoading(false)
  }
}


  useEffect(() => {
    if (!id) return
    void load()
  }, [id])

  async function handleSaveCommittee() {
    if (!committee) return
    setSaving(true)
    try {
      const updated = await adminJson<Committee>(`/api/admin/committees/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(committee),
      })
      setCommittee(updated)
    } catch (error) {
      console.error('Failed to update committee', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddMember() {
    try {
      await adminJson(`/api/admin/committees/${id}/members`, {
        method: 'POST',
        body: JSON.stringify({
          ...memberForm,
          profile_image_path: memberForm.profile_image_path || null,
        }),
      })
      setMemberForm(initialMemberForm)
      await load()
    } catch (error) {
      console.error('Failed to add committee member', error)
    }
  }

  async function handleDeleteMember(memberId: string) {
    try {
      await adminJson(`/api/admin/committees/${id}/members/${memberId}`, { method: 'DELETE' })
      await load()
    } catch (error) {
      console.error('Failed to delete committee member', error)
    }
  }

  if (loading || !committee) {
    return <p className="text-slate-300">Loading committee detail...</p>
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Committee detail"
        title={`${committee.from_year} - ${committee.to_year}`}
        description="Edit committee metadata and manage pinned or unpinned committee members."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-strong p-8">
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <input type="number" value={committee.from_year} onChange={(e) => setCommittee((prev) => (prev ? { ...prev, from_year: Number(e.target.value) } : prev))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <input type="number" value={committee.to_year} onChange={(e) => setCommittee((prev) => (prev ? { ...prev, to_year: Number(e.target.value) } : prev))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            </div>
            <textarea rows={5} value={committee.summary || ''} onChange={(e) => setCommittee((prev) => (prev ? { ...prev, summary: e.target.value } : prev))} placeholder="Committee summary" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={committee.is_archived} onChange={(e) => setCommittee((prev) => (prev ? { ...prev, is_archived: e.target.checked } : prev))} /> Archived</label>
            <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={committee.is_pinned} onChange={(e) => setCommittee((prev) => (prev ? { ...prev, is_pinned: e.target.checked } : prev))} /> Pin this committee</label>
            <button type="button" className="btn-primary w-fit" onClick={handleSaveCommittee} disabled={saving}>{saving ? 'Saving...' : 'Save committee'}</button>
          </div>
        </div>

        <div className="glass p-6">
          <h2 className="font-display text-2xl font-semibold text-white">Add committee member</h2>
          <div className="mt-6 grid gap-5">
            <input value={memberForm.name} onChange={(e) => setMemberForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            <AdminFileUploadField label="Profile image" folder="committee-members" value={memberForm.profile_image_path} onChange={(value) => setMemberForm((p) => ({ ...p, profile_image_path: value }))} />
            <div className="grid gap-5 md:grid-cols-2">
              <input value={memberForm.session} onChange={(e) => setMemberForm((p) => ({ ...p, session: e.target.value }))} placeholder="Session" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <input value={memberForm.department} onChange={(e) => setMemberForm((p) => ({ ...p, department: e.target.value }))} placeholder="Department or institute" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <input value={memberForm.position} onChange={(e) => setMemberForm((p) => ({ ...p, position: e.target.value }))} placeholder="Position" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
              <input type="number" value={memberForm.sort_order} onChange={(e) => setMemberForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} placeholder="Sort order" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400/50" />
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={memberForm.is_pinned} onChange={(e) => setMemberForm((p) => ({ ...p, is_pinned: e.target.checked }))} /> Pin this member</label>
            <button type="button" className="btn-primary w-fit" onClick={handleAddMember}>Add member</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <div key={member.id} className="glass p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-white">{member.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{member.position}</p>
                <p className="mt-2 text-sm text-slate-400">{member.department} • {member.session}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <AdminStatusPill active={member.is_pinned} activeText="Pinned" inactiveText="Not pinned" />
              </div>
            </div>
            <button type="button" onClick={() => handleDeleteMember(member.id)} className="mt-5 text-sm text-red-300">Remove member</button>
          </div>
        ))}
      </div>
    </div>
  )
}