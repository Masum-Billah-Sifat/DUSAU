import { ensureAdmin } from '@/lib/api/admin';
import { clearAdminCookie } from '@/lib/api/cookies';
import { ok, serverError } from '@/lib/api/http';
import { supabaseAdmin } from '@/lib/api/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    const { error } = await supabaseAdmin
      .from('admin_sessions')
      .update({ revoked_at: new Date().toISOString() })
      .eq('organization_id', 1)
      .is('revoked_at', null);

    if (error) throw error;

    const response = ok({ ok: true });
    clearAdminCookie(response);
    return response;
  } catch (error) {
    return serverError(error);
  }
}
