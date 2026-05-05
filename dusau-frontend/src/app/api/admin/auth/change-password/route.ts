import { NextRequest } from 'next/server';
import { ensureAdmin } from '@/lib/api/admin';
import { clearAdminCookie } from '@/lib/api/cookies';
import { badRequest, ok, serverError, unauthorized } from '@/lib/api/http';
import { hashPassword, verifyPassword } from '@/lib/api/password';
import { supabaseAdmin } from '@/lib/api/supabase';
import { asString, parseJsonBody } from '@/lib/api/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    const body = await parseJsonBody(request);
    if (!body || typeof body !== 'object') return badRequest('Invalid JSON body.');

    const currentPassword = asString((body as Record<string, unknown>).current_password);
    const newPassword = asString((body as Record<string, unknown>).new_password);

    if (!currentPassword || !newPassword) {
      return badRequest('Current password and new password are required.');
    }

    if (newPassword.length < 8) {
      return badRequest('New password must be at least 8 characters long.');
    }

    const passwordOk = await verifyPassword(currentPassword, auth.auth.organization.admin_password_hash);
    if (!passwordOk) return unauthorized('Current password is incorrect.');

    const newHash = await hashPassword(newPassword);

    const { error: orgError } = await supabaseAdmin
      .from('organizations')
      .update({ admin_password_hash: newHash })
      .eq('id', 1);

    if (orgError) throw orgError;

    const { error: sessionsError } = await supabaseAdmin
      .from('admin_sessions')
      .update({ revoked_at: new Date().toISOString() })
      .eq('organization_id', 1)
      .is('revoked_at', null);

    if (sessionsError) throw sessionsError;

    const response = ok({ ok: true, message: 'Password changed. Please login again.' });
    clearAdminCookie(response);
    return response;
  } catch (error) {
    return serverError(error);
  }
}
