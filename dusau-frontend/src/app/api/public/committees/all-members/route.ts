import { makePublicPinnedCommitteeHandler } from '@/lib/api/public-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makePublicPinnedCommitteeHandler('all-members');

export const GET = handlers.GET;