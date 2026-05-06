import { NextRequest } from 'next/server';
import { ensureAdmin } from './admin';
import { badRequest, created, notFound, ok, serverError } from './http';
import { supabaseAdmin } from './supabase';
import {
  DUSAU_SESSION_YEARS,
  assertRecord,
  parseJsonBody,
  requireBoolean,
  requireIdArray,
  requireSessionYear,
  requireString,
} from './validators';

type ParamsWithCommitteeId = {
  params: {
    id: string;
  };
};

type ParamsWithMemberId = {
  params: {
    id: string;
    memberId: string;
  };
};

const COMMITTEE_SELECT = '*';
const MEMBER_SELECT = '*';
const MAX_PINNED_MEMBERS_PER_COMMITTEE = 10;

function getSessionIndex(session: string) {
  return DUSAU_SESSION_YEARS.findIndex((item) => item === session);
}

function pickCommitteePayload(body: Record<string, unknown>) {
  const from_year = requireSessionYear(body, 'from_year');
  const to_year = requireSessionYear(body, 'to_year');

  if (getSessionIndex(from_year) > getSessionIndex(to_year)) {
    throw new Error('from_year cannot be after to_year.');
  }

  return {
    from_year,
    to_year,
    summary: requireString(body, 'summary'),
  };
}

function pickCommitteeMemberPayload(body: Record<string, unknown>) {
  return {
    name: requireString(body, 'name'),
    profile_image_path: requireString(body, 'profile_image_path'),
    department: requireString(body, 'department'),
    position: requireString(body, 'position'),
    session: requireSessionYear(body, 'session'),
  };
}

async function getHighestSortOrder(table: string, filters?: Record<string, string>) {
  let query = supabaseAdmin
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data?.[0]?.sort_order as number | undefined) ?? 0) + 1;
}

async function getHighestPinnedSortOrder(committeeId: string) {
  const { data, error } = await supabaseAdmin
    .from('committee_members')
    .select('pinned_sort_order')
    .eq('committee_id', committeeId)
    .eq('is_pinned', true)
    .order('pinned_sort_order', { ascending: false })
    .limit(1);

  if (error) throw error;

  return ((data?.[0]?.pinned_sort_order as number | undefined) ?? 0) + 1;
}

