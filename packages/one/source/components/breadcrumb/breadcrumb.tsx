import { Children, forwardRef, isValidElement } from 'react';
import { DEFAULT_SEPARATOR, getSlots } from './helpers/slots.js';
import { BreadcrumbCollapsed } from './parts/collapsed.js';
import { BreadcrumbDropdown } from './parts/dropdown.js';
import { BreadcrumbItem } from './parts/item.js';
import type { BreadcrumbProps } from './types.js';
import './breadcrumb.css';

export type {
  BreadcrumbDropdownItem,
  BreadcrumbDropdownProps,
  BreadcrumbItemProps,
  BreadcrumbProps,
} from './types.js';

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
    const slots = getSlots(
      Children.toArray(children),
      maxVisibleItems,
      BreadcrumbCollapsed,
    );

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={['one-breadcrumb', className].filter(Boolean).join(' ')}
        {...props}
      >
        <ol className="one-breadcrumb__list">
          {slots.map((slot, index) => (
            <li
              key={isValidElement(slot) ? slot.key : index}
              className="one-breadcrumb__entry"
            >
              {index > 0 && (
                <span className="one-breadcrumb__separator" aria-hidden="true">
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

export interface BreadcrumbComponent extends React.ForwardRefExoticComponent<
  BreadcrumbProps & React.RefAttributes<HTMLElement>
> {
  /** A single entry in the breadcrumb trail. Renders as a link or text. */
  Item: typeof BreadcrumbItem;
  /** A dropdown menu entry that expands to list hidden or nested items. */
  Dropdown: typeof BreadcrumbDropdown;
}

/**
 * Shows the location of the current page as an ordered trail from the root.
 * A plain trail needs only `Breadcrumb.Item`. Enable `maxVisibleItems` to
 * collapse middle entries, and add `Breadcrumb.Dropdown` to offer sibling
 * destinations for a level. Both features are optional and independent.
 * Forwards refs to the navigation element.
 */
export const Breadcrumb: BreadcrumbComponent = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
  Dropdown: BreadcrumbDropdown,
});
