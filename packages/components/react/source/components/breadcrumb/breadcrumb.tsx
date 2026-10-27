import {
  Children,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { ChevronDown, ChevronRight, Ellipsis } from 'lucide-react';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu.js';
import { MenuItem } from '../../internal/primitives/menu/menu.js';
import './breadcrumb.css';

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

const MIN_VISIBLE_ITEMS = 3;

const DEFAULT_SEPARATOR = <ChevronRight size={14} aria-hidden="true" />;

function BreadcrumbItem({ href, current, children }: BreadcrumbItemProps) {
  if (current) {
    return (
      <span className="notable-breadcrumb__current" aria-current="page">
        {children}
      </span>
    );
  }

  if (href === undefined) {
    return <span className="notable-breadcrumb__text">{children}</span>;
  }

  return (
    <a className="notable-breadcrumb__link" href={href}>
      {children}
    </a>
  );
}

/**
 * A menu item that navigates. Rendering the item as the anchor keeps the
 * menu's keyboard handling on a real link.
 */
function BreadcrumbMenuLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <MenuItem
      render={<a href={href} />}
      className="notable-breadcrumb__menu-link"
    >
      {children}
    </MenuItem>
  );
}

function BreadcrumbDropdown({ label, items }: BreadcrumbDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button type="button" className="notable-breadcrumb__trigger">
          {label}
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="notable-breadcrumb__menu" align="start">
        {items.map((item) => (
          <BreadcrumbMenuLink key={item.href} href={item.href}>
            {item.label}
          </BreadcrumbMenuLink>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** Renders one hidden entry as a menu row. Unknown children are skipped. */
function renderHiddenEntry(entry: ReactNode): ReactNode {
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

function BreadcrumbCollapsed({ entries }: { entries: ReactNode[] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          type="button"
          className="notable-breadcrumb__trigger"
          aria-label="Show hidden breadcrumb items"
        >
          <Ellipsis size={16} aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="notable-breadcrumb__menu" align="start">
        {entries.map(renderHiddenEntry)}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/**
 * Returns the entries to render. When collapsing applies, the first entry
 * and the trailing entries stay visible, and the middle entries move into an
 * ellipsis slot.
 */
function getSlots(entries: ReactNode[], maxVisibleItems?: number): ReactNode[] {
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
    <BreadcrumbCollapsed key="collapsed" entries={hidden} />,
    ...entries.slice(entries.length - trailingCount),
  ];
}

const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbProps>(
  function BreadcrumbRoot(
    {
      separator = DEFAULT_SEPARATOR,
      maxVisibleItems,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const slots = getSlots(Children.toArray(children), maxVisibleItems);

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={['notable-breadcrumb', className].filter(Boolean).join(' ')}
        {...props}
      >
        <ol className="notable-breadcrumb__list">
          {slots.map((slot, index) => (
            <li
              key={isValidElement(slot) ? slot.key : index}
              className="notable-breadcrumb__entry"
            >
              {index > 0 && (
                <span
                  className="notable-breadcrumb__separator"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
              {slot}
            </li>
          ))}
        </ol>
      </nav>
    );
  },
);

/**
 * Shows the location of the current page as an ordered trail from the root.
 * A plain trail needs only `Breadcrumb.Item`. Enable `maxVisibleItems` to
 * collapse middle entries, and add `Breadcrumb.Dropdown` to offer sibling
 * destinations for a level. Both features are optional and independent.
 * Forwards refs to the navigation element.
 */
export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
  Dropdown: BreadcrumbDropdown,
});
