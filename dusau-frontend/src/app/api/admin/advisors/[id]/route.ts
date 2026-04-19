import { ensureAdmin } from '@/lib/api/admin'
import { ok, badRequest, notFound, serverError, toErrorMessage } from '@/lib/api/http'
import { maybeSingle, runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import {
  parseJsonBody,
  pickDefined,
  asString,
  asNullableString,
  asBoolean,
  asInteger,
  asStringArray
} from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = { params: { id: string } }

export async function GET(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const row = await maybeSingle(
      supabaseAdmin
        .from('advisors')
        .select(`id,
          name,
          description,
          profile_image_path,
          is_archived,
          is_pinned,
          sort_order,
          created_at,
          updated_at`)
        .eq('id', context.params.id)
        .maybeSingle()
    )

    if (!row) return notFound('advisor not found')

    return ok(row)
  } catch (error) {
    return serverError('Failed to fetch advisor.', toErrorMessage(error))
  }
}

export async function PATCH(request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)

    const payload = pickDefined({
      name: asString(body.name),
      description: asNullableString(body.description),
      profile_image_path: asNullableString(body.profile_image_path),
      is_archived: asBoolean(body.is_archived),
      is_pinned: asBoolean(body.is_pinned),
      sort_order: asInteger(body.sort_order)
    })

    if (Object.keys(payload).length === 0) {
      return badRequest('No valid fields provided for update.')
    }

    const [updatedRow] = await runUpdate(
      supabaseAdmin
        .from('advisors')
        .update(payload)
        .eq('id', context.params.id)
        .select(`id,
          name,
          description,
          profile_image_path,
          is_archived,
          is_pinned,
          sort_order,
          created_at,
          updated_at`)
    )

    if (!updatedRow) return notFound('advisor not found')

    return ok(updatedRow)
  } catch (error) {
    return serverError('Failed to update advisor.', toErrorMessage(error))
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {

    const deleted = await runUpdate(
      supabaseAdmin
        .from('advisors')
        .delete()
        .eq('id', context.params.id)
        .select('id')
    )

    if (!deleted?.length) return notFound('advisor not found')

    return ok({ id: context.params.id, deleted: true })
  } catch (error) {
    return serverError('Failed to delete advisor.', toErrorMessage(error))
  }
}
