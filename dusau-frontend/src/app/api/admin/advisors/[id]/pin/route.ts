import { makeCollectionPinHandler } from '@/lib/api/collection-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCollectionPinHandler('advisors');

export const PATCH = handlers.PATCH;