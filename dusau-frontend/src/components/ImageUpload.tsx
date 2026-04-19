'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const supabase = createClient()
    setUploading(true)
    setMessage('')
    setImageUrl(null)

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `committee/${fileName}`

    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    console.log('UPLOAD DATA:', data)
    console.log('UPLOAD ERROR:', error)

    if (error) {
      setMessage(error.message)
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    setImageUrl(publicUrlData.publicUrl)
    setMessage('Upload successful')
    setUploading(false)
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p>Uploading...</p>}
      {message && <p>{message}</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" width={200} />}
    </div>
  )
}