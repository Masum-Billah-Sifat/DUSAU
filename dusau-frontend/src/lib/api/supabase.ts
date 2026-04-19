import { supabaseAdmin } from '@/lib/supabase/admin'
import { serverError } from '@/lib/api/http'

export async function maybeSingle<T>(queryPromise: Promise<{ data: T | null; error: any }>) {
  const { data, error } = await queryPromise
  if (error) throw error
  return data
}

export async function many<T>(queryPromise: Promise<{ data: T[] | null; error: any }>) {
  const { data, error } = await queryPromise
  if (error) throw error
  return data ?? []
}

export async function runUpdate(queryPromise: Promise<{ data: any; error: any }>) {
  const { data, error } = await queryPromise
  if (error) throw error
  return data
}

export { supabaseAdmin, serverError }
