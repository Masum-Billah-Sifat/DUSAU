import { ok, serverError, toErrorMessage } from '@/lib/api/http'
import { many, supabaseAdmin } from '@/lib/api/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const alumni = await many(
      supabaseAdmin
        .from('alumni')
        .select(`
          id,
          name,
          profile_image_path,
          session,
          department,
          current_company,
          current_position,
          short_quote,
          latest_dusau_position,
          sort_order,
          created_at,
          updated_at
        `)
        .eq('is_archived', false)
        .eq('is_pinned', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
    )

    return ok(alumni)
  } catch (error) {
    return serverError('Failed to fetch alumni.', toErrorMessage(error))
  }
}
