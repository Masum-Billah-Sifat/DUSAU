import { ok, notFound, serverError, toErrorMessage } from '@/lib/api/http'
import { maybeSingle, many, supabaseAdmin } from '@/lib/api/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = { params: { slug: string } }

export async function GET(_request: Request, context: Context) {
  try {
    const { slug } = context.params

    const event = await maybeSingle(
      supabaseAdmin
        .from('events')
        .select(`
          id,
          slug,
          title,
          description,
          event_date,
          category,
          location_tags,
          cover_image_path,
          is_archived,
          is_published,
          show_on_homepage,
          show_on_events_page,
          sort_order_homepage,
          sort_order_events_page,
          created_at,
          updated_at
        `)
        .eq('slug', slug)
        .eq('is_archived', false)
        .eq('is_published', true)
        .maybeSingle()
    )

    if (!event) return notFound('Event not found')

    const [images, videos] = await Promise.all([
      many(
        supabaseAdmin
          .from('event_images')
          .select('id, image_path, alt_text, sort_order, created_at')
          .eq('event_id', event.id)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true })
      ),
      many(
        supabaseAdmin
          .from('event_videos')
          .select('id, youtube_url, sort_order, created_at')
          .eq('event_id', event.id)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true })
      ),
    ])

    return ok({
      ...event,
      images,
      videos,
    })
  } catch (error) {
    return serverError('Failed to fetch event details.', toErrorMessage(error))
  }
}
