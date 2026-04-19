import { ensureAdmin } from '@/lib/api/admin'
import { ok, badRequest, notFound, serverError, toErrorMessage } from '@/lib/api/http'
import { maybeSingle, many, runUpdate, supabaseAdmin } from '@/lib/api/supabase'
import {
  parseJsonBody,
  pickDefined,
  asString,
  asNullableString,
  asBoolean,
  asInteger,
  asStringArray,
  slugify,
} from '@/lib/api/validators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = { params: { id: string } }

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

export async function GET(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const event = await maybeSingle(
      supabaseAdmin
        .from('events')
        .select(SELECT_FIELDS)
        .eq('id', context.params.id)
        .maybeSingle()
    )

    if (!event) return notFound('Event not found')

    const [images, videos] = await Promise.all([
      many(
        supabaseAdmin
          .from('event_images')
          .select('id, event_id, image_path, alt_text, sort_order, created_at')
          .eq('event_id', context.params.id)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true })
      ),
      many(
        supabaseAdmin
          .from('event_videos')
          .select('id, event_id, youtube_url, sort_order, created_at')
          .eq('event_id', context.params.id)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true })
      ),
    ])

    return ok({ ...event, images, videos })
  } catch (error) {
    return serverError('Failed to fetch event.', toErrorMessage(error))
  }
}

export async function PATCH(request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const body = await parseJsonBody(request)

    const title = asString(body.title)
    const incomingSlug = asString(body.slug)
    const slug = incomingSlug ?? (title ? slugify(title) : undefined)

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

    if (Object.keys(payload).length === 0) {
      return badRequest('No valid fields provided for update.')
    }

    const [updatedRow] = await runUpdate(
      supabaseAdmin
        .from('events')
        .update(payload)
        .eq('id', context.params.id)
        .select(SELECT_FIELDS)
    )

    if (!updatedRow) return notFound('Event not found')

    return ok(updatedRow)
  } catch (error) {
    return serverError('Failed to update event.', toErrorMessage(error))
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await ensureAdmin()
  if (!auth.ok) return auth.response

  try {
    const deleted = await runUpdate(
      supabaseAdmin
        .from('events')
        .delete()
        .eq('id', context.params.id)
        .select('id')
    )

    if (!deleted?.length) return notFound('Event not found')

    return ok({ id: context.params.id, deleted: true })
  } catch (error) {
    return serverError('Failed to delete event.', toErrorMessage(error))
  }
}
