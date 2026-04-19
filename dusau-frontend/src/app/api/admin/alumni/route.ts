import { ensureAdmin } from '@/lib/api/admin'
import { ok, created, badRequest, serverError, toErrorMessage } from '@/lib/api/http'
import { many, runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import {
  parseJsonBody,
  pickDefined,
  validateRequiredStrings,
  asString,
  asNullableString,
  asBoolean,
  asInteger,
  asStringArray
} from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    let query = supabaseAdmin.from('alumni').select(`id,
          name,
          profile_image_path,
          session,
          department,
          current_company,
          current_position,
          short_quote,
          latest_dusau_position,
          is_archived,
          is_pinned,
          sort_order,
          created_at,
          updated_at`)
    query = query.order('is_pinned', { ascending: false }).order('sort_order', { ascending: true }).order('created_at', { ascending: false })
    const rows = await many(query)
    return ok(rows)
  } catch (error) {
    return serverError('Failed to fetch alumni.', toErrorMessage(error))
  }
}

export async function POST(request: Request) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)

    const requiredCheck = validateRequiredStrings(body, ['name', 'session', 'department'])

    if (!requiredCheck.isValid) {
      return badRequest('Missing required fields.', requiredCheck.missing)
    }

    const payload = pickDefined({
      name: asString(body.name),
      profile_image_path: asNullableString(body.profile_image_path),
      session: asString(body.session),
      department: asString(body.department),
      current_company: asNullableString(body.current_company),
      current_position: asNullableString(body.current_position),
      short_quote: asNullableString(body.short_quote),
      latest_dusau_position: asNullableString(body.latest_dusau_position),
      is_archived: asBoolean(body.is_archived),
      is_pinned: asBoolean(body.is_pinned),
      sort_order: asInteger(body.sort_order)
    })

    const [createdRow] = await runUpdate(
      supabaseAdmin.from('alumni').insert(payload).select(`id,
          name,
          profile_image_path,
          session,
          department,
          current_company,
          current_position,
          short_quote,
          latest_dusau_position,
          is_archived,
          is_pinned,
          sort_order,
          created_at,
          updated_at`)
    )

    return created(createdRow)
  } catch (error) {
    return serverError('Failed to create alumni.', toErrorMessage(error))
  }
}
