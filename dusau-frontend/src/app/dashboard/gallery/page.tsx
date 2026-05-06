'use client';

import { CollectionManager } from '@/components/admin/collection-manager';

export default function GalleryPage() {
  return (
    <CollectionManager
      title="Gallery"
      description="Manage gallery images, pinned gallery items, archived gallery items, and public display order."
      apiBase="/api/admin/gallery"
      listKey="gallery_items"
      itemKey="gallery_item"
      getItemTitle={(item) => String(item.title || 'Untitled gallery item')}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'image_path', label: 'Gallery image', type: 'image', required: true },
      ]}
    />
  );
}