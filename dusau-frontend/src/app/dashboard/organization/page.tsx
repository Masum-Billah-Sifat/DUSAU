'use client'

import { FormEvent, useEffect, useState } from 'react'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { AdminButton, TextInput, TextareaInput } from '@/components/admin/form-fields'
import { adminJson } from '@/lib/admin/api'
import { toMediaUrl } from '@/lib/public/media'

type Organization = {
  public_email: string
  public_phone: string
  cover_image_path: string
  cover_title: string
  cover_description: string
}

type OrganizationResponse = {
  ok: boolean
  organization: Organization
}

const emptyOrganization: Organization = {
  public_email: '',
  public_phone: '',
  cover_image_path: '',
  cover_title: '',
  cover_description: '',
}

function LoadingState() {
  return (
    <div className="max-w-5xl space-y-5">
      <div className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-6 shadow-sm">
        <div className="h-6 w-56 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="mt-6 h-64 animate-pulse rounded-[1.5rem] bg-[hsl(var(--app-bg-soft))]" />
      </div>
    </div>
  )
}

export default function OrganizationPage() {
  const [org, setOrg] = useState<Organization>(emptyOrganization)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadOrganization() {
      try {
        const data = await adminJson<OrganizationResponse>('/api/admin/organization')
        if (active) setOrg(data.organization)
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load organization.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadOrganization()

    return () => {
      active = false
    }
  }, [])

  async function saveOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)

    try {
      const data = await adminJson<OrganizationResponse>('/api/admin/organization', {
        method: 'PATCH',
        body: JSON.stringify(org),
      })

      setOrg(data.organization)
      setNotice('Organization updated successfully.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update organization.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="max-w-5xl space-y-6">
      {notice && (
        <div className="rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white p-4 text-sm font-semibold leading-6 text-[hsl(var(--text-main))] shadow-sm">
          {notice}
        </div>
      )}

      <form
        onSubmit={saveOrganization}
        className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl"
      >
        <div className="border-b border-[hsl(var(--border-soft))] bg-[hsl(var(--brand-soft))] p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
            Public Website
          </p>

          <h1 className="font-display mt-2 text-3xl font-black tracking-tight text-[hsl(var(--text-main))]">
            Organization metadata
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[hsl(var(--text-muted))]">
            These values are shown publicly on the website. Keep the cover title,
            description, contact details, and image professional.
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput
              label="Public email"
              type="email"
              value={org.public_email}
              onChange={(value) => setOrg({ ...org, public_email: value })}
              required
              placeholder="example@dusau.org"
            />

            <TextInput
              label="Public phone"
              value={org.public_phone}
              onChange={(value) => setOrg({ ...org, public_phone: value })}
              required
              placeholder="+880..."
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <ImageUploadField
                label="Cover image"
                value={org.cover_image_path}
                onChange={(value) => setOrg({ ...org, cover_image_path: value })}
              />

              <p className="mt-3 text-xs font-semibold leading-6 text-[hsl(var(--text-muted))]">
                Recommended: wide landscape image. This image appears in the public homepage hero.
              </p>
            </div>
          </div>

          <TextInput
            label="Cover title"
            value={org.cover_title}
            onChange={(value) => setOrg({ ...org, cover_title: value })}
            required
            placeholder="Dhaka University Students Association of Uttara"
          />

          <TextareaInput
            label="Cover description"
            value={org.cover_description}
            onChange={(value) => setOrg({ ...org, cover_description: value })}
            required
            rows={5}
            placeholder="Write a short professional description for the public homepage."
          />

          <div className="flex flex-col gap-3 border-t border-[hsl(var(--border-soft))] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-7 text-[hsl(var(--text-muted))]">
              Changes will be visible on the public website after saving.
            </p>

            <AdminButton type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save organization'}
            </AdminButton>
          </div>
        </div>
      </form>
    </div>
  )
}