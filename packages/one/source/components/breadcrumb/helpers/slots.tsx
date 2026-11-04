import { isValidElement, type ComponentType, type ReactNode } from 'react';
import { ChevronRight } from '../../../icons';
import { DropdownMenu } from '../../dropdown-menu/dropdown-menu.js';
import { BreadcrumbDropdown, BreadcrumbMenuLink } from '../parts/dropdown.js';
import { BreadcrumbItem } from '../parts/item.js';
import type { BreadcrumbDropdownProps, BreadcrumbItemProps } from '../types.js';

export const MIN_VISIBLE_ITEMS = 3;

export const DEFAULT_SEPARATOR = <ChevronRight size={14} aria-hidden="true" />;

/** Renders one hidden entry as a menu row. Unknown children are skipped. */
export function renderHiddenEntry(entry: ReactNode): ReactNode {
  if (
    isValidElement<BreadcrumbItemProps>(entry) &&
    entry.type === BreadcrumbItem
  ) {
    const { href, current, children } = entry.props;

    if (href === undefined || current) {
      return (
        <DropdownMenu.Item key={entry.key} disabled>
          {children}
        </DropdownMenu.Item>
      );
    }

    return (
      <BreadcrumbMenuLink key={entry.key} href={href}>
        {children}
      </BreadcrumbMenuLink>
    );
  }

  if (
    isValidElement<BreadcrumbDropdownProps>(entry) &&
    entry.type === BreadcrumbDropdown
  ) {
    const { label, items } = entry.props;

    return (
      <DropdownMenu.Group key={entry.key}>
        <DropdownMenu.GroupLabel>{label}</DropdownMenu.GroupLabel>
        {items.map((item) => (
          <BreadcrumbMenuLink key={item.href} href={item.href}>
            {item.label}
          </BreadcrumbMenuLink>
        ))}
      </DropdownMenu.Group>
    );
  }

  return null;
}

/**
 * Returns the entries to render. When collapsing applies, the first entry
 * and the trailing entries stay visible, and the middle entries move into an
 * ellipsis slot.
 */
export function getSlots(
  entries: ReactNode[],
  maxVisibleItems: number | undefined,
  Collapsed: ComponentType<{ entries: ReactNode[] }>,
): ReactNode[] {
  if (maxVisibleItems === undefined) {
    return entries;
  }

  const limit = Math.max(MIN_VISIBLE_ITEMS, Math.floor(maxVisibleItems));

  if (entries.length <= limit) {
    return entries;
  }

  const trailingCount = limit - 2;
  const hidden = entries.slice(1, entries.length - trailingCount);

  return [
    entries[0],
    <Collapsed key="collapsed" entries={hidden} />,
    ...entries.slice(entries.length - trailingCount),
  ];
}
