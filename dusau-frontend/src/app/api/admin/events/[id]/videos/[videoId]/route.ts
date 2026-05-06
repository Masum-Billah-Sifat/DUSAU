import { makeEventVideoItemHandlers } from '@/lib/api/event-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeEventVideoItemHandlers();

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;