import { makeCommitteeMemberArchiveHandler } from '@/lib/api/committee-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCommitteeMemberArchiveHandler();

export const PATCH = handlers.PATCH;