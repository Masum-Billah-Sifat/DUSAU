import { NextResponse } from 'next/server'
import { clearAdminSessionCookie } from '@/lib/auth/admin-session'

export const runtime = 'nodejs'

export async function POST() {
  try {
    await clearAdminSessionCookie()

    return NextResponse.json({
      message: 'Logged out successfully.',
    })
  } catch (error) {
    console.error('Admin logout error:', error)

    return NextResponse.json(
      { message: 'Something went wrong while logging out.' },
      { status: 500 }
    )
  }
}