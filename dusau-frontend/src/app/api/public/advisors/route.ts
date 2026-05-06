import { makePublicAdvisorHandlers } from '@/lib/api/public-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makePublicAdvisorHandlers('all');

export const GET = handlers.GET;