'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { AdminButton, SessionSelect, TextInput, TextareaInput } from '@/components/admin/form-fields'
import { StatusBadge } from '@/components/admin/status-badge'
import { adminJson } from '@/lib/admin/api'
import { moveItemById } from '@/lib/admin/reorder'
import { toMediaUrl } from '@/lib/public/media'

type Committee = {
  id: string
  from_year: string
  to_year: string
  summary: string
  is_archived: boolean
  is_pinned: boolean
  sort_order: number
}

type CommitteeMember = {
  id: string
  committee_id: string
  name: string
  profile_image_path: string
  department: string
  position: string
  session: string
  is_archived: boolean
  is_pinned: boolean
  sort_order: number
  pinned_sort_order: number
}

type CommitteeDetailsResponse = {
  ok: boolean
  committee: Committee
  members: CommitteeMember[]
}

type MemberResponse = {
  ok: boolean
  member: CommitteeMember
}

const emptyMemberForm = {
  name: '',
  profile_image_path: '',
  department: '',
  position: '',
  session: '',
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

function MemberImage({ member }: { member: CommitteeMember }) {
  if (!member.profile_image_path) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--brand-soft))] text-sm font-black text-[hsl(var(--brand))]">
        {member.name.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--app-bg-soft))] shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={toMediaUrl(member.profile_image_path)}
        alt={member.name}
        className="h-full w-full object-cover"
      />
    </div>
  )
}

