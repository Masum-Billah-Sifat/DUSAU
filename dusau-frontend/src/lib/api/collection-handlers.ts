import { NextRequest } from 'next/server';
import { ensureAdmin } from './admin';
import { getCollectionConfig, type CollectionKey } from './collection-config';
import { badRequest, created, notFound, ok, serverError } from './http';
import { supabaseAdmin } from './supabase';
import { assertRecord, parseJsonBody, requireBoolean, requireIdArray } from './validators';

type ParamsWithId = {
  params: {
    id: string;
  };
};

function cleanOrderingRows(ids: string[]) {
  return ids.map((id, index) => ({
    id,
    order: index + 1,
  }));
}

async function countPinned(table: string) {
  const { count, error } = await supabaseAdmin
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('is_pinned', true)
    .eq('is_archived', false);

  if (error) throw error;
  return count ?? 0;
}

async function getRowById(table: string, select: string, id: string) {
  const { data, error } = await supabaseAdmin
    .from(table)
    .select(select)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function makeCollectionRootHandlers(key: CollectionKey) {
  const config = getCollectionConfig(key);

  async function GET() {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const { data, error } = await supabaseAdmin
        .from(config.table)
        .select(config.select)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      return ok({
        ok: true,
        [config.responseListKey]: data ?? [],
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
      const payload = config.createPayload(body);

      const { data: existingRows, error: orderError } = await supabaseAdmin
        .from(config.table)
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);

      if (orderError) throw orderError;

      const nextSortOrder = ((existingRows?.[0]?.sort_order as number | undefined) ?? 0) + 1;

      const { data, error } = await supabaseAdmin
        .from(config.table)
        .insert({
          ...payload,
          sort_order: nextSortOrder,
        })
        .select(config.select)
        .single();

      if (error) throw error;

      return created({
        ok: true,
        [config.responseKey]: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not create item.');
    }
  }

  return { GET, POST };
}

export function makeCollectionItemHandlers(key: CollectionKey) {
  const config = getCollectionConfig(key);

  async function GET(_request: NextRequest, { params }: ParamsWithId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const row = await getRowById(config.table, config.select, params.id);
      if (!row) return notFound(`${config.responseKey} not found.`);

      return ok({
        ok: true,
        [config.responseKey]: row,
      });
    } catch (error) {
      return serverError(error);
    }
  }

  async function PATCH(request: NextRequest, { params }: ParamsWithId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const payload = config.updatePayload(body);

      const { data, error } = await supabaseAdmin
        .from(config.table)
        .update(payload)
        .eq('id', params.id)
        .select(config.select)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound(`${config.responseKey} not found.`);

      return ok({
        ok: true,
        [config.responseKey]: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update item.');
    }
  }

  return { GET, PATCH };
}

export function makeCollectionArchiveHandler(key: CollectionKey) {
  const config = getCollectionConfig(key);

  async function PATCH(request: NextRequest, { params }: ParamsWithId) {
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
        updatePayload.pinned_sort_order = 0;
      }

      const { data, error } = await supabaseAdmin
        .from(config.table)
        .update(updatePayload)
        .eq('id', params.id)
        .select(config.select)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound(`${config.responseKey} not found.`);

      return ok({
        ok: true,
        [config.responseKey]: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update archive status.');
    }
  }

  return { PATCH };
}

export function makeCollectionPinHandler(key: CollectionKey) {
  const config = getCollectionConfig(key);

  async function PATCH(request: NextRequest, { params }: ParamsWithId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const is_pinned = requireBoolean(body, 'is_pinned');

      const existing = await getRowById(config.table, config.select, params.id);
      if (!existing) return notFound(`${config.responseKey} not found.`);

      if ((existing as { is_archived?: boolean }).is_archived) {
        return badRequest('Archived item cannot be pinned.', 'ARCHIVED_ITEM_CANNOT_BE_PINNED');
      }

      if (is_pinned) {
        const pinnedCount = await countPinned(config.table);
        const alreadyPinned = Boolean((existing as { is_pinned?: boolean }).is_pinned);

        if (!alreadyPinned && pinnedCount >= config.maxPinned) {
          return badRequest(`Maximum ${config.maxPinned} pinned items are allowed.`, 'PIN_LIMIT_REACHED');
        }
      }

      const { data: highestPinned, error: highestError } = await supabaseAdmin
        .from(config.table)
        .select('pinned_sort_order')
        .eq('is_pinned', true)
        .order('pinned_sort_order', { ascending: false })
        .limit(1);

      if (highestError) throw highestError;

      const nextPinnedSortOrder =
        is_pinned && !(existing as { is_pinned?: boolean }).is_pinned
          ? (((highestPinned?.[0]?.pinned_sort_order as number | undefined) ?? 0) + 1)
          : ((existing as { pinned_sort_order?: number }).pinned_sort_order ?? 0);

      const { data, error } = await supabaseAdmin
        .from(config.table)
        .update({
          is_pinned,
          pinned_sort_order: is_pinned ? nextPinnedSortOrder : 0,
        })
        .eq('id', params.id)
        .select(config.select)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound(`${config.responseKey} not found.`);

      return ok({
        ok: true,
        [config.responseKey]: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update pin status.');
    }
  }

  return { PATCH };
}

export function makeCollectionReorderHandler(key: CollectionKey, mode: 'normal' | 'pinned') {
  const config = getCollectionConfig(key);

  async function PATCH(request: NextRequest) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const ids = requireIdArray(body);
      const orderRows = cleanOrderingRows(ids);

      for (const row of orderRows) {
        const updatePayload =
          mode === 'normal'
            ? { sort_order: row.order }
            : { pinned_sort_order: row.order };

        const query = supabaseAdmin
          .from(config.table)
          .update(updatePayload)
          .eq('id', row.id);

        if (mode === 'pinned') {
          query.eq('is_pinned', true);
        }

        const { error } = await query;
        if (error) throw error;
      }

      const { data, error } = await supabaseAdmin
        .from(config.table)
        .select(config.select)
        .order(mode === 'normal' ? 'sort_order' : 'pinned_sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      return ok({
        ok: true,
        [config.responseListKey]: data ?? [],
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not reorder items.');
    }
  }

  return { PATCH };
}