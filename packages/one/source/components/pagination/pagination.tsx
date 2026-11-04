import { PaginationRoot } from './parts/root.js';
import {
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from './parts/controls.js';
import { PaginationItems } from './parts/items.js';
import type { TPaginationProps } from './types.js';
import './pagination.css';

export type {
  TPaginationControlProps,
  TPaginationItemsProps,
  TPaginationProps,
  TPaginationSize,
} from './types.js';

export interface PaginationComponent extends React.ForwardRefExoticComponent<
  TPaginationProps & React.RefAttributes<HTMLElement>
> {
  /**
   * Shows a set of pages and navigation controls for a controlled page. The
   * consumer owns the page state and decides what a page change does. With no
   * children it renders the default layout, which composes the other parts.
   * Forwards refs to the navigation element.
   */
  Root: typeof PaginationRoot;
  /** Renders the button that jumps directly to the first page. */
  First: typeof PaginationFirst;
  /** Renders the button that moves to the previous page. */
  Previous: typeof PaginationPrevious;
  /**
   * The numbered pages around the current page, with ellipses for omitted
   * pages. The current page is marked with `aria-current` and tracked by a
   * single animated indicator.
   */
  Items: typeof PaginationItems;
  /** Renders the button that moves to the next page. */
  Next: typeof PaginationNext;
  /** Renders the button that jumps directly to the last page. */
  Last: typeof PaginationLast;
}

/** Page navigation for a controlled page. Compound: compose `Pagination.Items` with the page controls. */
export const Pagination: PaginationComponent = Object.assign(PaginationRoot, {
  Root: PaginationRoot,
  First: PaginationFirst,
  Previous: PaginationPrevious,
  Items: PaginationItems,
  Next: PaginationNext,
  Last: PaginationLast,
});
