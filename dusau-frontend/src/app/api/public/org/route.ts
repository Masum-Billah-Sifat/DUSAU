import { ok, notFound, serverError, toErrorMessage } from '@/lib/api/http'
import { many, supabaseAdmin } from '@/lib/api/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await many(
      supabaseAdmin
        .from('organizations')
        .select('cover_image_path, cover_title, cover_description')
        .limit(1)
    )

    const org = rows[0]
    if (!org) return notFound('Organization not found')

    return ok(org)
  } catch (error) {
    return serverError('Failed to fetch organization public data.', toErrorMessage(error))
  }
}
