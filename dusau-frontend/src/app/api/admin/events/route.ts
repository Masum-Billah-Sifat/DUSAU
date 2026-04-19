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
  asStringArray,
  slugify,
  validateRequiredStrings,
} from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SELECT_FIELDS = `
  id,
  slug,
  title,
  description,
  event_date,
  category,
  location_tags,
  cover_image_path,
  is_archived,
  is_published,
  show_on_homepage,
  show_on_events_page,
  sort_order_homepage,
  sort_order_events_page,
  created_at,
  updated_at
`

export async function GET() {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const rows = await many(
      supabaseAdmin
        .from('events')
        .select(SELECT_FIELDS)
        .order('event_date', { ascending: false })
        .order('created_at', { ascending: false })
    )

    return ok(rows)
  } catch (error) {
    return serverError('Failed to fetch events.', toErrorMessage(error))
  }
}

export async function POST(request: Request) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)
    const requiredCheck = validateRequiredStrings(body, ['title', 'event_date', 'category'])

    if (!requiredCheck.isValid) {
      return badRequest('Missing required fields.', requiredCheck.missing)
    }

    const title = asString(body.title)!
    const incomingSlug = asString(body.slug)
    const slug = incomingSlug || slugify(title)

    if (!slug) {
      return badRequest('Unable to generate a valid slug.')
    }

    const payload = pickDefined({
      slug,
      title,
      description: asNullableString(body.description),
      event_date: asString(body.event_date),
      category: asString(body.category),
      location_tags: asStringArray(body.location_tags),
      cover_image_path: asNullableString(body.cover_image_path),
      is_archived: asBoolean(body.is_archived),
      is_published: asBoolean(body.is_published),
      show_on_homepage: asBoolean(body.show_on_homepage),
      show_on_events_page: asBoolean(body.show_on_events_page),
      sort_order_homepage: asInteger(body.sort_order_homepage),
      sort_order_events_page: asInteger(body.sort_order_events_page),
    })

    const [createdRow] = await runUpdate(
      supabaseAdmin
        .from('events')
        .insert(payload)
        .select(SELECT_FIELDS)
    )

    return created(createdRow)
  } catch (error) {
    return serverError('Failed to create event.', toErrorMessage(error))
  }
}
