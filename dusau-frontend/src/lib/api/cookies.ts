import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_SECONDS } from './config';

const isProduction = process.env.NODE_ENV === 'production';

export function setAdminCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_SECONDS,
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
