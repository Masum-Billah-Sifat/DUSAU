'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { AdminButton, SessionSelect, TextInput, TextareaInput } from '@/components/admin/form-fields';
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
};

type CommitteeMember = {
  id: string;
  committee_id: string;
  name: string;
  profile_image_path: string;
  department: string;
  position: string;
  session: string;
  is_archived: boolean;
  is_pinned: boolean;
  sort_order: number;
  pinned_sort_order: number;
};

type CommitteeDetailsResponse = {
  ok: boolean;
  committee: Committee;
  members: CommitteeMember[];
};

type MemberResponse = {
  ok: boolean;
  member: CommitteeMember;
};

const emptyMemberForm = {
  name: '',
  profile_image_path: '',
  department: '',
  position: '',
  session: '',
};

export default function CommitteeDetailsPage() {
  const params = useParams<{ id: string }>();
  const committeeId = params.id;

  const [committee, setCommittee] = useState<Committee | null>(null);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [committeeForm, setCommitteeForm] = useState({
    from_year: '',
    to_year: '',
    summary: '',
  });
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingCommittee, setSavingCommittee] = useState(false);
  const [savingMember, setSavingMember] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const pinnedMembers = useMemo(
    () =>
      members
        .filter((member) => member.is_pinned && !member.is_archived)
        .sort((a, b) => (a.pinned_sort_order || 0) - (b.pinned_sort_order || 0)),
    [members],
  );

  async function loadCommittee() {
    try {
      const data = await adminJson<CommitteeDetailsResponse>(`/api/admin/committees/${committeeId}`);
      setCommittee(data.committee);
      setMembers(data.members || []);
      setCommitteeForm({
        from_year: data.committee.from_year,
        to_year: data.committee.to_year,
        summary: data.committee.summary,
      });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load committee.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCommittee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committeeId]);

  async function saveCommittee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingCommittee(true);
    setNotice(null);

    try {
      await adminJson(`/api/admin/committees/${committeeId}`, {
        method: 'PATCH',
        body: JSON.stringify(committeeForm),
      });

      await loadCommittee();
      setNotice('Committee updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update committee.');
    } finally {
      setSavingCommittee(false);
    }
  }

  async function toggleCommitteeArchive() {
    if (!committee) return;

    try {
      await adminJson(`/api/admin/committees/${committee.id}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !committee.is_archived,
        }),
      });

      await loadCommittee();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update archive status.');
    }
  }

  async function toggleCommitteePin() {
    if (!committee) return;

    try {
      await adminJson(`/api/admin/committees/${committee.id}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !committee.is_pinned,
        }),
      });

      await loadCommittee();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update pin status.');
    }
  }

  function startEditMember(member: CommitteeMember) {
    setEditingMemberId(member.id);
    setMemberForm({
      name: member.name,
      profile_image_path: member.profile_image_path,
      department: member.department,
      position: member.position,
      session: member.session,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetMemberForm() {
    setEditingMemberId(null);
    setMemberForm(emptyMemberForm);
  }

  async function saveMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingMember(true);
    setNotice(null);

    try {
      const url = editingMemberId
        ? `/api/admin/committees/${committeeId}/members/${editingMemberId}`
        : `/api/admin/committees/${committeeId}/members`;

      await adminJson<MemberResponse>(url, {
        method: editingMemberId ? 'PATCH' : 'POST',
        body: JSON.stringify(memberForm),
      });

      resetMemberForm();
      await loadCommittee();
      setNotice(editingMemberId ? 'Member updated.' : 'Member added.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save member.');
    } finally {
      setSavingMember(false);
    }
  }

  async function toggleMemberArchive(member: CommitteeMember) {
    try {
      await adminJson(`/api/admin/committees/${committeeId}/members/${member.id}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !member.is_archived,
        }),
      });

      await loadCommittee();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update member archive status.');
    }
  }

  async function toggleMemberPin(member: CommitteeMember) {
    try {
      await adminJson(`/api/admin/committees/${committeeId}/members/${member.id}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !member.is_pinned,
        }),
      });

      await loadCommittee();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update member pin status.');
    }
  }

  async function saveMemberOrder(nextMembers: CommitteeMember[]) {
    setMembers(nextMembers);

    try {
      const data = await adminJson<{ ok: boolean; members: CommitteeMember[] }>(
        `/api/admin/committees/${committeeId}/members/reorder`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            ids: nextMembers.map((member) => member.id),
          }),
        },
      );

      setMembers(data.members || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder members.');
      await loadCommittee();
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
      );

      setMembers(data.members || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not reorder pinned members.');
      await loadCommittee();
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-300">Loading committee...</p>;
  }

  if (!committee) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-200">Committee not found.</p>
        <Link href="/dashboard/committees" className="text-sm text-blue-300">
          Back to committees
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          {notice}
        </div>
      )}

      <div>
        <Link href="/dashboard/committees" className="text-sm text-blue-300">
          ← Back to committees
        </Link>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Committee: {committee.from_year} to {committee.to_year}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {committee.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
              {committee.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
              <StatusBadge tone="blue">{pinnedMembers.length}/10 pinned members</StatusBadge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
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

        <form onSubmit={saveCommittee} className="mt-6 grid gap-5 md:grid-cols-2">
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

          <div className="md:col-span-2">
            <AdminButton type="submit" disabled={savingCommittee}>
              {savingCommittee ? 'Saving...' : 'Save committee'}
            </AdminButton>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold">{editingMemberId ? 'Edit member' : 'Add member'}</h2>

        <form onSubmit={saveMember} className="mt-6 grid gap-5 md:grid-cols-2">
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

          <div className="flex gap-3 md:col-span-2">
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

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold">Pinned member order</h2>
        <p className="mt-1 text-sm text-slate-400">
          A pinned committee must keep at least one pinned active member.
        </p>

        <div className="mt-5 space-y-3">
          {pinnedMembers.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-400">
              No pinned members yet.
            </p>
          )}

          {pinnedMembers.map((member, index) => (
            <div key={member.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {member.position} • {member.session}
                </p>
              </div>

              <div className="flex gap-2">
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

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold">All members</h2>

        <div className="mt-5 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
          {members.length === 0 && (
            <p className="p-4 text-sm text-slate-400">No members yet.</p>
          )}

          {members.map((member, index) => (
            <div key={member.id} className="grid gap-4 p-4 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{member.name}</h3>
                  {member.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
                  {member.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  {member.position} • {member.department} • {member.session}
                </p>
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
          ))}
        </div>
      </section>
    </div>
  );
}