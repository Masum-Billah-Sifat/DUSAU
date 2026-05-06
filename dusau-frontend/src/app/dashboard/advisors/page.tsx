'use client';

import { CollectionManager } from '@/components/admin/collection-manager';

export default function AdvisorsPage() {
  return (
    <CollectionManager
      title="Advisors"
      description="Manage advisors, pinned advisors, archived advisors, and public display order."
      apiBase="/api/admin/advisors"
      listKey="advisors"
      itemKey="advisor"
      getItemTitle={(item) => String(item.name || 'Untitled advisor')}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'profile_image_path', label: 'Profile image', type: 'image', required: true },
        { name: 'workplace', label: 'Workplace', type: 'text', required: true },
        { name: 'position_at_workplace', label: 'Position at workplace', type: 'text', required: true },
        { name: 'short_quote', label: 'Short quote', type: 'textarea' },
      ]}
    />
  );
}