import { NextResponse } from 'next/server'

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ data }, { status: 200, ...init })
}

export function created(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ data }, { status: 201, ...init })
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { message, ...(details !== undefined ? { details } : {}) },
    { status: 400 }
  )
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ message }, { status: 401 })
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ message }, { status: 404 })
}

export function serverError(message = 'Internal server error', details?: unknown) {
  return NextResponse.json(
    { message, ...(details !== undefined ? { details } : {}) },
    { status: 500 }
  )
}

export function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error'
}
