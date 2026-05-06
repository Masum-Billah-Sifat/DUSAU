'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { uploadAdminImage } from '@/lib/admin/api'
import { toMediaUrl } from '@/lib/public/media'

type ImageUploadFieldProps = {
  label: string
  value: string
  onChange: (path: string) => void
}

export function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl)
      }
    }
  }, [localPreviewUrl])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl)
    }

    const previewUrl = URL.createObjectURL(file)
    setLocalPreviewUrl(previewUrl)

    setUploading(true)
    setMessage(null)

    try {
      const data = await uploadAdminImage(file)
      onChange(data.image.path)
      setMessage('Image uploaded successfully.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const previewSrc = localPreviewUrl || (value ? toMediaUrl(value) : '')

  return (
    <div className="block">
      <label className="block">
        <span className="text-sm font-bold text-[hsl(var(--text-main))]">
          {label}
        </span>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading}
          onChange={handleFileChange}
          className="mt-2 w-full rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] px-4 py-3 text-sm font-semibold text-[hsl(var(--text-main))] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[hsl(var(--brand))] file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-[hsl(var(--brand-hover))] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <p className="mt-2 text-xs font-semibold leading-6 text-[hsl(var(--text-muted))]">
        {uploading
          ? 'Uploading image...'
          : 'Allowed: JPG, PNG, WEBP. Use a clear, high-quality image.'}
      </p>

      {previewSrc && (
        <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white p-3 shadow-sm">
          <div className="relative overflow-hidden rounded-[1.1rem] bg-[hsl(var(--app-bg-soft))]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt={`${label} preview`}
              className="h-64 w-full object-cover"
            />
          </div>
        </div>
      )}

      {message && (
        <p
          className={`mt-3 rounded-2xl px-4 py-3 text-xs font-bold leading-6 ${
            message.toLowerCase().includes('failed') ||
            message.toLowerCase().includes('error')
              ? 'border border-red-200 bg-red-50 text-red-700'
              : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}