'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AdminButton, SessionSelect, TextareaInput } from '@/components/admin/form-fields'
import { StatusBadge } from '@/components/admin/status-badge'
import { adminJson } from '@/lib/admin/api'
import { moveItemById } from '@/lib/admin/reorder'

type Committee = {
  id: string
  from_year: string
  to_year: string
  summary: string
  is_archived: boolean
  is_pinned: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

type CommitteeListResponse = {
  ok: boolean
  committees: Committee[]
}

type CommitteeResponse = {
  ok: boolean
  committee: Committee
}

const emptyForm = {
  from_year: '',
  to_year: '',
  summary: '',
}

function LoadingState() {
  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-6 shadow-sm">
        <div className="h-7 w-52 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="mt-6 h-56 animate-pulse rounded-[1.5rem] bg-[hsl(var(--app-bg-soft))]" />
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

function CommitteeAvatar({ committee }: { committee: Committee }) {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--brand-soft))] text-sm font-black text-[hsl(var(--brand))] shadow-sm ring-1 ring-[hsl(var(--brand)_/_0.14)]">
      {committee.from_year.slice(-2)}–{committee.to_year.slice(-2)}
    </div>
  )
}

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const pinnedCommittee = useMemo(
    () => committees.find((committee) => committee.is_pinned && !committee.is_archived),
    [committees],
  )

  async function loadCommittees() {
    try {
      const data = await adminJson<CommitteeListResponse>('/api/admin/committees')
      setCommittees(data.committees || [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load committees.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommittees()
  }, [])

  async function createCommittee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)

    try {
      await adminJson<CommitteeResponse>('/api/admin/committees', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      setForm(emptyForm)
      await loadCommittees()
      setNotice('Committee created. Open it to add members.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create committee.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleArchive(committee: Committee) {
    try {
      await adminJson<CommitteeResponse>(`/api/admin/committees/${committee.id}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !committee.is_archived,
        }),
      })

      await loadCommittees()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update archive status.')
    }
  }

  async function togglePin(committee: Committee) {
    try {
      await adminJson<CommitteeResponse>(`/api/admin/committees/${committee.id}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !committee.is_pinned,
        }),
      })

      await loadCommittees()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update pin status.')
    }
  }

  async function saveOrder(nextCommittees: Committee[]) {
    setCommittees(nextCommittees)

    try {
      const data = await adminJson<CommitteeListResponse>('/api/admin/committees/reorder', {
        method: 'PATCH',
        body: JSON.stringify({
          ids: nextCommittees.map((committee) => committee.id),
        }),
      })

      setCommittees(data.committees || [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder committees.')
      await loadCommittees()
    }
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white p-4 text-sm font-semibold leading-6 text-[hsl(var(--text-main))] shadow-sm">
          {notice}
        </div>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl">
        <div className="border-b border-[hsl(var(--border-soft))] bg-[hsl(var(--brand-soft))] p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
            Leadership years
          </p>

          <h1 className="font-display mt-2 text-3xl font-black tracking-tight text-[hsl(var(--text-main))]">
            Committees
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[hsl(var(--text-muted))]">
            Create yearly committees, manage archive and pin status, reorder display order,
            and open a committee to manage its members.
          </p>
        </div>

        <form onSubmit={createCommittee} className="grid gap-5 p-6 sm:p-8 md:grid-cols-2">
          <SessionSelect
            label="From year"
            value={form.from_year}
            required
            onChange={(value) => setForm({ ...form, from_year: value })}
          />

          <SessionSelect
            label="To year"
            value={form.to_year}
            required
            onChange={(value) => setForm({ ...form, to_year: value })}
          />

          <div className="md:col-span-2">
            <TextareaInput
              label="Summary"
              value={form.summary}
              required
              rows={5}
              onChange={(value) => setForm({ ...form, summary: value })}
            />
          </div>

          <div className="border-t border-[hsl(var(--border-soft))] pt-6 md:col-span-2">
            <AdminButton type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create committee'}
            </AdminButton>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
              Pinned committee
            </h2>

            <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
              Only one active committee can be pinned for the public website.
            </p>
          </div>

          {pinnedCommittee ? (
            <StatusBadge tone="green">
              {pinnedCommittee.from_year} to {pinnedCommittee.to_year}
            </StatusBadge>
          ) : (
            <StatusBadge tone="yellow">No pinned committee</StatusBadge>
          )}
        </div>

        {pinnedCommittee && (
          <div className="mt-5 flex flex-col gap-4 rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] p-4 sm:flex-row sm:items-center">
            <CommitteeAvatar committee={pinnedCommittee} />

            <div>
              <p className="font-display text-lg font-black text-[hsl(var(--text-main))]">
                {pinnedCommittee.from_year} to {pinnedCommittee.to_year}
              </p>

              <p className="mt-1 line-clamp-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
                {pinnedCommittee.summary}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
          All committees
        </h2>

        <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
          Open a committee to add members, upload profile images, and control pinned member order.
        </p>

        <div className="mt-5 space-y-3">
          {committees.length === 0 && <EmptyState>No committees yet.</EmptyState>}

          {committees.map((committee, index) => (
            <div
              key={committee.id}
              className="rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] p-4 transition hover:border-[hsl(var(--brand)_/_0.35)] hover:bg-white"
            >
              <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
                <div className="flex min-w-0 items-start gap-4">
                  <CommitteeAvatar committee={committee} />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-black text-[hsl(var(--text-main))]">
                        {committee.from_year} to {committee.to_year}
                      </h3>

                      {committee.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
                      {committee.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
                      {committee.summary}
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
                    onClick={() => saveOrder(moveItemById(committees, committee.id, 'up'))}
                  >
                    Up
                  </AdminButton>

                  <AdminButton
                    variant="secondary"
                    disabled={index === committees.length - 1}
                    onClick={() => saveOrder(moveItemById(committees, committee.id, 'down'))}
                  >
                    Down
                  </AdminButton>

                  <Link
                    href={`/dashboard/committees/${committee.id}`}
                    className="inline-flex w-full items-center justify-center rounded-full border border-[hsl(var(--border-soft))] bg-white px-5 py-3 text-sm font-black text-[hsl(var(--text-main))] shadow-sm transition hover:bg-[hsl(var(--brand-soft))] sm:w-fit"
                  >
                    Open
                  </Link>

                  <AdminButton
                    variant="secondary"
                    disabled={committee.is_archived}
                    onClick={() => togglePin(committee)}
                  >
                    {committee.is_pinned ? 'Unpin' : 'Pin'}
                  </AdminButton>

                  <AdminButton
                    variant={committee.is_archived ? 'secondary' : 'danger'}
                    onClick={() => toggleArchive(committee)}
                  >
                    {committee.is_archived ? 'Unarchive' : 'Archive'}
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