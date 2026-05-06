import { makeCommitteeMemberPinHandler } from '@/lib/api/committee-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCommitteeMemberPinHandler();

export const PATCH = handlers.PATCH;