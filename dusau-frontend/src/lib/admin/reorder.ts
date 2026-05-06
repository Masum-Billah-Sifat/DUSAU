export function moveItemById<T extends { id: string }>(
  items: T[],
  id: string,
  direction: 'up' | 'down',
) {
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