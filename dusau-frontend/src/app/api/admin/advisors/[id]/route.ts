import { makeCollectionItemHandlers } from '@/lib/api/collection-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCollectionItemHandlers('advisors');

export const GET = handlers.GET;
export const PATCH = handlers.PATCH;