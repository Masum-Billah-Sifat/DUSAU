import { makePublicAlumniHandlers } from '@/lib/api/public-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makePublicAlumniHandlers('all');

export const GET = handlers.GET;