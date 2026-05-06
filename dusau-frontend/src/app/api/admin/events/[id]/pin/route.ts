import { makeEventPinHandler } from '@/lib/api/event-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeEventPinHandler();

export const PATCH = handlers.PATCH;