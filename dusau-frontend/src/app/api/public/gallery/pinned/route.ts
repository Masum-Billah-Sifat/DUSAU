import { ok, serverError, toErrorMessage } from '@/lib/api/http'
import { many, supabaseAdmin } from '@/lib/api/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const items = await many(
      supabaseAdmin
        .from('gallery_items')
        .select('id, title, description, image_path, sort_order, created_at, updated_at')
        .eq('is_archived', false)
        .eq('is_pinned', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
    )

    return ok(items)
  } catch (error) {
    return serverError('Failed to fetch pinned gallery items.', toErrorMessage(error))
  }
}
