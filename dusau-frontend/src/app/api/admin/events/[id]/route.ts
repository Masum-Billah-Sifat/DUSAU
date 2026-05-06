import { makeEventItemHandlers } from '@/lib/api/event-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeEventItemHandlers();

export const GET = handlers.GET;
export const PATCH = handlers.PATCH;