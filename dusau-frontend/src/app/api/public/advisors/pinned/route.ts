import { makePublicAdvisorHandlers } from '@/lib/api/public-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makePublicAdvisorHandlers('pinned');

export const GET = handlers.GET;