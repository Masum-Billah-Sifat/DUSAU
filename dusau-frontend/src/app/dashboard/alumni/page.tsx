'use client';

import { CollectionManager } from '@/components/admin/collection-manager';

export default function AlumniPage() {
  return (
    <CollectionManager
      title="Alumni"
      description="Manage alumni profiles, pinned alumni, archived alumni, and public display order."
      apiBase="/api/admin/alumni"
      listKey="alumni"
      itemKey="alumni"
      getItemTitle={(item) => String(item.name || 'Untitled alumni')}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'profile_image_path', label: 'Profile image', type: 'image', required: true },
        { name: 'department', label: 'Department', type: 'text', required: true },
        { name: 'latest_dusau_position', label: 'Latest DUSAU position', type: 'text', required: true },
        { name: 'session', label: 'Session', type: 'session', required: true },
        { name: 'short_quote', label: 'Short quote', type: 'textarea' },
        { name: 'current_company', label: 'Current company', type: 'text' },
        { name: 'current_company_position', label: 'Current company position', type: 'text' },
        { name: 'workplace', label: 'Workplace', type: 'text' },
        { name: 'workplace_position', label: 'Workplace position', type: 'text' },
      ]}
    />
  );
}