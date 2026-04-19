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
        .from('member_directory')
        .select(`id,
          name,
          session,
          department,
          blood_group,
          profile_image_path,
          created_at,
          updated_at`)
        .eq('id', context.params.id)
        .maybeSingle()
    )

    if (!row) return notFound('member_directory not found')

    return ok(row)
  } catch (error) {
    return serverError('Failed to fetch member_directory.', toErrorMessage(error))
  }
}

export async function PATCH(request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)

    const payload = pickDefined({
      name: asString(body.name),
      session: asString(body.session),
      department: asString(body.department),
      blood_group: asNullableString(body.blood_group),
      profile_image_path: asNullableString(body.profile_image_path)
    })

    if (Object.keys(payload).length === 0) {
      return badRequest('No valid fields provided for update.')
    }

    const [updatedRow] = await runUpdate(
      supabaseAdmin
        .from('member_directory')
        .update(payload)
        .eq('id', context.params.id)
        .select(`id,
          name,
          session,
          department,
          blood_group,
          profile_image_path,
          created_at,
          updated_at`)
    )

    if (!updatedRow) return notFound('member_directory not found')

    return ok(updatedRow)
  } catch (error) {
    return serverError('Failed to update member_directory.', toErrorMessage(error))
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {

    const deleted = await runUpdate(
      supabaseAdmin
        .from('member_directory')
        .delete()
        .eq('id', context.params.id)
        .select('id')
    )

    if (!deleted?.length) return notFound('member_directory not found')

    return ok({ id: context.params.id, deleted: true })
  } catch (error) {
    return serverError('Failed to delete member_directory.', toErrorMessage(error))
  }
}
