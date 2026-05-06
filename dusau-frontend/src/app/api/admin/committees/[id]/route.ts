import { makeCommitteeItemHandlers } from '@/lib/api/committee-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCommitteeItemHandlers();

export const GET = handlers.GET;
export const PATCH = handlers.PATCH;