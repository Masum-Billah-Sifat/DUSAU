import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/admin-session'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
])

function sanitizeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-/]+|[-/]+$/g, '')
}

function getExtensionFromMimeType(contentType: string) {
  switch (contentType) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/avif':
      return 'avif'
    default:
      return ''
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession()

    const body = await request.json()

    const folder =
      typeof body?.folder === 'string' && body.folder.trim()
        ? body.folder
        : 'general'

    const fileName =
      typeof body?.fileName === 'string' ? body.fileName.trim() : ''

    const contentType =
      typeof body?.contentType === 'string' ? body.contentType.trim() : ''

    if (!fileName || !contentType) {
      return NextResponse.json(
        { message: 'fileName and contentType are required.' },
        { status: 400 }
      )
    }

    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      return NextResponse.json(
        { message: 'Unsupported image type.' },
        { status: 400 }
      )
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'dusau-media'
    const safeFolder = sanitizeSegment(folder)
    const extension = getExtensionFromMimeType(contentType)

    if (!extension) {
      return NextResponse.json(
        { message: 'Could not determine file extension.' },
        { status: 400 }
      )
    }

    const filePath = `${safeFolder}/${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(filePath)

    if (error || !data?.token) {
      console.error('Supabase presign error:', error)

      return NextResponse.json(
        { message: 'Could not create signed upload URL.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Signed upload created.',
      data: {
        bucket,
        path: filePath,
        token: data.token,
      },
    })
  } catch (error) {
    console.error('Presign upload error:', error)

    const message =
      error instanceof Error && error.message === 'Unauthorized'
        ? 'Unauthorized'
        : 'Something went wrong while creating upload URL.'

    const status =
      error instanceof Error && error.message === 'Unauthorized' ? 401 : 500

    return NextResponse.json({ message }, { status })
  }
}