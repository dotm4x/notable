import type {
  Column,
  ColumnDef,
  ReactTable,
  RowData,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';
import type { DataTableFeatures } from './features.js';

export interface TDataTableColumnHeaderProps<
  TData extends RowData,
  TValue = unknown,
> {
  /** Column whose sorting state is controlled by the header. */
  column: Column<DataTableFeatures, TData, TValue>;
  /** Visible header label. */
  title: string;
}

export interface TDataTableViewOptionsProps<TData extends RowData> {
  /** Table instance created by {@link DataTable}. */
  table: ReactTable<DataTableFeatures, TData>;
  /** Trigger label. Defaults to `View`. */
  label?: string;
  /** Additional class for the trigger button. */
  className?: string;
}

export interface TDataTablePaginationProps<TData extends RowData> {
  /** Table instance created by {@link DataTable}. */
  table: ReactTable<DataTableFeatures, TData>;
  /** Available page sizes. Defaults to 10, 20, 25, 30, 40, and 50. */
  pageSizeOptions?: number[];
}

export interface TDataTableProps<TData extends RowData> {
  /** Column definitions from TanStack Table. */
  columns: ColumnDef<DataTableFeatures, TData>[];
  /** Rows rendered by the table. */
  data: TData[];
  /** Column used by the default filter input. Omit to hide the input. */
  filterColumn?: string;
  /** Placeholder and accessible name of the filter input. */
  filterPlaceholder?: string;
  /** Adds a checkbox column and enables row selection. Defaults to `false`. */
  enableRowSelection?: boolean;
  /** Shows the column visibility menu. Defaults to `true`. */
  enableColumnVisibility?: boolean;
  /** Shows the pagination controls. Defaults to `true`. */
  enablePagination?: boolean;
  /** Initial page size. Defaults to `10`. */
  pageSize?: number;
  /** Page sizes offered by the pagination control. */
  pageSizeOptions?: number[];
  /** Replaces the default empty state. */
  emptyState?: ReactNode;
  /** Replaces the default toolbar. */
  toolbar?: (table: ReactTable<DataTableFeatures, TData>) => ReactNode;
}
