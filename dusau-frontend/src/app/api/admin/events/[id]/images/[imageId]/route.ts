import { makeEventImageItemHandlers } from '@/lib/api/event-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeEventImageItemHandlers();

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;