import { cookies } from 'next/headers'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

export const ADMIN_SESSION_COOKIE = 'dusau_admin_access_token'
const ADMIN_TOKEN_MAX_AGE_SECONDS = 60 * 60 // 1 hour

const encoder = new TextEncoder()

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('Missing JWT_SECRET')
  }

  return encoder.encode(secret)
}

function getAdminEnvCredentials() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD')
  }

  return { email, password }
}

export type AdminAccessTokenPayload = JWTPayload & {
  type: 'admin-access'
  email: string
}

export function isValidAdminCredentials(email: string, password: string) {
  const envCreds = getAdminEnvCredentials()

  return (
    email.trim().toLowerCase() === envCreds.email.trim().toLowerCase() &&
    password === envCreds.password
  )
}

export async function createAdminAccessToken(email: string) {
  return new SignJWT({
    type: 'admin-access',
    email: email.trim().toLowerCase(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('admin')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(getJwtSecret())
}

export async function verifyAdminAccessToken(
  token: string
): Promise<AdminAccessTokenPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    algorithms: ['HS256'],
  })

  if (
    payload.sub !== 'admin' ||
    payload.type !== 'admin-access' ||
    typeof payload.email !== 'string'
  ) {
    throw new Error('Invalid admin token')
  }

  return payload as AdminAccessTokenPayload
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies()

  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_TOKEN_MAX_AGE_SECONDS,
  })
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies()

  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export async function getAdminSessionToken() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null
}

export async function requireAdminSession() {
  const token = await getAdminSessionToken()

  if (!token) {
    throw new Error('Unauthorized')
  }

  try {
    return await verifyAdminAccessToken(token)
  } catch {
    throw new Error('Unauthorized')
  }
}