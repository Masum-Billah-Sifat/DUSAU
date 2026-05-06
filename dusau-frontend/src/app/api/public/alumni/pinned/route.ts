import { makePublicAlumniHandlers } from '@/lib/api/public-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makePublicAlumniHandlers('pinned');

export const GET = handlers.GET;