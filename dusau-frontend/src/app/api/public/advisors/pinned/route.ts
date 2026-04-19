import { ok, serverError, toErrorMessage } from '@/lib/api/http'
import { many, supabaseAdmin } from '@/lib/api/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const advisors = await many(
      supabaseAdmin
        .from('advisors')
        .select('id, name, description, profile_image_path, sort_order, created_at, updated_at')
        .eq('is_archived', false)
        .eq('is_pinned', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
    )

    return ok(advisors)
  } catch (error) {
    return serverError('Failed to fetch pinned advisors.', toErrorMessage(error))
  }
}
