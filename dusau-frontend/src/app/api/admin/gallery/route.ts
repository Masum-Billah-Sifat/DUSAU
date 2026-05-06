import { makeCollectionRootHandlers } from '@/lib/api/collection-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCollectionRootHandlers('gallery');

export const GET = handlers.GET;
export const POST = handlers.POST;