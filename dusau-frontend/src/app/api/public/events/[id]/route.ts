import { makePublicEventDetailsHandler } from '@/lib/api/public-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makePublicEventDetailsHandler();

export const GET = handlers.GET;