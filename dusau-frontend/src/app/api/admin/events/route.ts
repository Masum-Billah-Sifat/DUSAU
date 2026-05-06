import { makeEventRootHandlers } from '@/lib/api/event-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeEventRootHandlers();

export const GET = handlers.GET;
export const POST = handlers.POST;