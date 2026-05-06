import { makeCommitteeMemberItemHandlers } from '@/lib/api/committee-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCommitteeMemberItemHandlers();

export const GET = handlers.GET;
export const PATCH = handlers.PATCH;