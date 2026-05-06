import { makeEventVideosReorderHandler } from '@/lib/api/event-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeEventVideosReorderHandler();

export const PATCH = handlers.PATCH;