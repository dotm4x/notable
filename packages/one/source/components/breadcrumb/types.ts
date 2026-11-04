import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Props for the {@link Breadcrumb} root, rendered as a navigation landmark. */
export type BreadcrumbProps = ComponentPropsWithoutRef<'nav'> & {
  /**
   * Shown between items. It is rendered inside an element hidden from
   * assistive technology. Defaults to a chevron.
   */
  separator?: ReactNode;
  /**
   * Enables collapsing. When the trail has more entries than this, the
   * middle entries are replaced by an ellipsis button that opens a menu of
   * the hidden entries. The count includes the first entry, the ellipsis,
   * and the last entries. Values below 3 are treated as 3. Omit to show
   * every entry.
   */
  maxVisibleItems?: number;
  /** Items and dropdowns, in order from the root to the current location. */
  children?: ReactNode;
};

/** Props for `Breadcrumb.Item`. */
export type BreadcrumbItemProps = {
  /** Destination of the item. Items without a destination are shown as text. */
  href?: string;
  /** Marks the item as the current page. It is not rendered as a link. */
  current?: boolean;
  /** Visible label of the item. */
  children?: ReactNode;
};

/** A destination offered by `Breadcrumb.Dropdown`. */
export type BreadcrumbDropdownItem = {
  /** Visible label of the destination. */
  label: ReactNode;
  /** Destination the menu item navigates to. */
  href: string;
};

/** Props for `Breadcrumb.Dropdown`, an entry that opens a menu of destinations. */
export type BreadcrumbDropdownProps = {
  /** Visible label of the trigger. */
  label: ReactNode;
  /** Destinations listed in the menu. */
  items: readonly BreadcrumbDropdownItem[];
};
