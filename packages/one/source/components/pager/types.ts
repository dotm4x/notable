import type { HTMLAttributes } from 'react';

/** A destination shown by the pager. */
export interface TPagerItem {
  /** Destination URL. */
  href: string;
  /** Visible page title. */
  label: string;
}

export type TPagerProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  /** Previous destination. Omit it on the first page. */
  previous?: TPagerItem;
  /** Next destination. Omit it on the last page. */
  next?: TPagerItem;
  /** Label for the previous direction. Defaults to `Previous`. */
  previousLabel?: string;
  /** Label for the next direction. Defaults to `Next`. */
  nextLabel?: string;
  /** Accessible name of the navigation landmark. Defaults to `Pagination`. */
  label?: string;
};
