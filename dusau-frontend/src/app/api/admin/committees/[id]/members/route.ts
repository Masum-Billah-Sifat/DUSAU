import { makeCommitteeMembersRootHandlers } from '@/lib/api/committee-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCommitteeMembersRootHandlers();

export const GET = handlers.GET;
export const POST = handlers.POST;