'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  useTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Checkbox } from '../components/checkbox/checkbox.js';
import { Empty } from '../components/empty/empty.js';
import { Input } from '../components/input/input.js';
import { Table } from '../components/table/table.js';
import { DataTablePagination } from './data-table-pagination.js';
import { DataTableViewOptions } from './data-table-view-options.js';
import { dataTableFeatures, type DataTableFeatures } from './features.js';
import type { TDataTableProps } from './types.js';
import './data-table.css';

const DEFAULT_PAGE_SIZES = [10, 20, 25, 30, 40, 50];

/**
 * A data table with sorting, filtering, pagination, column visibility, and
 * optional row selection. Use `DataTableColumnHeader` inside column
 * definitions to expose sorting controls.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  emptyState,
  enableColumnVisibility = true,
  enablePagination = true,
  enableRowSelection = false,
  filterColumn,
  filterPlaceholder = 'Filter…',
  pageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  toolbar,
}: TDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectionColumn: ColumnDef<DataTableFeatures, TData> = {
    id: 'select',
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onChange={(event) =>
          table.toggleAllPageRowsSelected(event.currentTarget.checked)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={(event) => row.toggleSelected(event.currentTarget.checked)}
      />
    ),
  };

  const allColumns = enableRowSelection
    ? [selectionColumn, ...columns]
    : columns;

  const table = useTable({
    columns: allColumns,
    data,
    features: dataTableFeatures,
    initialState: {
      pagination: { pageIndex: 0, pageSize },
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting,
    },
  });

  const rows = table.getRowModel().rows;
  const defaultToolbar =
    filterColumn || enableColumnVisibility ? (
      <div className="one-data-table__toolbar">
        {filterColumn ? (
          <div className="one-data-table__filter">
            <Input
              aria-label={filterPlaceholder}
              onChange={(event) =>
                table
                  .getColumn(filterColumn)
                  ?.setFilterValue(event.target.value)
              }
              placeholder={filterPlaceholder}
              value={
                (table.getColumn(filterColumn)?.getFilterValue() as
                  string | undefined) ?? ''
              }
            />
          </div>
        ) : null}
        {enableColumnVisibility ? (
          <DataTableViewOptions
            className="one-data-table__view-options"
            table={table}
          />
        ) : null}
      </div>
    ) : null;

  return (
    <div className="one-data-table">
      {toolbar ? toolbar(table) : defaultToolbar}
      <Table>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sorted = header.column.getIsSorted();

                return (
                  <Table.Head
                    key={header.id}
                    sort={
                      header.column.getCanSort()
                        ? sorted === 'asc'
                          ? 'ascending'
                          : sorted === 'desc'
                            ? 'descending'
                            : 'none'
                        : undefined
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </Table.Head>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {rows.length > 0 ? (
            rows.map((row) => (
              <Table.Row key={row.id} selected={row.getIsSelected()}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={allColumns.length}>
                {emptyState ?? (
                  <Empty size="compact">
                    <Empty.Title>No results</Empty.Title>
                    <Empty.Description>
                      No rows match the current filters.
                    </Empty.Description>
                  </Empty>
                )}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {enablePagination ? (
        <DataTablePagination pageSizeOptions={pageSizeOptions} table={table} />
      ) : null}
    </div>
  );
}

export type { DataTableFeatures } from './features.js';
export type { TDataTableProps } from './types.js';
