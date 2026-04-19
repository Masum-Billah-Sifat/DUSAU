import { ensureAdmin } from '@/lib/api/admin'
import { ok, badRequest, notFound, serverError, toErrorMessage } from '@/lib/api/http'
import { maybeSingle, runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import { parseJsonBody, pickDefined, asString, asNullableString, asBoolean, asInteger } from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = { params: { id: string; memberId: string } }

const SELECT_FIELDS = `
  id,
  committee_id,
  name,
  profile_image_path,
  session,
  department,
  position,
  is_pinned,
  sort_order,
  created_at,
  updated_at
`

export async function GET(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const row = await maybeSingle(
      supabaseAdmin
        .from('committee_members')
        .select(SELECT_FIELDS)
        .eq('committee_id', context.params.id)
        .eq('id', context.params.memberId)
        .maybeSingle()
    )

    if (!row) return notFound('Committee member not found')

    return ok(row)
  } catch (error) {
    return serverError('Failed to fetch committee member.', toErrorMessage(error))
  }
}

export async function PATCH(request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)

    const payload = pickDefined({
      name: asString(body.name),
      profile_image_path: asNullableString(body.profile_image_path),
      session: asString(body.session),
      department: asString(body.department),
      position: asString(body.position),
      is_pinned: asBoolean(body.is_pinned),
      sort_order: asInteger(body.sort_order),
    })

    if (Object.keys(payload).length === 0) {
      return badRequest('No valid fields provided for update.')
    }

    const [updatedRow] = await runUpdate(
      supabaseAdmin
        .from('committee_members')
        .update(payload)
        .eq('committee_id', context.params.id)
        .eq('id', context.params.memberId)
        .select(SELECT_FIELDS)
    )

    if (!updatedRow) return notFound('Committee member not found')

    return ok(updatedRow)
  } catch (error) {
    return serverError('Failed to update committee member.', toErrorMessage(error))
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const deleted = await runUpdate(
      supabaseAdmin
        .from('committee_members')
        .delete()
        .eq('committee_id', context.params.id)
        .eq('id', context.params.memberId)
        .select('id')
    )

    if (!deleted?.length) return notFound('Committee member not found')

    return ok({ id: context.params.memberId, deleted: true })
  } catch (error) {
    return serverError('Failed to delete committee member.', toErrorMessage(error))
  }
}
