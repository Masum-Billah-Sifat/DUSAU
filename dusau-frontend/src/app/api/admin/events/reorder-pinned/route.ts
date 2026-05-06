import { makeEventReorderHandler } from '@/lib/api/event-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeEventReorderHandler('pinned');

export const PATCH = handlers.PATCH;