import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from './config';
import { clearAdminCookie } from './cookies';
import { unauthorized } from './http';
import { verifyAdminJwt } from './jwt';
import { supabaseAdmin } from './supabase';

export type OrganizationRow = {
  id: number;
  public_email: string;
  public_phone: string;
  cover_image_path: string;
  cover_title: string;
  cover_description: string;
  admin_email: string;
  admin_password_hash: string;
  created_at: string;
  updated_at: string;
};

export type AdminSessionRow = {
  id: string;
  organization_id: number;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
  user_agent: string | null;
  ip_address: string | null;
};

export type AdminAuth = {
  session: AdminSessionRow;
  organization: OrganizationRow;
};

function unauthorizedWithClearedCookie(message = 'Please login again.') {
  const response = unauthorized(message);
  clearAdminCookie(response);
  return response;
}

export async function ensureAdmin(): Promise<
  | { ok: true; auth: AdminAuth }
  | { ok: false; response: NextResponse }
> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return { ok: false, response: unauthorized('Please login.') };
  }

  try {
    const payload = await verifyAdminJwt(token);

    const { data: session, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .eq('id', payload.sessionId)
      .eq('organization_id', payload.organizationId)
      .maybeSingle();

    if (sessionError) throw sessionError;

    if (!session) {
      return { ok: false, response: unauthorizedWithClearedCookie('Session not found. Please login again.') };
    }

    if (session.revoked_at) {
      return { ok: false, response: unauthorizedWithClearedCookie('Session was logged out. Please login again.') };
    }

    if (new Date(session.expires_at).getTime() <= Date.now()) {
      return { ok: false, response: unauthorizedWithClearedCookie('Session expired. Please login again.') };
    }

    const { data: organization, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('*')
      .eq('id', payload.organizationId)
      .maybeSingle();

    if (orgError) throw orgError;

    if (!organization) {
      return { ok: false, response: unauthorizedWithClearedCookie('Admin organization not found.') };
    }

    return {
      ok: true,
      auth: {
        session: session as AdminSessionRow,
        organization: organization as OrganizationRow,
      },
    };
  } catch {
    return { ok: false, response: unauthorizedWithClearedCookie('Invalid or expired login. Please login again.') };
  }
}

export function publicOrganization(organization: OrganizationRow) {
  return {
    public_email: organization.public_email,
    public_phone: organization.public_phone,
    cover_image_path: organization.cover_image_path,
    cover_title: organization.cover_title,
    cover_description: organization.cover_description,
  };
}
