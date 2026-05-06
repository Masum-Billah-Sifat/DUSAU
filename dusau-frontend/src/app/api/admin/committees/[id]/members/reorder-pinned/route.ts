import { makeCommitteeMembersReorderHandler } from '@/lib/api/committee-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCommitteeMembersReorderHandler('pinned');

export const PATCH = handlers.PATCH;