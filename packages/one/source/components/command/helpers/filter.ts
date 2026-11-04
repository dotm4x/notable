import type { CommandGroup, CommandItem, CommandProps } from '../types.js';

export function isCommandGroup(
  entry: CommandItem | CommandGroup,
): entry is CommandGroup {
  return 'items' in entry;
}

export function isGroupedCommandList(
  items: CommandProps['items'],
): items is readonly CommandGroup[] {
  return items.length > 0 && isCommandGroup(items[0]);
}

/**
 * Default filter. Every whitespace-separated term of the query must appear in the
 * label, description, or keywords, ignoring case.
 */
export function matchesCommandQuery(item: CommandItem, query: string): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return true;
  }

  const searchableText = [
    item.label,
    item.description,
    ...(item.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return terms.every((term) => searchableText.includes(term));
}
