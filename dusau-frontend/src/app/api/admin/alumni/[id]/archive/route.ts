import { makeCollectionArchiveHandler } from '@/lib/api/collection-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCollectionArchiveHandler('alumni');

export const PATCH = handlers.PATCH;