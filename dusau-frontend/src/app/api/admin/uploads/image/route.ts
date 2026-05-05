import { randomUUID } from 'crypto';
import { ensureAdmin } from '@/lib/api/admin';
import { getSupabaseStorageBucket } from '@/lib/api/config';
import { badRequest, created, serverError } from '@/lib/api/http';
import { supabaseAdmin } from '@/lib/api/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Map<string, string>([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

export async function POST(request: Request) {
  try {
    const auth = await ensureAdmin();
    if (!auth.ok) return auth.response;

    const formData = await request.formData();
    const image = formData.get('image');

    if (!(image instanceof File)) {
      return badRequest('Image file is required.', 'IMAGE_REQUIRED');
    }

    if (image.size <= 0) {
      return badRequest('Image file is empty.', 'EMPTY_IMAGE');
    }

    if (image.size > MAX_IMAGE_SIZE_BYTES) {
      return badRequest('Image must be 4MB or smaller.', 'IMAGE_TOO_LARGE');
    }

    const extension = ALLOWED_IMAGE_TYPES.get(image.type);

    if (!extension) {
      return badRequest('Only JPG, PNG, and WEBP images are allowed.', 'INVALID_IMAGE_TYPE');
    }

    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const storagePath = `uploads/images/${year}/${month}/${randomUUID()}.${extension}`;
    const buffer = Buffer.from(await image.arrayBuffer());

    const bucket = getSupabaseStorageBucket();

    const { error } = await supabaseAdmin.storage.from(bucket).upload(storagePath, buffer, {
      contentType: image.type,
      cacheControl: '31536000',
      upsert: false,
    });

    if (error) throw error;

    const { data: publicUrlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath);

    return created({
      ok: true,
      image: {
        path: storagePath,
        public_url: publicUrlData.publicUrl,
      },
    });
  } catch (error) {
    return serverError(error);
  }
}