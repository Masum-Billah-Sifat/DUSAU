import { NextRequest } from 'next/server';
import { ensureAdmin, publicOrganization } from '@/lib/api/admin';
import { badRequest, ok, serverError } from '@/lib/api/http';
import { supabaseAdmin } from '@/lib/api/supabase';
import { parseJsonBody, pickOrganizationMetadata } from '@/lib/api/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    return ok({
      ok: true,
      organization: {
        ...publicOrganization(auth.auth.organization),
        admin_email: auth.auth.organization.admin_email,
        created_at: auth.auth.organization.created_at,
        updated_at: auth.auth.organization.updated_at,
      },
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    const body = await parseJsonBody(request);
    if (!body || typeof body !== 'object') return badRequest('Invalid JSON body.');

    const metadata = pickOrganizationMetadata(body as Record<string, unknown>);

    const { data, error } = await supabaseAdmin
      .from('organizations')
      .update(metadata)
      .eq('id', 1)
      .select('*')
      .single();

    if (error) throw error;

    return ok({
      ok: true,
      organization: {
        ...publicOrganization(data),
        admin_email: data.admin_email,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('is required.')) {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}