async function getCommittee(id: string) {
  const { data, error } = await supabaseAdmin
    .from('committees')
    .select(COMMITTEE_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function getMember(committeeId: string, memberId: string) {
  const { data, error } = await supabaseAdmin
    .from('committee_members')
    .select(MEMBER_SELECT)
    .eq('committee_id', committeeId)
    .eq('id', memberId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function countPinnedActiveMembers(committeeId: string) {
  const { count, error } = await supabaseAdmin
    .from('committee_members')
    .select('id', { count: 'exact', head: true })
    .eq('committee_id', committeeId)
    .eq('is_archived', false)
    .eq('is_pinned', true);

  if (error) throw error;

  return count ?? 0;
}

async function getCommitteeMembers(committeeId: string) {
  const { data, error } = await supabaseAdmin
    .from('committee_members')
    .select(MEMBER_SELECT)
    .eq('committee_id', committeeId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

async function getCommittees() {
  const { data, error } = await supabaseAdmin
    .from('committees')
    .select(COMMITTEE_SELECT)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

async function reorderRows(
  table: string,
  ids: string[],
  sortColumn: 'sort_order' | 'pinned_sort_order',
  filters?: Record<string, string | boolean>,
) {
  for (let index = 0; index < ids.length; index += 1) {
    let query = supabaseAdmin
      .from(table)
      .update({
        [sortColumn]: index + 1,
      })
      .eq('id', ids[index]);

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }
    }

    const { error } = await query;
    if (error) throw error;
  }
}

export function makeCommitteeRootHandlers() {
  async function GET() {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const committees = await getCommittees();

      return ok({
        ok: true,
        committees,
      });
    } catch (error) {
      return serverError(error);
    }
  }

  async function POST(request: NextRequest) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const payload = pickCommitteePayload(body);
      const sort_order = await getHighestSortOrder('committees');

      const { data, error } = await supabaseAdmin
        .from('committees')
        .insert({
          ...payload,
          sort_order,
        })
        .select(COMMITTEE_SELECT)
        .single();

      if (error) throw error;

      return created({
        ok: true,
        committee: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not create committee.');
    }
  }

  return { GET, POST };
}

export function makeCommitteeItemHandlers() {
  async function GET(_request: NextRequest, { params }: ParamsWithCommitteeId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const committee = await getCommittee(params.id);
      if (!committee) return notFound('Committee not found.');

      const members = await getCommitteeMembers(params.id);

      return ok({
        ok: true,
        committee,
        members,
      });
    } catch (error) {
      return serverError(error);
    }
  }

  async function PATCH(request: NextRequest, { params }: ParamsWithCommitteeId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const payload = pickCommitteePayload(body);

      const { data, error } = await supabaseAdmin
        .from('committees')
        .update(payload)
        .eq('id', params.id)
        .select(COMMITTEE_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Committee not found.');

      return ok({
        ok: true,
        committee: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update committee.');
    }
  }

  return { GET, PATCH };
}

export function makeCommitteeArchiveHandler() {
  async function PATCH(request: NextRequest, { params }: ParamsWithCommitteeId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const is_archived = requireBoolean(body, 'is_archived');

      const updatePayload: Record<string, unknown> = {
        is_archived,
      };

      if (is_archived) {
        updatePayload.is_pinned = false;
      }

      const { data, error } = await supabaseAdmin
        .from('committees')
        .update(updatePayload)
        .eq('id', params.id)
        .select(COMMITTEE_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Committee not found.');

      return ok({
        ok: true,
        committee: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update archive status.');
    }
  }

  return { PATCH };
}

export function makeCommitteePinHandler() {
  async function PATCH(request: NextRequest, { params }: ParamsWithCommitteeId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const is_pinned = requireBoolean(body, 'is_pinned');

      const committee = await getCommittee(params.id);
      if (!committee) return notFound('Committee not found.');

      if ((committee as { is_archived?: boolean }).is_archived) {
        return badRequest('Archived committee cannot be pinned.', 'ARCHIVED_COMMITTEE_CANNOT_BE_PINNED');
      }

      if (is_pinned) {
        const pinnedMembersCount = await countPinnedActiveMembers(params.id);

        if (pinnedMembersCount < 1) {
          return badRequest(
            'Committee must have at least one pinned active member before it can be pinned.',
            'PINNED_MEMBER_REQUIRED',
          );
        }

        const { error: unpinError } = await supabaseAdmin
          .from('committees')
          .update({ is_pinned: false })
          .eq('is_pinned', true);

        if (unpinError) throw unpinError;
      }

      const { data, error } = await supabaseAdmin
        .from('committees')
        .update({
          is_pinned,
        })
        .eq('id', params.id)
        .select(COMMITTEE_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Committee not found.');

      return ok({
        ok: true,
        committee: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update pin status.');
    }
  }

  return { PATCH };
}

export function makeCommitteeReorderHandler() {
  async function PATCH(request: NextRequest) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const ids = requireIdArray(body);

      await reorderRows('committees', ids, 'sort_order');

      const committees = await getCommittees();

      return ok({
        ok: true,
        committees,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not reorder committees.');
    }
  }

  return { PATCH };
}

export function makeCommitteeMembersRootHandlers() {
  async function GET(_request: NextRequest, { params }: ParamsWithCommitteeId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const committee = await getCommittee(params.id);
      if (!committee) return notFound('Committee not found.');

      const members = await getCommitteeMembers(params.id);

      return ok({
        ok: true,
        members,
      });
    } catch (error) {
      return serverError(error);
    }
  }

  async function POST(request: NextRequest, { params }: ParamsWithCommitteeId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const committee = await getCommittee(params.id);
      if (!committee) return notFound('Committee not found.');

      const body = assertRecord(await parseJsonBody(request));
      const payload = pickCommitteeMemberPayload(body);
      const sort_order = await getHighestSortOrder('committee_members', {
        committee_id: params.id,
      });

      const { data, error } = await supabaseAdmin
        .from('committee_members')
        .insert({
          committee_id: params.id,
          ...payload,
          sort_order,
        })
        .select(MEMBER_SELECT)
        .single();

      if (error) throw error;

      return created({
        ok: true,
        member: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not create committee member.');
    }
  }

  return { GET, POST };
}

export function makeCommitteeMemberItemHandlers() {
  async function GET(_request: NextRequest, { params }: ParamsWithMemberId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const member = await getMember(params.id, params.memberId);
      if (!member) return notFound('Committee member not found.');

      return ok({
        ok: true,
        member,
      });
    } catch (error) {
      return serverError(error);
    }
  }

  async function PATCH(request: NextRequest, { params }: ParamsWithMemberId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const member = await getMember(params.id, params.memberId);
      if (!member) return notFound('Committee member not found.');

      const body = assertRecord(await parseJsonBody(request));
      const payload = pickCommitteeMemberPayload(body);

      const { data, error } = await supabaseAdmin
        .from('committee_members')
        .update(payload)
        .eq('committee_id', params.id)
        .eq('id', params.memberId)
        .select(MEMBER_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Committee member not found.');

      return ok({
        ok: true,
        member: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update committee member.');
    }
  }

  return { GET, PATCH };
}

export function makeCommitteeMemberArchiveHandler() {
  async function PATCH(request: NextRequest, { params }: ParamsWithMemberId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const is_archived = requireBoolean(body, 'is_archived');

      const committee = await getCommittee(params.id);
      if (!committee) return notFound('Committee not found.');

      const member = await getMember(params.id, params.memberId);
      if (!member) return notFound('Committee member not found.');

      const committeeIsPinned = Boolean((committee as { is_pinned?: boolean }).is_pinned);
      const memberIsPinned = Boolean((member as { is_pinned?: boolean }).is_pinned);

      if (is_archived && committeeIsPinned && memberIsPinned) {
        const pinnedMembersCount = await countPinnedActiveMembers(params.id);

        if (pinnedMembersCount <= 1) {
          return badRequest(
            'Pinned committee must keep at least one pinned active member. Unpin the committee first.',
            'PINNED_COMMITTEE_NEEDS_PINNED_MEMBER',
          );
        }
      }

      const updatePayload: Record<string, unknown> = {
        is_archived,
      };

      if (is_archived) {
        updatePayload.is_pinned = false;
        updatePayload.pinned_sort_order = 0;
      }

      const { data, error } = await supabaseAdmin
        .from('committee_members')
        .update(updatePayload)
        .eq('committee_id', params.id)
        .eq('id', params.memberId)
        .select(MEMBER_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Committee member not found.');

      return ok({
        ok: true,
        member: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update member archive status.');
    }
  }

  return { PATCH };
}

export function makeCommitteeMemberPinHandler() {
  async function PATCH(request: NextRequest, { params }: ParamsWithMemberId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const is_pinned = requireBoolean(body, 'is_pinned');

      const committee = await getCommittee(params.id);
      if (!committee) return notFound('Committee not found.');

      const member = await getMember(params.id, params.memberId);
      if (!member) return notFound('Committee member not found.');

      const committeeIsPinned = Boolean((committee as { is_pinned?: boolean }).is_pinned);
      const memberIsPinned = Boolean((member as { is_pinned?: boolean }).is_pinned);
      const memberIsArchived = Boolean((member as { is_archived?: boolean }).is_archived);

      if (memberIsArchived && is_pinned) {
        return badRequest('Archived member cannot be pinned.', 'ARCHIVED_MEMBER_CANNOT_BE_PINNED');
      }

      const pinnedMembersCount = await countPinnedActiveMembers(params.id);

      if (is_pinned && !memberIsPinned && pinnedMembersCount >= MAX_PINNED_MEMBERS_PER_COMMITTEE) {
        return badRequest(
          `Maximum ${MAX_PINNED_MEMBERS_PER_COMMITTEE} pinned members are allowed per committee.`,
          'PIN_LIMIT_REACHED',
        );
      }

      if (!is_pinned && committeeIsPinned && memberIsPinned && pinnedMembersCount <= 1) {
        return badRequest(
          'Pinned committee must keep at least one pinned active member. Unpin the committee first.',
          'PINNED_COMMITTEE_NEEDS_PINNED_MEMBER',
        );
      }

      const pinned_sort_order =
        is_pinned && !memberIsPinned
          ? await getHighestPinnedSortOrder(params.id)
          : is_pinned
            ? ((member as { pinned_sort_order?: number }).pinned_sort_order ?? 0)
            : 0;

      const { data, error } = await supabaseAdmin
        .from('committee_members')
        .update({
          is_pinned,
          pinned_sort_order,
        })
        .eq('committee_id', params.id)
        .eq('id', params.memberId)
        .select(MEMBER_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Committee member not found.');

      return ok({
        ok: true,
        member: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update member pin status.');
    }
  }

  return { PATCH };
}

export function makeCommitteeMembersReorderHandler(mode: 'normal' | 'pinned') {
  async function PATCH(request: NextRequest, { params }: ParamsWithCommitteeId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const committee = await getCommittee(params.id);
      if (!committee) return notFound('Committee not found.');

      const body = assertRecord(await parseJsonBody(request));
      const ids = requireIdArray(body);

      await reorderRows(
        'committee_members',
        ids,
        mode === 'normal' ? 'sort_order' : 'pinned_sort_order',
        mode === 'normal'
          ? { committee_id: params.id }
          : { committee_id: params.id, is_pinned: true },
      );

      const members = await getCommitteeMembers(params.id);

      return ok({
        ok: true,
        members,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not reorder committee members.');
    }
  }

  return { PATCH };
}