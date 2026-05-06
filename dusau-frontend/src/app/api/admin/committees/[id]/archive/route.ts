import { makeCommitteeArchiveHandler } from '@/lib/api/committee-handlers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handlers = makeCommitteeArchiveHandler();

export const PATCH = handlers.PATCH;