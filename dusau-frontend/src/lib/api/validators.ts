export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function parseJsonBody(request: Request) {
  try {
    const body = await request.json()
    return isObject(body) ? body : {}
  } catch {
    return {}
  }
}

export function pickDefined<T extends Record<string, unknown>>(input: T) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  )
}

export function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : undefined
}

export function asNullableString(value: unknown) {
  if (value === null) return null
  return typeof value === 'string' ? value.trim() : undefined
}

export function asBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined
}

export function asInteger(value: unknown) {
  return typeof value === 'number' && Number.isInteger(value) ? value : undefined
}

export function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return undefined
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function validateRequiredStrings(
  input: Record<string, unknown>,
  fields: string[]
) {
  const missing = fields.filter((field) => {
    const value = input[field]
    return typeof value !== 'string' || value.trim() === ''
  })

  return {
    isValid: missing.length === 0,
    missing,
  }
}
