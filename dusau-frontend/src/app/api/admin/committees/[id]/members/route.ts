import { ensureAdmin } from '@/lib/api/admin'
import { ok, created, badRequest, serverError, toErrorMessage } from '@/lib/api/http'
import { many, runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import {
  parseJsonBody,
  pickDefined,
  asString,
  asNullableString,
  asBoolean,
  asInteger,
  validateRequiredStrings,
} from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = { params: { id: string } }

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
    const members = await many(
      supabaseAdmin
        .from('committee_members')
        .select(SELECT_FIELDS)
        .eq('committee_id', context.params.id)
        .order('is_pinned', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
    )

    return ok(members)
  } catch (error) {
    return serverError('Failed to fetch committee members.', toErrorMessage(error))
  }
}

export async function POST(request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)
    const requiredCheck = validateRequiredStrings(body, ['name', 'session', 'department', 'position'])

    if (!requiredCheck.isValid) {
      return badRequest('Missing required fields.', requiredCheck.missing)
    }

    const payload = pickDefined({
      committee_id: context.params.id,
      name: asString(body.name),
      profile_image_path: asNullableString(body.profile_image_path),
      session: asString(body.session),
      department: asString(body.department),
      position: asString(body.position),
      is_pinned: asBoolean(body.is_pinned),
      sort_order: asInteger(body.sort_order),
    })

    const [createdRow] = await runUpdate(
      supabaseAdmin
        .from('committee_members')
        .insert(payload)
        .select(SELECT_FIELDS)
    )

    return created(createdRow)
  } catch (error) {
    return serverError('Failed to create committee member.', toErrorMessage(error))
  }
}
