import { publicOrganization } from '@/lib/api/admin';
import { ok, serverError } from '@/lib/api/http';
import { supabaseAdmin } from '@/lib/api/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('organizations')
      .select('id, public_email, public_phone, cover_image_path, cover_title, cover_description, admin_email, admin_password_hash, created_at, updated_at')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;

    return ok({
      ok: true,
      organization: data ? publicOrganization(data) : null,
    });
  } catch (error) {
    return serverError(error);
  }
}
