export type Organization = {
  id: number
  email: string
  phone: string
  cover_image_path: string | null
  cover_title: string
  cover_description: string
}

export type Committee = {
  id: string
  from_year: number
  to_year: number
  summary: string | null
  is_archived: boolean
  is_pinned: boolean
  created_at?: string
  updated_at?: string
}

export type CommitteeMember = {
  id: string
  committee_id: string
  name: string
  profile_image_path: string | null
  session: string
  department: string
  position: string
  is_pinned: boolean
  sort_order: number
}

export type Alumni = {
  id: string
  name: string
  profile_image_path: string | null
  session: string
  department: string
  current_company: string | null
  current_position: string | null
  short_quote: string | null
  latest_dusau_position: string | null
  is_archived: boolean
  is_pinned: boolean
  sort_order: number
}

export type Advisor = {
  id: string
  name: string
  description: string
  profile_image_path: string | null
  is_archived: boolean
  is_pinned: boolean
  sort_order: number
}

export type EventItem = {
  id: string
  slug: string
  title: string
  description: string
  event_date: string
  category: string
  location_tags: string[]
  cover_image_path: string | null
  is_archived: boolean
  is_published: boolean
  show_on_homepage: boolean
  show_on_events_page: boolean
  sort_order_homepage: number
  sort_order_events_page: number
}

export type EventImage = {
  id: string
  event_id: string
  image_path: string
  alt_text: string | null
  sort_order: number
}

export type EventVideo = {
  id: string
  event_id: string
  youtube_url: string
  sort_order: number
}

export type MemberDirectoryItem = {
  id: string
  name: string
  session: string
  department: string
  blood_group: string | null
  profile_image_path: string | null
}

export type GalleryItem = {
  id: string
  title: string
  description: string
  image_path: string
  is_archived: boolean
  is_pinned: boolean
  sort_order: number
}