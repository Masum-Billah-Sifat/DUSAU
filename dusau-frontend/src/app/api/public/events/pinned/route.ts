import { makePublicEventListHandlers } from '@/lib/api/public-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makePublicEventListHandlers('pinned');

export const GET = handlers.GET;