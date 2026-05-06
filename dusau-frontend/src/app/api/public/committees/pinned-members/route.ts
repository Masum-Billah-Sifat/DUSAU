import { makePublicPinnedCommitteeHandler } from '@/lib/api/public-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makePublicPinnedCommitteeHandler('pinned-members');

export const GET = handlers.GET;