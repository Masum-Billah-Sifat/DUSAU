'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { AdminButton, TextInput, TextareaInput } from '@/components/admin/form-fields';
import { adminJson } from '@/lib/admin/api';

type Organization = {
  public_email: string;
  public_phone: string;
  cover_image_path: string;
  cover_title: string;
  cover_description: string;
};

type OrganizationResponse = {
  ok: boolean;
  organization: Organization;
};

const emptyOrganization: Organization = {
  public_email: '',
  public_phone: '',
  cover_image_path: '',
  cover_title: '',
  cover_description: '',
};

export default function OrganizationPage() {
  const [org, setOrg] = useState<Organization>(emptyOrganization);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrganization() {
      try {
        const data = await adminJson<OrganizationResponse>('/api/admin/organization');
        setOrg(data.organization);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : 'Could not load organization.');
      } finally {
        setLoading(false);
      }
    }

    loadOrganization();
  }, []);

  async function saveOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const data = await adminJson<OrganizationResponse>('/api/admin/organization', {
        method: 'PATCH',
        body: JSON.stringify(org),
      });

      setOrg(data.organization);
      setNotice('Organization updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update organization.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-300">Loading organization...</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {notice && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          {notice}
        </div>
      )}

      <form onSubmit={saveOrganization} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h1 className="text-2xl font-bold">Organization metadata</h1>
        <p className="mt-2 text-sm text-slate-400">
          These values are shown publicly on the website.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <TextInput
            label="Public email"
            type="email"
            value={org.public_email}
            onChange={(value) => setOrg({ ...org, public_email: value })}
            required
          />

          <TextInput
            label="Public phone"
            value={org.public_phone}
            onChange={(value) => setOrg({ ...org, public_phone: value })}
            required
          />

          <div className="md:col-span-2">
            <ImageUploadField
              label="Cover image"
              value={org.cover_image_path}
              onChange={(value) => setOrg({ ...org, cover_image_path: value })}
            />
          </div>

          <div className="md:col-span-2">
            <TextInput
              label="Cover title"
              value={org.cover_title}
              onChange={(value) => setOrg({ ...org, cover_title: value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <TextareaInput
              label="Cover description"
              value={org.cover_description}
              onChange={(value) => setOrg({ ...org, cover_description: value })}
              required
              rows={5}
            />
          </div>
        </div>

        <div className="mt-6">
          <AdminButton type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save organization'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}