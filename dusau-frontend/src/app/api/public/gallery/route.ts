import { makePublicGalleryHandlers } from '@/lib/api/public-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makePublicGalleryHandlers('all');

export const GET = handlers.GET;