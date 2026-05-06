import { NextRequest } from 'next/server';
import { notFound, ok, serverError } from './http';
import { supabaseAdmin } from './supabase';

type ParamsWithId = {
  params: {
    id: string;
  };
};

const EVENT_SUMMARY_SELECT = 'id,title,description,event_date,cover_image_path';

async function getPinnedCommittee() {
  const { data, error } = await supabaseAdmin
    .from('committees')
    .select('*')
    .eq('is_archived', false)
    .eq('is_pinned', true)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function getCommitteeMembers(committeeId: string, mode: 'pinned' | 'all') {
  let query = supabaseAdmin
    .from('committee_members')
    .select('*')
    .eq('committee_id', committeeId)
    .eq('is_archived', false);

  if (mode === 'pinned') {
    query = query.eq('is_pinned', true);
    query = query.order('pinned_sort_order', { ascending: true });
  } else {
    query = query.order('sort_order', { ascending: true });
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export function makePublicPinnedCommitteeHandler(mode: 'pinned-members' | 'all-members') {
  async function GET() {
    try {
      const committee = await getPinnedCommittee();

      if (!committee) {
        return ok({
          ok: true,
          committee: null,
          members: [],
        });
      }

      const members = await getCommitteeMembers(
        committee.id as string,
        mode === 'pinned-members' ? 'pinned' : 'all',
      );

      return ok({
        ok: true,
        committee,
        members,
      });
    } catch (error) {
      return serverError(error);
    }
  }

  return { GET };
}

export function makePublicAlumniHandlers(mode: 'pinned' | 'all') {
  async function GET() {
    try {
      let query = supabaseAdmin
        .from('alumni')
        .select('*')
        .eq('is_archived', false);

      if (mode === 'pinned') {
        query = query.eq('is_pinned', true).order('pinned_sort_order', { ascending: true });
      } else {
        query = query.order('sort_order', { ascending: true });
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return ok({
        ok: true,
        alumni: data ?? [],
      });
    } catch (error) {
      return serverError(error);
    }
  }

  return { GET };
}

export function makePublicAdvisorHandlers(mode: 'pinned' | 'all') {
  async function GET() {
    try {
      let query = supabaseAdmin
        .from('advisors')
        .select('*')
        .eq('is_archived', false);

      if (mode === 'pinned') {
        query = query.eq('is_pinned', true).order('pinned_sort_order', { ascending: true });
      } else {
        query = query.order('sort_order', { ascending: true });
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return ok({
        ok: true,
        advisors: data ?? [],
      });
    } catch (error) {
      return serverError(error);
    }
  }

  return { GET };
}

export function makePublicGalleryHandlers(mode: 'pinned' | 'all') {
  async function GET() {
    try {
      let query = supabaseAdmin
        .from('gallery_items')
        .select('*')
        .eq('is_archived', false);

      if (mode === 'pinned') {
        query = query.eq('is_pinned', true).order('pinned_sort_order', { ascending: true });
      } else {
        query = query.order('sort_order', { ascending: true });
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return ok({
        ok: true,
        gallery_items: data ?? [],
      });
    } catch (error) {
      return serverError(error);
    }
  }

  return { GET };
}

export function makePublicEventListHandlers(mode: 'pinned' | 'all') {
  async function GET() {
    try {
      let query = supabaseAdmin
        .from('events')
        .select(EVENT_SUMMARY_SELECT)
        .eq('is_archived', false);

      if (mode === 'pinned') {
        query = query.eq('is_pinned', true).order('pinned_sort_order', { ascending: true });
      } else {
        query = query.order('sort_order', { ascending: true });
      }

      const { data, error } = await query.order('event_date', { ascending: false });

      if (error) throw error;

      return ok({
        ok: true,
        events: data ?? [],
      });
    } catch (error) {
      return serverError(error);
    }
  }

  return { GET };
}

export function makePublicEventDetailsHandler() {
  async function GET(_request: NextRequest, { params }: ParamsWithId) {
    try {
      const { data: event, error: eventError } = await supabaseAdmin
        .from('events')
        .select('*')
        .eq('id', params.id)
        .eq('is_archived', false)
        .maybeSingle();

      if (eventError) throw eventError;
      if (!event) return notFound('Event not found.');

      const { data: images, error: imagesError } = await supabaseAdmin
        .from('event_images')
        .select('*')
        .eq('event_id', params.id)
        .eq('is_archived', false)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (imagesError) throw imagesError;

      const { data: videos, error: videosError } = await supabaseAdmin
        .from('event_videos')
        .select('*')
        .eq('event_id', params.id)
        .eq('is_archived', false)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (videosError) throw videosError;

      return ok({
        ok: true,
        event,
        images: images ?? [],
        videos: videos ?? [],
      });
    } catch (error) {
      return serverError(error);
    }
  }

  return { GET };
}