import { makeCollectionArchiveHandler } from '@/lib/api/collection-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCollectionArchiveHandler('gallery');

export const PATCH = handlers.PATCH;