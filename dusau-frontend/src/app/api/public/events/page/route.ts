import { ok, serverError, toErrorMessage } from '@/lib/api/http'
import { many, supabaseAdmin } from '@/lib/api/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const events = await many(
      supabaseAdmin
        .from('events')
        .select('id, slug, title, description, event_date, category, cover_image_path')
        .eq('is_archived', false)
        .eq('is_published', true)
        .eq('show_on_events_page', true)
        .order('sort_order_events_page', { ascending: true })
        .order('event_date', { ascending: false })
        .order('created_at', { ascending: false })
    )

    return ok(events)
  } catch (error) {
    return serverError('Failed to fetch events page cards.', toErrorMessage(error))
  }
}
