import { ensureAdmin, publicOrganization } from '@/lib/api/admin';
import { ok, serverError } from '@/lib/api/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    return ok({
      ok: true,
      admin: {
        email: auth.auth.organization.admin_email,
        session_id: auth.auth.session.id,
        expires_at: auth.auth.session.expires_at,
      },
      organization: publicOrganization(auth.auth.organization),
    });
  } catch (error) {
    return serverError(error);
  }
}
