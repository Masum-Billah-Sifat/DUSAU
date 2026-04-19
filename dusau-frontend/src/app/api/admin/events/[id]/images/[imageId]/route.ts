import { ensureAdmin } from '@/lib/api/admin'
import { ok, badRequest, notFound, serverError, toErrorMessage } from '@/lib/api/http'
import { maybeSingle, runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import { parseJsonBody, pickDefined, asNullableString, asInteger } from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = { params: { id: string; imageId: string } }

const SELECT_FIELDS = `
  id,
  event_id,
  image_path,
  alt_text,
  sort_order,
  created_at
`

export async function PATCH(request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)
    const payload = pickDefined({
      image_path: asNullableString(body.image_path),
      alt_text: asNullableString(body.alt_text),
      sort_order: asInteger(body.sort_order),
    })

    if (Object.keys(payload).length === 0) {
      return badRequest('No valid fields provided for update.')
    }

    const [updatedRow] = await runUpdate(
      supabaseAdmin
        .from('event_images')
        .update(payload)
        .eq('event_id', context.params.id)
        .eq('id', context.params.imageId)
        .select(SELECT_FIELDS)
    )

    if (!updatedRow) return notFound('Event image not found')

    return ok(updatedRow)
  } catch (error) {
    return serverError('Failed to update event image.', toErrorMessage(error))
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const deleted = await runUpdate(
      supabaseAdmin
        .from('event_images')
        .delete()
        .eq('event_id', context.params.id)
        .eq('id', context.params.imageId)
        .select('id')
    )

    if (!deleted?.length) return notFound('Event image not found')

    return ok({ id: context.params.imageId, deleted: true })
  } catch (error) {
    return serverError('Failed to delete event image.', toErrorMessage(error))
  }
}
