import { makeEventImagesReorderHandler } from '@/lib/api/event-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeEventImagesReorderHandler();

export const PATCH = handlers.PATCH;