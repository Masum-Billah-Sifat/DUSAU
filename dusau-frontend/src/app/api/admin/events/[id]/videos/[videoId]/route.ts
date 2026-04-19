import { ensureAdmin } from '@/lib/api/admin'
import { ok, badRequest, notFound, serverError, toErrorMessage } from '@/lib/api/http'
import { runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import { parseJsonBody, pickDefined, asString, asInteger } from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = { params: { id: string; videoId: string } }

const SELECT_FIELDS = `
  id,
  event_id,
  youtube_url,
  sort_order,
  created_at
`

export async function PATCH(request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)
    const payload = pickDefined({
      youtube_url: asString(body.youtube_url),
      sort_order: asInteger(body.sort_order),
    })

    if (Object.keys(payload).length === 0) {
      return badRequest('No valid fields provided for update.')
    }

    const [updatedRow] = await runUpdate(
      supabaseAdmin
        .from('event_videos')
        .update(payload)
        .eq('event_id', context.params.id)
        .eq('id', context.params.videoId)
        .select(SELECT_FIELDS)
    )

    if (!updatedRow) return notFound('Event video not found')

    return ok(updatedRow)
  } catch (error) {
    return serverError('Failed to update event video.', toErrorMessage(error))
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const deleted = await runUpdate(
      supabaseAdmin
        .from('event_videos')
        .delete()
        .eq('event_id', context.params.id)
        .eq('id', context.params.videoId)
        .select('id')
    )

    if (!deleted?.length) return notFound('Event video not found')

    return ok({ id: context.params.videoId, deleted: true })
  } catch (error) {
    return serverError('Failed to delete event video.', toErrorMessage(error))
  }
}
