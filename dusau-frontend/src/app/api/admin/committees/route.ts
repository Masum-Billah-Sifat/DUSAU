import { makeCommitteeRootHandlers } from '@/lib/api/committee-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCommitteeRootHandlers();

export const GET = handlers.GET;
export const POST = handlers.POST;