const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'media'

export function toMediaUrl(path?: string | null) {
  if (!path) return '/placeholder.svg'

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const cleanPath = path.replace(/^\/+/, '')

  if (!SUPABASE_URL) {
    return `/${cleanPath}`
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${cleanPath}`
}

export function toYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (
      parsed.hostname === 'youtube.com' ||
      parsed.hostname === 'www.youtube.com' ||
      parsed.hostname === 'm.youtube.com'
    ) {
      const videoId = parsed.searchParams.get('v')

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }

      if (parsed.pathname.startsWith('/embed/')) {
        return url
      }
    }

    return null
  } catch {
    return null
  }
}

export function formatDisplayDate(date: string) {
  if (!date) return ''

  try {
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(`${date}T00:00:00`))
  } catch {
    return date
  }
}