export type PublicOrganization = {
  public_email: string
  public_phone: string
  cover_image_path: string
  cover_title: string
  cover_description: string
}

export type PublicEventSummary = {
  id: string
  title: string
  description: string
  event_date: string
  cover_image_path: string
}

export type PublicEventDetails = {
  id: string
  title: string
  description: string
  event_date: string
  category: string
  location_tags: string[]
  cover_image_path: string
}

export type PublicEventImage = {
  id: string
  event_id: string
  image_path: string
  sort_order: number
}

export type PublicEventVideo = {
  id: string
  event_id: string
  youtube_url: string
  sort_order: number
}

export type PublicCommittee = {
  id: string
  from_year: string
  to_year: string
  summary: string
}

export type PublicCommitteeMember = {
  id: string
  committee_id: string
  name: string
  profile_image_path: string
  department: string
  position: string
  session: string
}

export type PublicAlumni = {
  id: string
  name: string
  profile_image_path: string
  department: string
  latest_dusau_position: string
  session: string
  short_quote: string | null
  current_company: string | null
  current_company_position: string | null
  workplace: string | null
  workplace_position: string | null
}

export type PublicAdvisor = {
  id: string
  name: string
  profile_image_path: string
  workplace: string
  position_at_workplace: string
  short_quote: string | null
}

export type PublicGalleryItem = {
  id: string
  title: string
  description: string
  image_path: string
}

async function publicJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: 'no-store',
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.')
  }

  return data as T
}

export async function getPublicOrganization() {
  return publicJson<{
    ok: boolean
    organization: PublicOrganization
  }>('/api/public/organization')
}

export async function getPinnedEvents() {
  return publicJson<{
    ok: boolean
    events: PublicEventSummary[]
  }>('/api/public/events/pinned')
}

export async function getAllEvents() {
  return publicJson<{
    ok: boolean
    events: PublicEventSummary[]
  }>('/api/public/events')
}

export async function getPublicEventDetails(id: string) {
  return publicJson<{
    ok: boolean
    event: PublicEventDetails
    images: PublicEventImage[]
    videos: PublicEventVideo[]
  }>(`/api/public/events/${id}`)
}

export async function getPinnedCommitteeWithPinnedMembers() {
  return publicJson<{
    ok: boolean
    committee: PublicCommittee | null
    members: PublicCommitteeMember[]
  }>('/api/public/committees/pinned-members')
}

export async function getPinnedCommitteeWithAllMembers() {
  return publicJson<{
    ok: boolean
    committee: PublicCommittee | null
    members: PublicCommitteeMember[]
  }>('/api/public/committees/all-members')
}

export async function getPinnedAlumni() {
  return publicJson<{
    ok: boolean
    alumni: PublicAlumni[]
  }>('/api/public/alumni/pinned')
}

export async function getAllAlumni() {
  return publicJson<{
    ok: boolean
    alumni: PublicAlumni[]
  }>('/api/public/alumni')
}

export async function getPinnedAdvisors() {
  return publicJson<{
    ok: boolean
    advisors: PublicAdvisor[]
  }>('/api/public/advisors/pinned')
}

export async function getAllAdvisors() {
  return publicJson<{
    ok: boolean
    advisors: PublicAdvisor[]
  }>('/api/public/advisors')
}

export async function getPinnedGallery() {
  return publicJson<{
    ok: boolean
    gallery_items: PublicGalleryItem[]
  }>('/api/public/gallery/pinned')
}

export async function getAllGallery() {
  return publicJson<{
    ok: boolean
    gallery_items: PublicGalleryItem[]
  }>('/api/public/gallery')
}