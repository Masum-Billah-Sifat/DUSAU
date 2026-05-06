import { NextRequest } from 'next/server';
import { ensureAdmin } from './admin';
import { badRequest, created, notFound, ok, serverError } from './http';
import { supabaseAdmin } from './supabase';
import {
  asString,
  assertRecord,
  optionalStringArray,
  parseJsonBody,
  requireBoolean,
  requireIdArray,
  requireNonEmptyStringArray,
  requireString,
} from './validators';

type ParamsWithEventId = {
  params: {
    id: string;
  };
};

type ParamsWithImageId = {
  params: {
    id: string;
    imageId: string;
  };
};

type ParamsWithVideoId = {
  params: {
    id: string;
    videoId: string;
  };
};

const EVENT_SELECT = '*';
const EVENT_IMAGE_SELECT = '*';
const EVENT_VIDEO_SELECT = '*';
const MAX_PINNED_EVENTS = 10;

function isValidDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime());
}

function pickEventPayload(body: Record<string, unknown>) {
  const event_date = requireString(body, 'event_date');

  if (!isValidDateOnly(event_date)) {
    throw new Error('event_date must be a valid date in YYYY-MM-DD format.');
  }

  return {
    title: requireString(body, 'title'),
    description: requireString(body, 'description'),
    event_date,
    category: requireString(body, 'category'),
    location_tags: requireNonEmptyStringArray(body, 'location_tags'),
    cover_image_path: requireString(body, 'cover_image_path'),
  };
}

function requireYoutubeUrl(body: Record<string, unknown>) {
  const youtube_url = requireString(body, 'youtube_url');

  try {
    const url = new URL(youtube_url);
    const hostname = url.hostname.toLowerCase();

    const allowed =
      hostname === 'youtube.com' ||
      hostname === 'www.youtube.com' ||
      hostname === 'm.youtube.com' ||
      hostname === 'youtu.be';

    if (!allowed) {
      throw new Error();
    }

    return youtube_url;
  } catch {
    throw new Error('youtube_url must be a valid YouTube URL.');
  }
}

