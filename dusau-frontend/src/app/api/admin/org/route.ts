import { ensureAdmin } from '@/lib/api/admin'
import { ok, badRequest, serverError, toErrorMessage } from '@/lib/api/http'
import { maybeSingle, runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import { parseJsonBody, asNullableString, pickDefined } from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const org = await maybeSingle(
      supabaseAdmin
        .from('organizations')
        .select('*')
        .eq('id', 1)
        .maybeSingle()
    )

    return ok(org ?? null)
  } catch (error) {
    return serverError('Failed to fetch organization.', toErrorMessage(error))
  }
}

export async function PATCH(request: Request) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)

    const payload = pickDefined({
      email: asNullableString(body.email),
      phone: asNullableString(body.phone),
      cover_image_path: asNullableString(body.cover_image_path),
      cover_title: asNullableString(body.cover_title),
      cover_description: asNullableString(body.cover_description),
    })

    if (Object.keys(payload).length === 0) {
      return badRequest('No valid fields provided for update.')
    }

    const [updated] = await runUpdate(
      supabaseAdmin
        .from('organizations')
        .upsert({ id: 1, ...payload })
        .select('*')
    )

    return ok(updated)
  } catch (error) {
    return serverError('Failed to update organization.', toErrorMessage(error))
  }
}
