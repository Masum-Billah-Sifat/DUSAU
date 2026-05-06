import { makeEventArchiveHandler } from '@/lib/api/event-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeEventArchiveHandler();

export const PATCH = handlers.PATCH;