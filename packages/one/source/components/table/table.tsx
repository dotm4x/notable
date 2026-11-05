import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import {
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from './parts/sections.js';
import type { TTableProps } from './types.js';
import './table.css';

export type {
  TTableAlign,
  TTableBodyProps,
  TTableCaptionProps,
  TTableCellProps,
  TTableFooterProps,
  TTableHeadProps,
  TTableHeaderProps,
  TTableProps,
  TTableRowProps,
  TTableSort,
} from './types.js';

export interface TableComponent extends ForwardRefExoticComponent<
  TTableProps & RefAttributes<HTMLTableElement>
> {
  /** Renders the table caption, announced as the table's description. */
  Caption: typeof TableCaption;
  /** Renders the header row group. */
  Header: typeof TableHeader;
  /** Renders the body row group. */
  Body: typeof TableBody;
  /** Renders the footer row group. */
  Footer: typeof TableFooter;
  /** Renders a row with optional selected state. */
  Row: typeof TableRow;
  /** Renders a header cell with scope and optional `aria-sort`. */
  Head: typeof TableHead;
  /** Renders a data cell with optional alignment. */
  Cell: typeof TableCell;
}

/**
 * Renders a semantic table inside a horizontal scroll container. Compose it
 * with `Table.Caption`, `Table.Header`, `Table.Body`, `Table.Row`,
 * `Table.Head`, and `Table.Cell`.
 */
export const Table: TableComponent = Object.assign(TableRoot, {
  Body: TableBody,
  Caption: TableCaption,
  Cell: TableCell,
  Footer: TableFooter,
  Head: TableHead,
  Header: TableHeader,
  Row: TableRow,
});
