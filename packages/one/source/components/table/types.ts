import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

/** Horizontal alignment of a table cell. */
export type TTableAlign = 'start' | 'center' | 'end';

/** Sort state exposed to assistive technology through `aria-sort`. */
export type TTableSort = 'ascending' | 'descending' | 'none';

export type TTableProps = HTMLAttributes<HTMLTableElement> & {
  /** Additional class for the horizontal scroll container. */
  containerClassName?: string;
};

export type TTableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
export type TTableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
export type TTableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export type TTableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

export type TTableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  /** Marks the row as selected. */
  selected?: boolean;
};

export type TTableHeadProps = Omit<
  ThHTMLAttributes<HTMLTableCellElement>,
  'align'
> & {
  /** Horizontal alignment. Defaults to `start`. */
  align?: TTableAlign;
  /** Current sort direction. Sets `aria-sort` on the header cell. */
  sort?: TTableSort;
};

export type TTableCellProps = Omit<
  TdHTMLAttributes<HTMLTableCellElement>,
  'align'
> & {
  /** Horizontal alignment. Defaults to `start`. */
  align?: TTableAlign;
};
