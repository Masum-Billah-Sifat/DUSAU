import { ensureAdmin } from '@/lib/api/admin'
import { ok, badRequest, notFound, serverError, toErrorMessage } from '@/lib/api/http'
import { maybeSingle, runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import { parseJsonBody, pickDefined, asString, asBoolean, asInteger } from '@/lib/api/validators'

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

type Context = { params: { id: string } }

export async function GET(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const row = await maybeSingle(
      supabaseAdmin
        .from('committees')
        .select(SELECT_FIELDS)
        .eq('id', context.params.id)
        .maybeSingle()
    )

    if (!row) return notFound('Committee not found')

    return ok(row)
  } catch (error) {
    return serverError('Failed to fetch committee.', toErrorMessage(error))
  }
}

export async function PATCH(request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)

    const fromYear = asInteger(body.from_year)
    const toYear = asInteger(body.to_year)
    const isPinned = asBoolean(body.is_pinned)

    if (fromYear !== undefined && toYear !== undefined && toYear < fromYear) {
      return badRequest('to_year cannot be less than from_year.')
    }

    if (isPinned === true) {
      await runUpdate(
        supabaseAdmin
          .from('committees')
          .update({ is_pinned: false })
          .neq('id', context.params.id)
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

    if (Object.keys(payload).length === 0) {
      return badRequest('No valid fields provided for update.')
    }

    const [updatedRow] = await runUpdate(
      supabaseAdmin
        .from('committees')
        .update(payload)
        .eq('id', context.params.id)
        .select(SELECT_FIELDS)
    )

    if (!updatedRow) return notFound('Committee not found')

    return ok(updatedRow)
  } catch (error) {
    return serverError('Failed to update committee.', toErrorMessage(error))
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const deleted = await runUpdate(
      supabaseAdmin
        .from('committees')
        .delete()
        .eq('id', context.params.id)
        .select('id')
    )

    if (!deleted?.length) return notFound('Committee not found')

    return ok({ id: context.params.id, deleted: true })
  } catch (error) {
    return serverError('Failed to delete committee.', toErrorMessage(error))
  }
}