export default function CommitteeDetailsPage() {
  const params = useParams<{ id: string }>()
  const committeeId = params.id

  const [committee, setCommittee] = useState<Committee | null>(null)
  const [members, setMembers] = useState<CommitteeMember[]>([])
  const [committeeForm, setCommitteeForm] = useState({
    from_year: '',
    to_year: '',
    summary: '',
  })
  const [memberForm, setMemberForm] = useState(emptyMemberForm)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingCommittee, setSavingCommittee] = useState(false)
  const [savingMember, setSavingMember] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const pinnedMembers = useMemo(
    () =>
      members
        .filter((member) => member.is_pinned && !member.is_archived)
        .sort((a, b) => (a.pinned_sort_order || 0) - (b.pinned_sort_order || 0)),
    [members],
  )

  async function loadCommittee() {
    try {
      const data = await adminJson<CommitteeDetailsResponse>(`/api/admin/committees/${committeeId}`)
      setCommittee(data.committee)
      setMembers(data.members || [])
      setCommitteeForm({
        from_year: data.committee.from_year,
        to_year: data.committee.to_year,
        summary: data.committee.summary,
      })
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load committee.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommittee()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committeeId])

  async function saveCommittee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSavingCommittee(true)
    setNotice(null)

    try {
      await adminJson(`/api/admin/committees/${committeeId}`, {
        method: 'PATCH',
        body: JSON.stringify(committeeForm),
      })

      await loadCommittee()
      setNotice('Committee updated.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update committee.')
    } finally {
      setSavingCommittee(false)
    }
  }

  async function toggleCommitteeArchive() {
    if (!committee) return

    try {
      await adminJson(`/api/admin/committees/${committee.id}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !committee.is_archived,
        }),
      })

      await loadCommittee()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update archive status.')
    }
  }

  async function toggleCommitteePin() {
    if (!committee) return

    try {
      await adminJson(`/api/admin/committees/${committee.id}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !committee.is_pinned,
        }),
      })

      await loadCommittee()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update pin status.')
    }
  }

  function startEditMember(member: CommitteeMember) {
    setEditingMemberId(member.id)
    setMemberForm({
      name: member.name,
      profile_image_path: member.profile_image_path,
      department: member.department,
      position: member.position,
      session: member.session,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetMemberForm() {
    setEditingMemberId(null)
    setMemberForm(emptyMemberForm)
  }

  async function saveMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSavingMember(true)
    setNotice(null)

    try {
      const url = editingMemberId
        ? `/api/admin/committees/${committeeId}/members/${editingMemberId}`
        : `/api/admin/committees/${committeeId}/members`

      await adminJson<MemberResponse>(url, {
        method: editingMemberId ? 'PATCH' : 'POST',
        body: JSON.stringify(memberForm),
      })

      resetMemberForm()
      await loadCommittee()
      setNotice(editingMemberId ? 'Member updated.' : 'Member added.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save member.')
    } finally {
      setSavingMember(false)
    }
  }

  async function toggleMemberArchive(member: CommitteeMember) {
    try {
      await adminJson(`/api/admin/committees/${committeeId}/members/${member.id}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !member.is_archived,
        }),
      })

      await loadCommittee()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update member archive status.')
    }
  }

  async function toggleMemberPin(member: CommitteeMember) {
    try {
      await adminJson(`/api/admin/committees/${committeeId}/members/${member.id}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !member.is_pinned,
        }),
      })

      await loadCommittee()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update member pin status.')
    }
  }

  async function saveMemberOrder(nextMembers: CommitteeMember[]) {
    setMembers(nextMembers)

    try {
      const data = await adminJson<{ ok: boolean; members: CommitteeMember[] }>(
        `/api/admin/committees/${committeeId}/members/reorder`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            ids: nextMembers.map((member) => member.id),
          }),
        },
      )

      setMembers(data.members || [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder members.')
      await loadCommittee()
    }
  }

  async function savePinnedMemberOrder(nextPinnedMembers: CommitteeMember[]) {
    try {
      const data = await adminJson<{ ok: boolean; members: CommitteeMember[] }>(
        `/api/admin/committees/${committeeId}/members/reorder-pinned`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            ids: nextPinnedMembers.map((member) => member.id),
          }),
        },
      )

      setMembers(data.members || [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder pinned members.')
      await loadCommittee()
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (!committee) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-8 text-center shadow-xl">
        <h1 className="font-display text-3xl font-black text-[hsl(var(--text-main))]">
          Committee not found
        </h1>

        <p className="mt-3 text-sm leading-7 text-[hsl(var(--text-muted))]">
          This committee may have been removed or the link may be incorrect.
        </p>

        <Link href="/dashboard/committees" className="btn-secondary mt-6">
          Back to committees
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

      <Link href="/dashboard/committees" className="btn-secondary">
        ← Back to committees
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl">
        <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[hsl(var(--text-main))] p-6 text-white sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/70">
              Committee details
            </p>

            <h1 className="font-display mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {committee.from_year} to {committee.to_year}
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/75">
              {committee.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {committee.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
              {committee.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
              <StatusBadge tone="blue">{pinnedMembers.length}/10 pinned members</StatusBadge>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <AdminButton
                variant="secondary"
                disabled={committee.is_archived}
                onClick={toggleCommitteePin}
              >
                {committee.is_pinned ? 'Unpin committee' : 'Pin committee'}
              </AdminButton>

              <AdminButton
                variant={committee.is_archived ? 'secondary' : 'danger'}
                onClick={toggleCommitteeArchive}
              >
                {committee.is_archived ? 'Unarchive committee' : 'Archive committee'}
              </AdminButton>
            </div>
          </div>

          <form onSubmit={saveCommittee} className="grid gap-5 bg-white p-6 sm:p-8 md:grid-cols-2">
            <SessionSelect
              label="From year"
              value={committeeForm.from_year}
              required
              onChange={(value) => setCommitteeForm({ ...committeeForm, from_year: value })}
            />

            <SessionSelect
              label="To year"
              value={committeeForm.to_year}
              required
              onChange={(value) => setCommitteeForm({ ...committeeForm, to_year: value })}
            />

            <div className="md:col-span-2">
              <TextareaInput
                label="Summary"
                value={committeeForm.summary}
                required
                rows={5}
                onChange={(value) => setCommitteeForm({ ...committeeForm, summary: value })}
              />
            </div>

            <div className="border-t border-[hsl(var(--border-soft))] pt-6 md:col-span-2">
              <AdminButton type="submit" disabled={savingCommittee}>
                {savingCommittee ? 'Saving...' : 'Save committee'}
              </AdminButton>
            </div>
          </form>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl">
        <div className="border-b border-[hsl(var(--border-soft))] bg-[hsl(var(--brand-soft))] p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
            Members
          </p>

          <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-[hsl(var(--text-main))]">
            {editingMemberId ? 'Edit member' : 'Add member'}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[hsl(var(--text-muted))]">
            Add committee members with profile images, department, position, and session.
          </p>
        </div>

        <form onSubmit={saveMember} className="grid gap-5 p-6 sm:p-8 md:grid-cols-2">
          <TextInput
            label="Name"
            value={memberForm.name}
            required
            onChange={(value) => setMemberForm({ ...memberForm, name: value })}
          />

          <TextInput
            label="Department"
            value={memberForm.department}
            required
            onChange={(value) => setMemberForm({ ...memberForm, department: value })}
          />

          <TextInput
            label="Position"
            value={memberForm.position}
            required
            onChange={(value) => setMemberForm({ ...memberForm, position: value })}
          />

          <SessionSelect
            label="Session"
            value={memberForm.session}
            required
            onChange={(value) => setMemberForm({ ...memberForm, session: value })}
          />

          <div className="md:col-span-2">
            <ImageUploadField
              label="Profile image"
              value={memberForm.profile_image_path}
              onChange={(value) => setMemberForm({ ...memberForm, profile_image_path: value })}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-[hsl(var(--border-soft))] pt-6 sm:flex-row md:col-span-2">
            <AdminButton type="submit" disabled={savingMember}>
              {savingMember ? 'Saving...' : editingMemberId ? 'Update member' : 'Add member'}
            </AdminButton>

            {editingMemberId && (
              <AdminButton variant="secondary" onClick={resetMemberForm}>
                Cancel edit
              </AdminButton>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
              Pinned member order
            </h2>

            <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
              A pinned committee should keep at least one pinned active member.
            </p>
          </div>

          <StatusBadge tone="blue">{pinnedMembers.length}/10 pinned</StatusBadge>
        </div>

        <div className="mt-5 space-y-3">
          {pinnedMembers.length === 0 && <EmptyState>No pinned members yet.</EmptyState>}

          {pinnedMembers.map((member, index) => (
            <div
              key={member.id}
              className="flex flex-col gap-4 rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                <MemberImage member={member} />

                <div className="min-w-0">
                  <p className="font-display text-lg font-black text-[hsl(var(--text-main))]">
                    {member.name}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[hsl(var(--text-muted))]">
                    {member.position} • {member.session}
                  </p>

                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
                    Pinned position {index + 1}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <AdminButton
                  variant="secondary"
                  disabled={index === 0}
                  onClick={() => savePinnedMemberOrder(moveItemById(pinnedMembers, member.id, 'up'))}
                >
                  Up
                </AdminButton>

                <AdminButton
                  variant="secondary"
                  disabled={index === pinnedMembers.length - 1}
                  onClick={() => savePinnedMemberOrder(moveItemById(pinnedMembers, member.id, 'down'))}
                >
                  Down
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
          All members
        </h2>

        <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
          Edit, archive, pin, unpin, and reorder members. Profile images are shown beside each member.
        </p>

        <div className="mt-5 space-y-3">
          {members.length === 0 && <EmptyState>No members yet.</EmptyState>}

          {members.map((member, index) => (
            <div
              key={member.id}
              className="rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] p-4 transition hover:border-[hsl(var(--brand)_/_0.35)] hover:bg-white"
            >
              <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
                <div className="flex min-w-0 items-start gap-4">
                  <MemberImage member={member} />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-black text-[hsl(var(--text-main))]">
                        {member.name}
                      </h3>

                      {member.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
                      {member.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
                    </div>

                    <p className="mt-1 text-sm font-semibold text-[hsl(var(--text-muted))]">
                      {member.position} • {member.department} • {member.session}
                    </p>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
                      Display order {index + 1}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AdminButton
                    variant="secondary"
                    disabled={index === 0}
                    onClick={() => saveMemberOrder(moveItemById(members, member.id, 'up'))}
                  >
                    Up
                  </AdminButton>

                  <AdminButton
                    variant="secondary"
                    disabled={index === members.length - 1}
                    onClick={() => saveMemberOrder(moveItemById(members, member.id, 'down'))}
                  >
                    Down
                  </AdminButton>

                  <AdminButton variant="secondary" onClick={() => startEditMember(member)}>
                    Edit
                  </AdminButton>

                  <AdminButton
                    variant="secondary"
                    disabled={member.is_archived}
                    onClick={() => toggleMemberPin(member)}
                  >
                    {member.is_pinned ? 'Unpin' : 'Pin'}
                  </AdminButton>

                  <AdminButton
                    variant={member.is_archived ? 'secondary' : 'danger'}
                    onClick={() => toggleMemberArchive(member)}
                  >
                    {member.is_archived ? 'Unarchive' : 'Archive'}
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}