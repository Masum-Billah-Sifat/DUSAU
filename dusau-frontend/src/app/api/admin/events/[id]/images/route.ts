import { makeEventImagesRootHandlers } from '@/lib/api/event-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeEventImagesRootHandlers();

export const GET = handlers.GET;
export const POST = handlers.POST;