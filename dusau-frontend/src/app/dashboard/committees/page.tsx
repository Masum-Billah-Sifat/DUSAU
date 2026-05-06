'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminButton, SessionSelect, TextareaInput } from '@/components/admin/form-fields';
import { StatusBadge } from '@/components/admin/status-badge';
import { adminJson } from '@/lib/admin/api';
import { moveItemById } from '@/lib/admin/reorder';

type Committee = {
  id: string;
  from_year: string;
  to_year: string;
  summary: string;
  is_archived: boolean;
  is_pinned: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type CommitteeListResponse = {
  ok: boolean;
  committees: Committee[];
};

type CommitteeResponse = {
  ok: boolean;
  committee: Committee;
};

const emptyForm = {
  from_year: '',
  to_year: '',
  summary: '',
};

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const pinnedCommittee = useMemo(
    () => committees.find((committee) => committee.is_pinned && !committee.is_archived),
    [committees],
  );

  async function loadCommittees() {
    try {
      const data = await adminJson<CommitteeListResponse>('/api/admin/committees');
      setCommittees(data.committees || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load committees.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCommittees();
  }, []);

  async function createCommittee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      await adminJson<CommitteeResponse>('/api/admin/committees', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setForm(emptyForm);
      await loadCommittees();
      setNotice('Committee created. Open it to add members.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create committee.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleArchive(committee: Committee) {
    try {
      await adminJson<CommitteeResponse>(`/api/admin/committees/${committee.id}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !committee.is_archived,
        }),
      });

      await loadCommittees();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update archive status.');
    }
  }

  async function togglePin(committee: Committee) {
    try {
      await adminJson<CommitteeResponse>(`/api/admin/committees/${committee.id}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !committee.is_pinned,
        }),
      });

      await loadCommittees();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update pin status.');
    }
  }

  async function saveOrder(nextCommittees: Committee[]) {
    setCommittees(nextCommittees);

    try {
      const data = await adminJson<CommitteeListResponse>('/api/admin/committees/reorder', {
        method: 'PATCH',
        body: JSON.stringify({
          ids: nextCommittees.map((committee) => committee.id),
        }),
      });

      setCommittees(data.committees || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder committees.');
      await loadCommittees();
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-300">Loading committees...</p>;
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          {notice}
        </div>
      )}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h1 className="text-2xl font-bold">Committees</h1>
        <p className="mt-2 text-sm text-slate-400">
          Create committees, manage archive/pin status, and reorder display order. Open a committee
          to edit metadata and manage members.
        </p>

        <form onSubmit={createCommittee} className="mt-6 grid gap-5 md:grid-cols-2">
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

          <div className="md:col-span-2">
            <AdminButton type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create committee'}
            </AdminButton>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Pinned committee</h2>
            <p className="mt-1 text-sm text-slate-400">
              Only one committee can be pinned at a time.
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
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold">All committees</h2>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <div className="divide-y divide-white/10">
            {committees.length === 0 && (
              <p className="p-4 text-sm text-slate-400">No committees yet.</p>
            )}

            {committees.map((committee, index) => (
              <div key={committee.id} className="grid gap-4 p-4 xl:grid-cols-[1fr_auto] xl:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {committee.from_year} to {committee.to_year}
                    </h3>

                    {committee.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
                    {committee.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{committee.summary}</p>
                  <p className="mt-2 break-all text-xs text-slate-500">ID: {committee.id}</p>
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
                    className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}