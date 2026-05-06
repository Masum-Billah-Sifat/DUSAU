// import { NextResponse } from 'next/server';

// export function json(data: unknown, status = 200) {
//   return NextResponse.json(data, {
//     status,
//     headers: {
//       'Cache-Control': 'no-store',
//     },
//   });
// }

// export function ok(data: unknown = { ok: true }) {
//   return json(data, 200);
// }

// export function created(data: unknown = { ok: true }) {
//   return json(data, 201);
// }

// export function badRequest(message = 'Bad request', code = 'BAD_REQUEST') {
//   return json({ ok: false, code, message }, 400);
// }

// export function unauthorized(message = 'Please login again.', code = 'UNAUTHORIZED') {
//   return json({ ok: false, code, message }, 401);
// }

// export function forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
//   return json({ ok: false, code, message }, 403);
// }

// export function serverError(error: unknown) {
//   console.error(error);
//   return json({ ok: false, code: 'SERVER_ERROR', message: 'Something went wrong.' }, 500);
// }

// export function toErrorMessage(error: unknown) {
//   return error instanceof Error ? error.message : 'Unknown error';
// }

import { NextResponse } from 'next/server';

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export function ok(data: unknown = { ok: true }) {
  return json(data, 200);
}

export function created(data: unknown = { ok: true }) {
  return json(data, 201);
}

export function badRequest(message = 'Bad request', code = 'BAD_REQUEST') {
  return json({ ok: false, code, message }, 400);
}

export function unauthorized(message = 'Please login again.', code = 'UNAUTHORIZED') {
  return json({ ok: false, code, message }, 401);
}

export function forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
  return json({ ok: false, code, message }, 403);
}

export function notFound(message = 'Not found', code = 'NOT_FOUND') {
  return json({ ok: false, code, message }, 404);
}

export function serverError(error: unknown) {
  console.error(error);
  return json({ ok: false, code: 'SERVER_ERROR', message: 'Something went wrong.' }, 500);
}

export function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}