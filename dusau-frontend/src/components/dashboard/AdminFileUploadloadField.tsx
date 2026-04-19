'use client'

import { useState } from 'react'
import { uploadFileWithPresign } from '@/lib/frontend/admin-api'

export default function AdminFileUploadField({
  label,
  folder,
  value,
  onChange,
}: {
  label: string
  folder: string
  value: string
  onChange: (value: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const path = await uploadFileWithPresign(folder, file)
      onChange(path)
      console.log('[upload] uploaded file path', path)
    } catch (err) {
      console.error('[upload] failed', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="grid gap-3">
      <label className="block text-sm text-slate-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Stored path will appear here"
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-400/50"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-white"
      />
      <p className="text-xs text-slate-400">{loading ? 'Uploading image...' : 'Choose an image to upload to Supabase Storage.'}</p>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  )
}