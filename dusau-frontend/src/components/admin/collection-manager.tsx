'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { adminJson } from '@/lib/admin/api';
import { AdminButton, SessionSelect, TextInput, TextareaInput } from './form-fields';
import { ImageUploadField } from './image-upload-field';
import { StatusBadge } from './status-badge';

type FieldType = 'text' | 'textarea' | 'image' | 'session';

export type CollectionField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
};

type CollectionItem = {
  id: string;
  is_archived: boolean;
  is_pinned: boolean;
  sort_order: number;
  pinned_sort_order: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

type CollectionManagerProps = {
  title: string;
  description: string;
  apiBase: string;
  listKey: string;
  itemKey: string;
  fields: CollectionField[];
  getItemTitle: (item: CollectionItem) => string;
};

function makeEmptyForm(fields: CollectionField[]) {
  return fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {});
}

function itemToForm(item: CollectionItem, fields: CollectionField[]) {
  return fields.reduce<Record<string, string>>((acc, field) => {
    const value = item[field.name];
    acc[field.name] = typeof value === 'string' ? value : '';
    return acc;
  }, {});
}

function moveItem(items: CollectionItem[], id: string, direction: 'up' | 'down') {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items;

  const nextIndex = direction === 'up' ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= items.length) return items;

  const copy = [...items];
  const temp = copy[index];
  copy[index] = copy[nextIndex];
  copy[nextIndex] = temp;

  return copy;
}

