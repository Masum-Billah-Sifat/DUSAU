export function normalizeArray<T>(value: unknown, keys: string[] = []) {
  if (Array.isArray(value)) {
    return value as T[]
  }

  if (value && typeof value === 'object') {
    for (const key of ['items', 'data', 'results', ...keys]) {
      const candidate = (value as Record<string, unknown>)[key]
      if (Array.isArray(candidate)) {
        return candidate as T[]
      }
    }
  }

  return []
}