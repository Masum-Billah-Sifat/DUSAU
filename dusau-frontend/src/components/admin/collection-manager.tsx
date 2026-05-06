"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { adminJson } from "@/lib/admin/api";
import { toMediaUrl } from "@/lib/public/media";
import {
  AdminButton,
  SessionSelect,
  TextInput,
  TextareaInput,
} from "./form-fields";
import { ImageUploadField } from "./image-upload-field";
import { StatusBadge } from "./status-badge";

type FieldType = "text" | "textarea" | "image" | "session";

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
    acc[field.name] = "";
    return acc;
  }, {});
}

function itemToForm(item: CollectionItem, fields: CollectionField[]) {
  return fields.reduce<Record<string, string>>((acc, field) => {
    const value = item[field.name];
    acc[field.name] = typeof value === "string" ? value : "";
    return acc;
  }, {});
}

function moveItem(
  items: CollectionItem[],
  id: string,
  direction: "up" | "down",
) {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items;

  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= items.length) return items;

  const copy = [...items];
  const temp = copy[index];
  copy[index] = copy[nextIndex];
  copy[nextIndex] = temp;

  return copy;
}

function getImagePath(item: CollectionItem, fields: CollectionField[]) {
  const imageField = fields.find((field) => field.type === "image");
  if (!imageField) return "";

  const value = item[imageField.name];
  return typeof value === "string" ? value : "";
}

function CollectionItemImage({
  item,
  fields,
  title,
}: {
  item: CollectionItem;
  fields: CollectionField[];
  title: string;
}) {
  const imagePath = getImagePath(item, fields);

  if (!imagePath) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--brand-soft))] text-sm font-black text-[hsl(var(--brand))]">
        {title.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--app-bg-soft))] shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={toMediaUrl(imagePath)}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

// function getImagePath(item: CollectionItem, fields: CollectionField[]) {
//   const imageField = fields.find((field) => field.type === "image");
//   if (!imageField) return "";

//   const value = item[imageField.name];
//   return typeof value === "string" ? value : "";
// }

// function ItemImage({
//   item,
//   fields,
//   title,
// }: {
//   item: CollectionItem;
//   fields: CollectionField[];
//   title: string;
// }) {
//   const imagePath = getImagePath(item, fields);

//   if (!imagePath) {
//     return (
//       <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--brand-soft))] text-sm font-black text-[hsl(var(--brand))]">
//         {title.slice(0, 2).toUpperCase()}
//       </div>
//     );
//   }

//   return (
//     <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[hsl(var(--border-soft))] bg-[hsl(var(--app-bg-soft))] shadow-sm">
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         src={toMediaUrl(imagePath)}
//         alt={title}
//         className="h-full w-full object-cover"
//       />
//     </div>
//   );
// }

