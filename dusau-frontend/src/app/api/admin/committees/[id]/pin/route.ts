import { makeCommitteePinHandler } from '@/lib/api/committee-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCommitteePinHandler();

export const PATCH = handlers.PATCH;