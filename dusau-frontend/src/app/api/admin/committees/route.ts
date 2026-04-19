import { ensureAdmin } from '@/lib/api/admin'
import { ok, created, badRequest, serverError, toErrorMessage } from '@/lib/api/http'
import { many, runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import {
  parseJsonBody,
  pickDefined,
  asString,
  asBoolean,
  asInteger,
  validateRequiredStrings,
} from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SELECT_FIELDS = `
  id,
  from_year,
  to_year,
  summary,
  is_archived,
  is_pinned,
  created_at,
  updated_at
`

export async function GET() {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const rows = await many(
      supabaseAdmin
        .from('committees')
        .select(SELECT_FIELDS)
        .order('is_pinned', { ascending: false })
        .order('to_year', { ascending: false })
        .order('from_year', { ascending: false })
        .order('created_at', { ascending: false })
    )

    return ok(rows)
  } catch (error) {
    return serverError('Failed to fetch committees.', toErrorMessage(error))
  }
}

export async function POST(request: Request) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)

    const requiredCheck = validateRequiredStrings(body, ['from_year', 'to_year'].filter(() => false))
    void requiredCheck

    const fromYear = asInteger(body.from_year)
    const toYear = asInteger(body.to_year)

    if (fromYear === undefined || toYear === undefined) {
      return badRequest('from_year and to_year are required integers.')
    }

    if (toYear < fromYear) {
      return badRequest('to_year cannot be less than from_year.')
    }

    const isPinned = asBoolean(body.is_pinned) ?? false

    if (isPinned) {
      await runUpdate(
        supabaseAdmin
          .from('committees')
          .update({ is_pinned: false })
          .eq('is_pinned', true)
      )
    }

    const payload = pickDefined({
      from_year: fromYear,
      to_year: toYear,
      summary: asString(body.summary),
      is_archived: asBoolean(body.is_archived),
      is_pinned: isPinned,
    })

    const [createdRow] = await runUpdate(
      supabaseAdmin.from('committees').insert(payload).select(SELECT_FIELDS)
    )

    return created(createdRow)
  } catch (error) {
    return serverError('Failed to create committee.', toErrorMessage(error))
  }
}
