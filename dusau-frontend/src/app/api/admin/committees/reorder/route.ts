import { makeCommitteeReorderHandler } from '@/lib/api/committee-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCommitteeReorderHandler();

export const PATCH = handlers.PATCH;