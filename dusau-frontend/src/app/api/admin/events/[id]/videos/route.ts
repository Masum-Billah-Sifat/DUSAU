import { ensureAdmin } from '@/lib/api/admin'
import { ok, created, badRequest, serverError, toErrorMessage } from '@/lib/api/http'
import { many, runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import { parseJsonBody, pickDefined, asString, asInteger, validateRequiredStrings } from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = { params: { id: string } }

const SELECT_FIELDS = `
  id,
  event_id,
  youtube_url,
  sort_order,
  created_at
`

export async function GET(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const rows = await many(
      supabaseAdmin
        .from('event_videos')
        .select(SELECT_FIELDS)
        .eq('event_id', context.params.id)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
    )

    return ok(rows)
  } catch (error) {
    return serverError('Failed to fetch event videos.', toErrorMessage(error))
  }
}

export async function POST(request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)
    const requiredCheck = validateRequiredStrings(body, ['youtube_url'])

    if (!requiredCheck.isValid) {
      return badRequest('Missing required fields.', requiredCheck.missing)
    }

    const payload = pickDefined({
      event_id: context.params.id,
      youtube_url: asString(body.youtube_url),
      sort_order: asInteger(body.sort_order),
    })

    const [createdRow] = await runUpdate(
      supabaseAdmin
        .from('event_videos')
        .insert(payload)
        .select(SELECT_FIELDS)
    )

    return created(createdRow)
  } catch (error) {
    return serverError('Failed to create event video.', toErrorMessage(error))
  }
}
