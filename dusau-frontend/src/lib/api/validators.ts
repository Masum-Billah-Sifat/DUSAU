import { NextRequest } from 'next/server';

export async function parseJsonBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function requireString(body: Record<string, unknown>, key: string) {
  const value = asString(body[key]);
  if (!value) {
    throw new Error(`${key} is required.`);
  }
  return value;
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function pickOrganizationMetadata(body: Record<string, unknown>) {
  return {
    public_email: requireString(body, 'public_email'),
    public_phone: requireString(body, 'public_phone'),
    cover_image_path: requireString(body, 'cover_image_path'),
    cover_title: requireString(body, 'cover_title'),
    cover_description: requireString(body, 'cover_description'),
  };
}
