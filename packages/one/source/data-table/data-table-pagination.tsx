'use client';

import type { RowData } from '@tanstack/react-table';
import { useId } from 'react';
import { Pagination } from '../components/pagination/pagination.js';
import { Select } from '../components/select/select.js';
import type { TDataTablePaginationProps } from './types.js';

const DEFAULT_PAGE_SIZES = [10, 20, 25, 30, 40, 50];

/** Page size, selection count, and numbered page navigation. */
export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
}: TDataTablePaginationProps<TData>) {
  const pageSizeLabelId = useId();
  const pageIndex = table.state.pagination.pageIndex;
  const pageSize = table.state.pagination.pageSize;
  const pageCount = table.getPageCount();
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const rowCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="one-data-table__pagination">
      <span className="one-data-table__selection" aria-live="polite">
        {selectedCount} of {rowCount} row(s) selected.
      </span>
      <div className="one-data-table__pagination-controls">
        <div className="one-data-table__page-size">
          <span id={pageSizeLabelId}>Rows per page</span>
          <Select
            onValueChange={(value) => {
              if (value) {
                table.setPageSize(Number(value));
              }
            }}
            value={String(pageSize)}
          >
            <Select.Trigger aria-labelledby={pageSizeLabelId}>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content>
              {pageSizeOptions.map((size) => (
                <Select.Item key={size} value={String(size)}>
                  {size}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <span className="one-data-table__page-info">
          Page {pageIndex + 1} of {Math.max(pageCount, 1)}
        </span>
        <Pagination
          onPageChange={(page) => table.setPageIndex(page - 1)}
          page={pageIndex + 1}
          pageCount={pageCount}
          showFirstLast
          size="small"
        />
      </div>
    </div>
  );
}
