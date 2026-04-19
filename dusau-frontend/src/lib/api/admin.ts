import { requireAdminSession } from '@/lib/auth/admin-session'
import { unauthorized } from '@/lib/api/http'

export async function requireAdminRequest() {
  try {
    return await requireAdminSession()
  } catch {
    return null
  }
}

export async function ensureAdmin() {
  const session = await requireAdminRequest()

  if (!session) {
    return { ok: false as const, response: unauthorized() }
  }

  return { ok: true as const, session }
}
