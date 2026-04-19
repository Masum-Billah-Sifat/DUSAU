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
    let query = supabaseAdmin.from('member_directory').select(`id,
          name,
          session,
          department,
          blood_group,
          profile_image_path,
          created_at,
          updated_at`)
    query = query.order('session', { ascending: true }).order('name', { ascending: true })
    const rows = await many(query)
    return ok(rows)
  } catch (error) {
    return serverError('Failed to fetch member_directory.', toErrorMessage(error))
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
      session: asString(body.session),
      department: asString(body.department),
      blood_group: asNullableString(body.blood_group),
      profile_image_path: asNullableString(body.profile_image_path)
    })

    const [createdRow] = await runUpdate(
      supabaseAdmin.from('member_directory').insert(payload).select(`id,
          name,
          session,
          department,
          blood_group,
          profile_image_path,
          created_at,
          updated_at`)
    )

    return created(createdRow)
  } catch (error) {
    return serverError('Failed to create member_directory.', toErrorMessage(error))
  }
}
