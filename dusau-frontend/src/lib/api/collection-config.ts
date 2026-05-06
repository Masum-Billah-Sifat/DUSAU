import {
  asNullableString,
  assertRecord,
  requireSessionYear,
  requireString,
} from './validators';

export type CollectionKey = 'alumni' | 'advisors' | 'gallery';

type CollectionConfig = {
  key: CollectionKey;
  table: string;
  responseKey: string;
  responseListKey: string;
  maxPinned: number;
  select: string;
  orderBy: string;
  createPayload: (body: Record<string, unknown>) => Record<string, unknown>;
  updatePayload: (body: Record<string, unknown>) => Record<string, unknown>;
};

function pickAlumniPayload(body: Record<string, unknown>) {
  return {
    name: requireString(body, 'name'),
    profile_image_path: requireString(body, 'profile_image_path'),
    department: requireString(body, 'department'),
    latest_dusau_position: requireString(body, 'latest_dusau_position'),
    session: requireSessionYear(body, 'session'),
    short_quote: asNullableString(body.short_quote),
    current_company: asNullableString(body.current_company),
    current_company_position: asNullableString(body.current_company_position),
    workplace: asNullableString(body.workplace),
    workplace_position: asNullableString(body.workplace_position),
  };
}

function pickAdvisorPayload(body: Record<string, unknown>) {
  return {
    name: requireString(body, 'name'),
    profile_image_path: requireString(body, 'profile_image_path'),
    workplace: requireString(body, 'workplace'),
    position_at_workplace: requireString(body, 'position_at_workplace'),
    short_quote: asNullableString(body.short_quote),
  };
}

function pickGalleryPayload(body: Record<string, unknown>) {
  return {
    title: requireString(body, 'title'),
    description: requireString(body, 'description'),
    image_path: requireString(body, 'image_path'),
  };
}

export const collectionConfigs: Record<CollectionKey, CollectionConfig> = {
  alumni: {
    key: 'alumni',
    table: 'alumni',
    responseKey: 'alumni',
    responseListKey: 'alumni',
    maxPinned: 10,
    select: '*',
    orderBy: 'sort_order',
    createPayload: pickAlumniPayload,
    updatePayload: pickAlumniPayload,
  },
  advisors: {
    key: 'advisors',
    table: 'advisors',
    responseKey: 'advisor',
    responseListKey: 'advisors',
    maxPinned: 10,
    select: '*',
    orderBy: 'sort_order',
    createPayload: pickAdvisorPayload,
    updatePayload: pickAdvisorPayload,
  },
  gallery: {
    key: 'gallery',
    table: 'gallery_items',
    responseKey: 'gallery_item',
    responseListKey: 'gallery_items',
    maxPinned: 10,
    select: '*',
    orderBy: 'sort_order',
    createPayload: pickGalleryPayload,
    updatePayload: pickGalleryPayload,
  },
};

export function getCollectionConfig(key: CollectionKey) {
  return collectionConfigs[key];
}

export function getBodyRecord(body: unknown) {
  return assertRecord(body);
}