function LoadingState({ title }: { title: string }) {
  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-6 shadow-sm">
        <div className="h-7 w-56 animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-full bg-[hsl(var(--app-bg-soft))]" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-[1.5rem] bg-[hsl(var(--app-bg-soft))]"
            />
          ))}
        </div>
      </div>

      <p className="text-sm font-semibold text-[hsl(var(--text-muted))]">
        Loading {title.toLowerCase()}...
      </p>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[hsl(var(--border-strong))] bg-white/80 p-6 text-center">
      <p className="text-sm font-semibold leading-7 text-[hsl(var(--text-muted))]">
        {children}
      </p>
    </div>
  );
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
  const [form, setForm] = useState<Record<string, string>>(() =>
    makeEmptyForm(fields),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const pinnedItems = useMemo(
    () =>
      items
        .filter((item) => item.is_pinned && !item.is_archived)
        .sort(
          (a, b) => (a.pinned_sort_order || 0) - (b.pinned_sort_order || 0),
        ),
    [items],
  );

  async function loadItems() {
    try {
      const data = await adminJson<Record<string, CollectionItem[]>>(apiBase);
      setItems(data[listKey] || []);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : `Could not load ${title}.`,
      );
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const url = editingId ? `${apiBase}/${editingId}` : apiBase;
      const method = editingId ? "PATCH" : "POST";

      await adminJson(url, {
        method,
        body: JSON.stringify(form),
      });

      resetForm();
      await loadItems();
      setNotice(
        editingId ? `${title} item updated.` : `${title} item created.`,
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleArchive(item: CollectionItem) {
    try {
      await adminJson(`${apiBase}/${item.id}/archive`, {
        method: "PATCH",
        body: JSON.stringify({
          is_archived: !item.is_archived,
        }),
      });

      await loadItems();
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Archive update failed.",
      );
    }
  }

  async function togglePin(item: CollectionItem) {
    try {
      await adminJson(`${apiBase}/${item.id}/pin`, {
        method: "PATCH",
        body: JSON.stringify({
          is_pinned: !item.is_pinned,
        }),
      });

      await loadItems();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Pin update failed.");
    }
  }

  async function saveNormalOrder(nextItems: CollectionItem[]) {
    setItems(nextItems);

    try {
      const data = await adminJson<Record<string, CollectionItem[]>>(
        `${apiBase}/reorder`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ids: nextItems.map((item) => item.id),
          }),
        },
      );

      setItems(data[listKey] || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Reorder failed.");
      await loadItems();
    }
  }

  async function savePinnedOrder(nextPinnedItems: CollectionItem[]) {
    const nextPinnedIds = nextPinnedItems.map((item) => item.id);

    try {
      const data = await adminJson<Record<string, CollectionItem[]>>(
        `${apiBase}/reorder-pinned`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ids: nextPinnedIds,
          }),
        },
      );

      setItems(data[listKey] || []);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Pinned reorder failed.",
      );
      await loadItems();
    }
  }

  function renderField(field: CollectionField) {
    const value = form[field.name] || "";

    if (field.type === "textarea") {
      return (
        <TextareaInput
          key={field.name}
          label={field.label}
          value={value}
          required={field.required}
          onChange={(nextValue) =>
            setForm({ ...form, [field.name]: nextValue })
          }
        />
      );
    }

    if (field.type === "image") {
      return (
        <ImageUploadField
          key={field.name}
          label={field.label}
          value={value}
          onChange={(nextValue) =>
            setForm({ ...form, [field.name]: nextValue })
          }
        />
      );
    }

    if (field.type === "session") {
      return (
        <SessionSelect
          key={field.name}
          label={field.label}
          value={value}
          required={field.required}
          onChange={(nextValue) =>
            setForm({ ...form, [field.name]: nextValue })
          }
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
    return <LoadingState title={title} />;
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-white p-4 text-sm font-semibold leading-6 text-[hsl(var(--text-main))] shadow-sm">
          {notice}
        </div>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white shadow-xl">
        <div className="border-b border-[hsl(var(--border-soft))] bg-[hsl(var(--brand-soft))] p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">
            Manage {itemKey}
          </p>

          <h1 className="font-display mt-2 text-3xl font-black tracking-tight text-[hsl(var(--text-main))]">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[hsl(var(--text-muted))]">
            {description}
          </p>
        </div>

        <form
          onSubmit={submitForm}
          className="grid gap-5 p-6 sm:p-8 md:grid-cols-2"
        >
          {fields.map((field) => (
            <div
              key={field.name}
              className={
                field.type === "textarea" || field.type === "image"
                  ? "md:col-span-2"
                  : ""
              }
            >
              {renderField(field)}
            </div>
          ))}

          <div className="flex flex-col gap-3 border-t border-[hsl(var(--border-soft))] pt-6 sm:flex-row md:col-span-2">
            <AdminButton type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update item" : "Create item"}
            </AdminButton>

            {editingId && (
              <AdminButton variant="secondary" onClick={resetForm}>
                Cancel edit
              </AdminButton>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
              Pinned order
            </h2>

            <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
              Pinned items are shown first on the public website.
            </p>
          </div>

          <StatusBadge tone="blue">{pinnedItems.length}/10 pinned</StatusBadge>
        </div>

        <div className="mt-5 space-y-3">
          {pinnedItems.length === 0 && (
            <EmptyState>No pinned items yet.</EmptyState>
          )}

          {pinnedItems.map((item, index) => {
            const titleText = getItemTitle(item);

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <CollectionItemImage  item={item} fields={fields} title={titleText} />

                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-black text-[hsl(var(--text-main))]">
                      {titleText}
                    </p>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
                      Pinned position {index + 1}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AdminButton
                    variant="secondary"
                    disabled={index === 0}
                    onClick={() =>
                      savePinnedOrder(moveItem(pinnedItems, item.id, "up"))
                    }
                  >
                    Up
                  </AdminButton>

                  <AdminButton
                    variant="secondary"
                    disabled={index === pinnedItems.length - 1}
                    onClick={() =>
                      savePinnedOrder(moveItem(pinnedItems, item.id, "down"))
                    }
                  >
                    Down
                  </AdminButton>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[hsl(var(--border-soft))] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-2xl font-black tracking-tight text-[hsl(var(--text-main))]">
          All items
        </h2>

        <p className="mt-2 text-sm leading-7 text-[hsl(var(--text-muted))]">
          Edit, archive, pin, unpin, and reorder everything here.
        </p>

        <div className="mt-5 space-y-3">
          {items.length === 0 && <EmptyState>No items yet.</EmptyState>}

          {items.map((item, index) => {
            const titleText = getItemTitle(item);

            return (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-[hsl(var(--border-soft))] bg-[hsl(var(--surface-soft))] p-4 transition hover:border-[hsl(var(--brand)_/_0.35)] hover:bg-white"
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="flex min-w-0 items-start gap-4">
                    <CollectionItemImage  item={item} fields={fields} title={titleText} />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-black text-[hsl(var(--text-main))]">
                          {titleText}
                        </h3>

                        {item.is_pinned && (
                          <StatusBadge tone="green">Pinned</StatusBadge>
                        )}
                        {item.is_archived && (
                          <StatusBadge tone="red">Archived</StatusBadge>
                        )}
                      </div>

                      <p className="mt-1 text-sm font-semibold text-[hsl(var(--text-muted))]">
                        Display order: {index + 1}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <AdminButton
                      variant="secondary"
                      disabled={index === 0}
                      onClick={() =>
                        saveNormalOrder(moveItem(items, item.id, "up"))
                      }
                    >
                      Up
                    </AdminButton>

                    <AdminButton
                      variant="secondary"
                      disabled={index === items.length - 1}
                      onClick={() =>
                        saveNormalOrder(moveItem(items, item.id, "down"))
                      }
                    >
                      Down
                    </AdminButton>

                    <AdminButton
                      variant="secondary"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </AdminButton>

                    <AdminButton
                      variant="secondary"
                      onClick={() => togglePin(item)}
                      disabled={item.is_archived}
                    >
                      {item.is_pinned ? "Unpin" : "Pin"}
                    </AdminButton>

                    <AdminButton
                      variant={item.is_archived ? "secondary" : "danger"}
                      onClick={() => toggleArchive(item)}
                    >
                      {item.is_archived ? "Unarchive" : "Archive"}
                    </AdminButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