function validateYoutubeUrls(urls: string[]) {
  return urls.map((youtube_url) => {
    try {
      const url = new URL(youtube_url);
      const hostname = url.hostname.toLowerCase();

      const allowed =
        hostname === 'youtube.com' ||
        hostname === 'www.youtube.com' ||
        hostname === 'm.youtube.com' ||
        hostname === 'youtu.be';

      if (!allowed) throw new Error();

      return youtube_url;
    } catch {
      throw new Error('Every youtube_urls item must be a valid YouTube URL.');
    }
  });
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

async function getHighestPinnedSortOrder() {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('pinned_sort_order')
    .eq('is_pinned', true)
    .order('pinned_sort_order', { ascending: false })
    .limit(1);

  if (error) throw error;

  return ((data?.[0]?.pinned_sort_order as number | undefined) ?? 0) + 1;
}

async function getEvent(id: string) {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select(EVENT_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function getEventImage(eventId: string, imageId: string) {
  const { data, error } = await supabaseAdmin
    .from('event_images')
    .select(EVENT_IMAGE_SELECT)
    .eq('event_id', eventId)
    .eq('id', imageId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function getEventVideo(eventId: string, videoId: string) {
  const { data, error } = await supabaseAdmin
    .from('event_videos')
    .select(EVENT_VIDEO_SELECT)
    .eq('event_id', eventId)
    .eq('id', videoId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function getEventImages(eventId: string) {
  const { data, error } = await supabaseAdmin
    .from('event_images')
    .select(EVENT_IMAGE_SELECT)
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

async function getEventVideos(eventId: string) {
  const { data, error } = await supabaseAdmin
    .from('event_videos')
    .select(EVENT_VIDEO_SELECT)
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

async function countActiveImages(eventId: string) {
  const { count, error } = await supabaseAdmin
    .from('event_images')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .eq('is_archived', false);

  if (error) throw error;

  return count ?? 0;
}

async function countPinnedActiveEvents() {
  const { count, error } = await supabaseAdmin
    .from('events')
    .select('id', { count: 'exact', head: true })
    .eq('is_archived', false)
    .eq('is_pinned', true);

  if (error) throw error;

  return count ?? 0;
}

async function getEvents() {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select(EVENT_SELECT)
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

export function makeEventRootHandlers() {
  async function GET() {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const events = await getEvents();

      return ok({
        ok: true,
        events,
      });
    } catch (error) {
      return serverError(error);
    }
  }

  async function POST(request: NextRequest) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    let createdEventId: string | null = null;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const eventPayload = pickEventPayload(body);

      const image_paths = requireNonEmptyStringArray(body, 'image_paths');
      const youtube_urls = validateYoutubeUrls(optionalStringArray(body, 'youtube_urls'));

      const sort_order = await getHighestSortOrder('events');

      const { data: event, error: eventError } = await supabaseAdmin
        .from('events')
        .insert({
          ...eventPayload,
          sort_order,
        })
        .select(EVENT_SELECT)
        .single();

      if (eventError) throw eventError;

      createdEventId = event.id as string;

      const imageRows = image_paths.map((image_path, index) => ({
        event_id: createdEventId,
        image_path,
        sort_order: index + 1,
      }));

      const { error: imageError } = await supabaseAdmin
        .from('event_images')
        .insert(imageRows);

      if (imageError) throw imageError;

      if (youtube_urls.length > 0) {
        const videoRows = youtube_urls.map((youtube_url, index) => ({
          event_id: createdEventId,
          youtube_url,
          sort_order: index + 1,
        }));

        const { error: videoError } = await supabaseAdmin
          .from('event_videos')
          .insert(videoRows);

        if (videoError) throw videoError;
      }

      const images = await getEventImages(createdEventId);
      const videos = await getEventVideos(createdEventId);

      return created({
        ok: true,
        event,
        images,
        videos,
      });
    } catch (error) {
      if (createdEventId) {
        await supabaseAdmin.from('events').delete().eq('id', createdEventId);
      }

      return badRequest(error instanceof Error ? error.message : 'Could not create event.');
    }
  }

  return { GET, POST };
}

export function makeEventItemHandlers() {
  async function GET(_request: NextRequest, { params }: ParamsWithEventId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const event = await getEvent(params.id);
      if (!event) return notFound('Event not found.');

      const images = await getEventImages(params.id);
      const videos = await getEventVideos(params.id);

      return ok({
        ok: true,
        event,
        images,
        videos,
      });
    } catch (error) {
      return serverError(error);
    }
  }

  async function PATCH(request: NextRequest, { params }: ParamsWithEventId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const payload = pickEventPayload(body);

      const { data, error } = await supabaseAdmin
        .from('events')
        .update(payload)
        .eq('id', params.id)
        .select(EVENT_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Event not found.');

      return ok({
        ok: true,
        event: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update event.');
    }
  }

  return { GET, PATCH };
}

export function makeEventArchiveHandler() {
  async function PATCH(request: NextRequest, { params }: ParamsWithEventId) {
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
        .from('events')
        .update(updatePayload)
        .eq('id', params.id)
        .select(EVENT_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Event not found.');

      return ok({
        ok: true,
        event: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update archive status.');
    }
  }

  return { PATCH };
}

export function makeEventPinHandler() {
  async function PATCH(request: NextRequest, { params }: ParamsWithEventId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const is_pinned = requireBoolean(body, 'is_pinned');

      const event = await getEvent(params.id);
      if (!event) return notFound('Event not found.');

      const eventIsArchived = Boolean((event as { is_archived?: boolean }).is_archived);
      const eventIsPinned = Boolean((event as { is_pinned?: boolean }).is_pinned);

      if (eventIsArchived && is_pinned) {
        return badRequest('Archived event cannot be pinned.', 'ARCHIVED_EVENT_CANNOT_BE_PINNED');
      }

      if (is_pinned) {
        const activeImagesCount = await countActiveImages(params.id);

        if (activeImagesCount < 1) {
          return badRequest('Event must have at least one active image before it can be pinned.', 'EVENT_IMAGE_REQUIRED');
        }

        const pinnedCount = await countPinnedActiveEvents();

        if (!eventIsPinned && pinnedCount >= MAX_PINNED_EVENTS) {
          return badRequest(`Maximum ${MAX_PINNED_EVENTS} pinned events are allowed.`, 'PIN_LIMIT_REACHED');
        }
      }

      const pinned_sort_order =
        is_pinned && !eventIsPinned
          ? await getHighestPinnedSortOrder()
          : is_pinned
            ? ((event as { pinned_sort_order?: number }).pinned_sort_order ?? 0)
            : 0;

      const { data, error } = await supabaseAdmin
        .from('events')
        .update({
          is_pinned,
          pinned_sort_order,
        })
        .eq('id', params.id)
        .select(EVENT_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Event not found.');

      return ok({
        ok: true,
        event: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update pin status.');
    }
  }

  return { PATCH };
}

export function makeEventReorderHandler(mode: 'normal' | 'pinned') {
  async function PATCH(request: NextRequest) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const body = assertRecord(await parseJsonBody(request));
      const ids = requireIdArray(body);

      await reorderRows(
        'events',
        ids,
        mode === 'normal' ? 'sort_order' : 'pinned_sort_order',
        mode === 'normal' ? undefined : { is_pinned: true },
      );

      const events = await getEvents();

      return ok({
        ok: true,
        events,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not reorder events.');
    }
  }

  return { PATCH };
}

export function makeEventImagesRootHandlers() {
  async function GET(_request: NextRequest, { params }: ParamsWithEventId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const event = await getEvent(params.id);
      if (!event) return notFound('Event not found.');

      const images = await getEventImages(params.id);

      return ok({
        ok: true,
        images,
      });
    } catch (error) {
      return serverError(error);
    }
  }

  async function POST(request: NextRequest, { params }: ParamsWithEventId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const event = await getEvent(params.id);
      if (!event) return notFound('Event not found.');

      const body = assertRecord(await parseJsonBody(request));
      const image_path = requireString(body, 'image_path');
      const sort_order = await getHighestSortOrder('event_images', {
        event_id: params.id,
      });

      const { data, error } = await supabaseAdmin
        .from('event_images')
        .insert({
          event_id: params.id,
          image_path,
          sort_order,
        })
        .select(EVENT_IMAGE_SELECT)
        .single();

      if (error) throw error;

      return created({
        ok: true,
        image: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not add event image.');
    }
  }

  return { GET, POST };
}

export function makeEventImageItemHandlers() {
  async function PATCH(request: NextRequest, { params }: ParamsWithImageId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const image = await getEventImage(params.id, params.imageId);
      if (!image) return notFound('Event image not found.');

      const body = assertRecord(await parseJsonBody(request));

      const updatePayload: Record<string, unknown> = {};

      const nextImagePath = asString(body.image_path);
      if (nextImagePath) {
        updatePayload.image_path = nextImagePath;
      }

      if (typeof body.is_archived === 'boolean') {
        const is_archived = body.is_archived;

        if (is_archived) {
          const imageIsArchived = Boolean((image as { is_archived?: boolean }).is_archived);

          if (!imageIsArchived) {
            const activeImagesCount = await countActiveImages(params.id);

            if (activeImagesCount <= 1) {
              return badRequest('Event must keep at least one active image.', 'EVENT_NEEDS_IMAGE');
            }
          }
        }

        updatePayload.is_archived = is_archived;
      }

      if (Object.keys(updatePayload).length === 0) {
        return badRequest('Nothing to update.');
      }

      const { data, error } = await supabaseAdmin
        .from('event_images')
        .update(updatePayload)
        .eq('event_id', params.id)
        .eq('id', params.imageId)
        .select(EVENT_IMAGE_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Event image not found.');

      return ok({
        ok: true,
        image: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update event image.');
    }
  }

  async function DELETE(_request: NextRequest, { params }: ParamsWithImageId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const image = await getEventImage(params.id, params.imageId);
      if (!image) return notFound('Event image not found.');

      const imageIsArchived = Boolean((image as { is_archived?: boolean }).is_archived);

      if (!imageIsArchived) {
        const activeImagesCount = await countActiveImages(params.id);

        if (activeImagesCount <= 1) {
          return badRequest('Event must keep at least one active image.', 'EVENT_NEEDS_IMAGE');
        }
      }

      const { data, error } = await supabaseAdmin
        .from('event_images')
        .update({
          is_archived: true,
        })
        .eq('event_id', params.id)
        .eq('id', params.imageId)
        .select(EVENT_IMAGE_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Event image not found.');

      return ok({
        ok: true,
        image: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not archive event image.');
    }
  }

  return { PATCH, DELETE };
}

export function makeEventImagesReorderHandler() {
  async function PATCH(request: NextRequest, { params }: ParamsWithEventId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const event = await getEvent(params.id);
      if (!event) return notFound('Event not found.');

      const body = assertRecord(await parseJsonBody(request));
      const ids = requireIdArray(body);

      await reorderRows('event_images', ids, 'sort_order', {
        event_id: params.id,
      });

      const images = await getEventImages(params.id);

      return ok({
        ok: true,
        images,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not reorder event images.');
    }
  }

  return { PATCH };
}

export function makeEventVideosRootHandlers() {
  async function GET(_request: NextRequest, { params }: ParamsWithEventId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const event = await getEvent(params.id);
      if (!event) return notFound('Event not found.');

      const videos = await getEventVideos(params.id);

      return ok({
        ok: true,
        videos,
      });
    } catch (error) {
      return serverError(error);
    }
  }

  async function POST(request: NextRequest, { params }: ParamsWithEventId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const event = await getEvent(params.id);
      if (!event) return notFound('Event not found.');

      const body = assertRecord(await parseJsonBody(request));
      const youtube_url = requireYoutubeUrl(body);
      const sort_order = await getHighestSortOrder('event_videos', {
        event_id: params.id,
      });

      const { data, error } = await supabaseAdmin
        .from('event_videos')
        .insert({
          event_id: params.id,
          youtube_url,
          sort_order,
        })
        .select(EVENT_VIDEO_SELECT)
        .single();

      if (error) throw error;

      return created({
        ok: true,
        video: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not add event video.');
    }
  }

  return { GET, POST };
}

export function makeEventVideoItemHandlers() {
  async function PATCH(request: NextRequest, { params }: ParamsWithVideoId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const video = await getEventVideo(params.id, params.videoId);
      if (!video) return notFound('Event video not found.');

      const body = assertRecord(await parseJsonBody(request));
      const updatePayload: Record<string, unknown> = {};

      const nextYoutubeUrl = asString(body.youtube_url);

      if (nextYoutubeUrl) {
        const validated = requireYoutubeUrl({
          youtube_url: nextYoutubeUrl,
        });

        updatePayload.youtube_url = validated;
      }

      if (typeof body.is_archived === 'boolean') {
        updatePayload.is_archived = body.is_archived;
      }

      if (Object.keys(updatePayload).length === 0) {
        return badRequest('Nothing to update.');
      }

      const { data, error } = await supabaseAdmin
        .from('event_videos')
        .update(updatePayload)
        .eq('event_id', params.id)
        .eq('id', params.videoId)
        .select(EVENT_VIDEO_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Event video not found.');

      return ok({
        ok: true,
        video: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not update event video.');
    }
  }

  async function DELETE(_request: NextRequest, { params }: ParamsWithVideoId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const { data, error } = await supabaseAdmin
        .from('event_videos')
        .update({
          is_archived: true,
        })
        .eq('event_id', params.id)
        .eq('id', params.videoId)
        .select(EVENT_VIDEO_SELECT)
        .maybeSingle();

      if (error) throw error;
      if (!data) return notFound('Event video not found.');

      return ok({
        ok: true,
        video: data,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not archive event video.');
    }
  }

  return { PATCH, DELETE };
}

export function makeEventVideosReorderHandler() {
  async function PATCH(request: NextRequest, { params }: ParamsWithEventId) {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    try {
      const event = await getEvent(params.id);
      if (!event) return notFound('Event not found.');

      const body = assertRecord(await parseJsonBody(request));
      const ids = requireIdArray(body);

      await reorderRows('event_videos', ids, 'sort_order', {
        event_id: params.id,
      });

      const videos = await getEventVideos(params.id);

      return ok({
        ok: true,
        videos,
      });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Could not reorder event videos.');
    }
  }

  return { PATCH };
}