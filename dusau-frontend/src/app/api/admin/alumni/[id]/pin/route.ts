import { makeCollectionPinHandler } from '@/lib/api/collection-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCollectionPinHandler('alumni');

export const PATCH = handlers.PATCH;