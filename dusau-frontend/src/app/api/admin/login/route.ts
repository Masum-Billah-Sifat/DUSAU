import { NextResponse } from 'next/server'
import {
  createAdminAccessToken,
  isValidAdminCredentials,
  setAdminSessionCookie,
} from '@/lib/auth/admin-session'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const email = typeof body?.email === 'string' ? body.email : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      )
    }

    const isValid = isValidAdminCredentials(email, password)

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const token = await createAdminAccessToken(email)
    await setAdminSessionCookie(token)

    return NextResponse.json({
      message: 'Login successful.',
      admin: {
        email: email.trim().toLowerCase(),
      },
      expiresInSeconds: 60 * 60,
    })
  } catch (error) {
    console.error('Admin login error:', error)

    return NextResponse.json(
      { message: 'Something went wrong while logging in.' },
      { status: 500 }
    )
  }
}