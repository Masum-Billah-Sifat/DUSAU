export class HttpError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

async function parseJsonSafely(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function getMessageFromData(data: unknown, fallback: string) {
  if (typeof data === 'object' && data !== null && 'message' in data) {
    const message = (data as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return fallback
}

export async function logoutAdminSession() {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
    })
  } catch {
    // ignore logout cleanup errors
  }
}

export async function redirectToLogin(reason = 'unauthorized') {
  await logoutAdminSession()

  if (typeof window !== 'undefined') {
    const target = `/login?reason=${encodeURIComponent(reason)}`
    window.location.replace(target)
  }
}

async function requestJson<T>(
  input: string,
  init?: RequestInit,
  options?: { redirectOnUnauthorized?: boolean }
): Promise<T> {
  const response = await fetch(input, {
    credentials: 'same-origin',
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const data = await parseJsonSafely(response)

  if (!response.ok) {
    if (response.status === 401 && options?.redirectOnUnauthorized) {
      await redirectToLogin('session-expired')
    }

    throw new HttpError(
      getMessageFromData(data, 'Request failed.'),
      response.status,
      data
    )
  }

  return data as T
}

export async function publicJson<T>(input: string, init?: RequestInit) {
  return requestJson<T>(input, init)
}

export async function adminJson<T>(input: string, init?: RequestInit) {
  return requestJson<T>(input, init, { redirectOnUnauthorized: true })
}

export async function checkAdminSession() {
  try {
    await requestJson('/api/admin/org', { method: 'GET' })
    return true
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      return false
    }

    throw error
  }
}