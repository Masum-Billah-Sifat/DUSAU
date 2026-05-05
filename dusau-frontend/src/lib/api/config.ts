export const ADMIN_SESSION_HOURS = 3;
export const ADMIN_SESSION_SECONDS = ADMIN_SESSION_HOURS * 60 * 60;

export const ADMIN_COOKIE_NAME =
  process.env.NODE_ENV === 'production' ? '__Host-dusau_admin' : 'dusau_admin';

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseUrl(): string {
  return requiredEnv('NEXT_PUBLIC_SUPABASE_URL');
}

export function getSupabaseServiceKey(): string {
  return requiredEnv('SUPABASE_SECRET_KEY');
}

export function getJwtSecret(): string {
  return requiredEnv('JWT_SECRET');
}

export function getSupabaseStorageBucket(): string {
  return requiredEnv('SUPABASE_STORAGE_BUCKET');
}