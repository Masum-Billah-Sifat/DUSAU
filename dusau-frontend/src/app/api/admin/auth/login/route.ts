import { NextRequest } from 'next/server';
import { ADMIN_SESSION_SECONDS } from '@/lib/api/config';
import { setAdminCookie } from '@/lib/api/cookies';
import { badRequest, ok, serverError, unauthorized } from '@/lib/api/http';
import { signAdminJwt } from '@/lib/api/jwt';
import { verifyPassword } from '@/lib/api/password';
import { supabaseAdmin } from '@/lib/api/supabase';
import { asString, normalizeEmail, parseJsonBody } from '@/lib/api/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody(request);
    if (!body || typeof body !== 'object') return badRequest('Invalid JSON body.');

    const email = normalizeEmail(asString((body as Record<string, unknown>).email));
    const password = asString((body as Record<string, unknown>).password);

    if (!email || !password) return badRequest('Email and password are required.');

    const { data: organization, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (orgError) throw orgError;
    if (!organization) return unauthorized('Admin is not configured yet.');

    const adminEmail = normalizeEmail(organization.admin_email);
    if (email !== adminEmail) return unauthorized('Unauthorized.');

    const passwordOk = await verifyPassword(password, organization.admin_password_hash);
    if (!passwordOk) return unauthorized('Unauthorized.');

    const expiresAt = new Date(Date.now() + ADMIN_SESSION_SECONDS * 1000).toISOString();
    const userAgent = request.headers.get('user-agent');
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;

    const { data: session, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .insert({
        organization_id: 1,
        expires_at: expiresAt,
        user_agent: userAgent,
        ip_address: ipAddress,
      })
      .select('*')
      .single();

    if (sessionError) throw sessionError;

    const token = await signAdminJwt({ sessionId: session.id, organizationId: 1 });
    const response = ok({ ok: true, admin: { email: organization.admin_email } });
    setAdminCookie(response, token);
    return response;
  } catch (error) {
    return serverError(error);
  }
}
