import { ok, notFound, serverError, toErrorMessage } from '@/lib/api/http'
import { maybeSingle, many, supabaseAdmin } from '@/lib/api/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const committee = await maybeSingle(
      supabaseAdmin
        .from('committees')
        .select('id, from_year, to_year, summary, is_archived, is_pinned, created_at, updated_at')
        .eq('is_pinned', true)
        .eq('is_archived', false)
        .maybeSingle()
    )

    if (!committee) return notFound('Pinned committee not found')

    const members = await many(
      supabaseAdmin
        .from('committee_members')
        .select('id, committee_id, name, profile_image_path, session, department, position, is_pinned, sort_order, created_at, updated_at')
        .eq('committee_id', committee.id)
        .order('is_pinned', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
    )

    return ok({ committee, members })
  } catch (error) {
    return serverError('Failed to fetch committee members.', toErrorMessage(error))
  }
}
