import { makeCollectionReorderHandler } from '@/lib/api/collection-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCollectionReorderHandler('gallery', 'pinned');

export const PATCH = handlers.PATCH;