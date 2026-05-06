'use client';

import { ChangeEvent, useState } from 'react';
import { uploadAdminImage } from '@/lib/admin/api';

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (path: string) => void;
};

export function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const data = await uploadAdminImage(file);
      onChange(data.image.path);
      setMessage('Image uploaded.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={uploading}
        onChange={handleFileChange}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-slate-200 disabled:opacity-60"
      />

      <p className="mt-2 text-xs text-slate-400">
        {uploading ? 'Uploading...' : 'Allowed: JPG, PNG, WEBP. Max size depends on backend limit.'}
      </p>

      {value && (
        <p className="mt-2 break-all rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300">
          Current path: {value}
        </p>
      )}

      {message && <p className="mt-2 text-xs text-slate-300">{message}</p>}
    </label>
  );
}