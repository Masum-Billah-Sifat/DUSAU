import { createClient } from '@supabase/supabase-js';
import { getSupabaseServiceKey, getSupabaseUrl } from './config';

export const supabaseAdmin = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function maybeSingle<T>(query: PromiseLike<{ data: T | null; error: unknown }>) {
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function runQuery<T>(query: PromiseLike<{ data: T; error: unknown }>) {
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
