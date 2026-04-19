import { createClient } from '@/lib/supabase/client'

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

function getMessage(data: unknown, fallback: string) {
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
    // ignore cleanup error
  }
}

export async function redirectToLogin(reason = 'session-expired') {
  await logoutAdminSession()
  if (typeof window !== 'undefined') {
    window.location.replace(`/login?reason=${encodeURIComponent(reason)}`)
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
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  })

  const data = await parseJsonSafely(response)

  if (!response.ok) {
    if (response.status === 401 && options?.redirectOnUnauthorized) {
      await redirectToLogin('session-expired')
    }

    throw new HttpError(getMessage(data, 'Request failed.'), response.status, data)
  }

  return data as T
}

export function publicJson<T>(input: string, init?: RequestInit) {
  return requestJson<T>(input, init)
}

export function adminJson<T>(input: string, init?: RequestInit) {
  return requestJson<T>(input, init, { redirectOnUnauthorized: true })
}

export async function loginAdmin(email: string, password: string) {
  return requestJson<{ message: string; admin: { email: string } }>(
    '/api/admin/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  )
}

// export async function checkAdminSession() {
//   try {
//     await adminJson('/api/admin/org', { method: 'GET' })
//     return true
//   } catch (error) {
//     if (error instanceof HttpError && error.status === 401) {
//       return false
//     }
//     throw error
//   }
// }


export async function checkAdminSession() {
  try {
    const response = await fetch('/api/admin/org', {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
    })

    if (response.ok) {
      return true
    }

    if (response.status === 401) {
      return false
    }

    const data = await response.json().catch(() => null)
    throw new HttpError(
      typeof data?.message === 'string' ? data.message : 'Session check failed.',
      response.status,
      data
    )
  } catch (error) {
    throw error
  }
}

export async function createSignedUpload(folder: string, file: File) {
  return adminJson<{ message: string; data: { bucket: string; path: string; token: string } }>(
    '/api/admin/uploads/presign',
    {
      method: 'POST',
      body: JSON.stringify({
        folder,
        fileName: file.name,
        contentType: file.type,
      }),
    }
  )
}

export async function uploadFileWithPresign(folder: string, file: File) {
  const presign = await createSignedUpload(folder, file)
  const supabase = createClient()

  const { bucket, path, token } = presign.data

  const { error } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(path, token, file, {
      contentType: file.type,
    })

  if (error) {
    throw new Error(error.message)
  }

  return path
}