export function CollectionManager({
  title,
  description,
  apiBase,
  listKey,
  itemKey,
  fields,
  getItemTitle,
}: CollectionManagerProps) {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [form, setForm] = useState<Record<string, string>>(() => makeEmptyForm(fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const pinnedItems = useMemo(
    () =>
      items
        .filter((item) => item.is_pinned && !item.is_archived)
        .sort((a, b) => (a.pinned_sort_order || 0) - (b.pinned_sort_order || 0)),
    [items],
  );

  async function loadItems() {
    try {
      const data = await adminJson<Record<string, CollectionItem[]>>(apiBase);
      setItems(data[listKey] || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : `Could not load ${title}.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  function resetForm() {
    setForm(makeEmptyForm(fields));
    setEditingId(null);
  }

  function startEdit(item: CollectionItem) {
    setEditingId(item.id);
    setForm(itemToForm(item, fields));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const url = editingId ? `${apiBase}/${editingId}` : apiBase;
      const method = editingId ? 'PATCH' : 'POST';

      await adminJson(url, {
        method,
        body: JSON.stringify(form),
      });

      resetForm();
      await loadItems();
      setNotice(editingId ? `${title} item updated.` : `${title} item created.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleArchive(item: CollectionItem) {
    try {
      await adminJson(`${apiBase}/${item.id}/archive`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_archived: !item.is_archived,
        }),
      });

      await loadItems();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Archive update failed.');
    }
  }

  async function togglePin(item: CollectionItem) {
    try {
      await adminJson(`${apiBase}/${item.id}/pin`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_pinned: !item.is_pinned,
        }),
      });

      await loadItems();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Pin update failed.');
    }
  }

  async function saveNormalOrder(nextItems: CollectionItem[]) {
    setItems(nextItems);

    try {
      const data = await adminJson<Record<string, CollectionItem[]>>(`${apiBase}/reorder`, {
        method: 'PATCH',
        body: JSON.stringify({
          ids: nextItems.map((item) => item.id),
        }),
      });

      setItems(data[listKey] || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Reorder failed.');
      await loadItems();
    }
  }

  async function savePinnedOrder(nextPinnedItems: CollectionItem[]) {
    const nextPinnedIds = nextPinnedItems.map((item) => item.id);

    try {
      const data = await adminJson<Record<string, CollectionItem[]>>(`${apiBase}/reorder-pinned`, {
        method: 'PATCH',
        body: JSON.stringify({
          ids: nextPinnedIds,
        }),
      });

      setItems(data[listKey] || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Pinned reorder failed.');
      await loadItems();
    }
  }

  function renderField(field: CollectionField) {
    const value = form[field.name] || '';

    if (field.type === 'textarea') {
      return (
        <TextareaInput
          key={field.name}
          label={field.label}
          value={value}
          required={field.required}
          onChange={(nextValue) => setForm({ ...form, [field.name]: nextValue })}
        />
      );
    }

    if (field.type === 'image') {
      return (
        <ImageUploadField
          key={field.name}
          label={field.label}
          value={value}
          onChange={(nextValue) => setForm({ ...form, [field.name]: nextValue })}
        />
      );
    }

    if (field.type === 'session') {
      return (
        <SessionSelect
          key={field.name}
          label={field.label}
          value={value}
          required={field.required}
          onChange={(nextValue) => setForm({ ...form, [field.name]: nextValue })}
        />
      );
    }

    return (
      <TextInput
        key={field.name}
        label={field.label}
        value={value}
        required={field.required}
        onChange={(nextValue) => setForm({ ...form, [field.name]: nextValue })}
      />
    );
  }

  if (loading) {
    return <p className="text-sm text-slate-300">Loading {title.toLowerCase()}...</p>;
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          {notice}
        </div>
      )}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-slate-400">{description}</p>

        <form onSubmit={submitForm} className="mt-6 grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.name}
              className={field.type === 'textarea' || field.type === 'image' ? 'md:col-span-2' : ''}
            >
              {renderField(field)}
            </div>
          ))}

          <div className="flex gap-3 md:col-span-2">
            <AdminButton type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update item' : 'Create item'}
            </AdminButton>

            {editingId && (
              <AdminButton variant="secondary" onClick={resetForm}>
                Cancel edit
              </AdminButton>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Pinned order</h2>
            <p className="mt-1 text-sm text-slate-400">Pinned items shown publicly first.</p>
          </div>

          <StatusBadge tone="blue">{pinnedItems.length}/10 pinned</StatusBadge>
        </div>

        <div className="mt-5 space-y-3">
          {pinnedItems.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-400">
              No pinned items yet.
            </p>
          )}

          {pinnedItems.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{getItemTitle(item)}</p>
                <p className="mt-1 text-xs text-slate-500">Pinned position: {index + 1}</p>
              </div>

              <div className="flex gap-2">
                <AdminButton
                  variant="secondary"
                  disabled={index === 0}
                  onClick={() => savePinnedOrder(moveItem(pinnedItems, item.id, 'up'))}
                >
                  Up
                </AdminButton>

                <AdminButton
                  variant="secondary"
                  disabled={index === pinnedItems.length - 1}
                  onClick={() => savePinnedOrder(moveItem(pinnedItems, item.id, 'down'))}
                >
                  Down
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold">All items</h2>
        <p className="mt-1 text-sm text-slate-400">
          Admin can edit, archive, pin, unpin, and reorder everything here.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <div className="hidden grid-cols-[1fr_auto] border-b border-white/10 bg-slate-900 px-4 py-3 text-xs uppercase tracking-wider text-slate-400 md:grid">
            <span>Item</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-white/10">
            {items.length === 0 && (
              <p className="p-4 text-sm text-slate-400">No items yet.</p>
            )}

            {items.map((item, index) => (
              <div key={item.id} className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{getItemTitle(item)}</h3>

                    {item.is_pinned && <StatusBadge tone="green">Pinned</StatusBadge>}
                    {item.is_archived && <StatusBadge tone="red">Archived</StatusBadge>}
                  </div>

                  <p className="mt-1 break-all text-xs text-slate-500">ID: {item.id}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AdminButton variant="secondary" disabled={index === 0} onClick={() => saveNormalOrder(moveItem(items, item.id, 'up'))}>
                    Up
                  </AdminButton>

                  <AdminButton variant="secondary" disabled={index === items.length - 1} onClick={() => saveNormalOrder(moveItem(items, item.id, 'down'))}>
                    Down
                  </AdminButton>

                  <AdminButton variant="secondary" onClick={() => startEdit(item)}>
                    Edit
                  </AdminButton>

                  <AdminButton variant="secondary" onClick={() => togglePin(item)} disabled={item.is_archived}>
                    {item.is_pinned ? 'Unpin' : 'Pin'}
                  </AdminButton>

                  <AdminButton variant={item.is_archived ? 'secondary' : 'danger'} onClick={() => toggleArchive(item)}>
                    {item.is_archived ? 'Unarchive' : 'Archive'}
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}