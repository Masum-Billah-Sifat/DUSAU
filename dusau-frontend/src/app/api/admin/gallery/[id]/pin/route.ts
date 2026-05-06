import { makeCollectionPinHandler } from '@/lib/api/collection-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCollectionPinHandler('gallery');

export const PATCH = handlers.PATCH;