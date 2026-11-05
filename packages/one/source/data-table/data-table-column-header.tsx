'use client';

import type { RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from '../icons/index.js';
import { Button } from '../components/button/button.js';
import type { TDataTableColumnHeaderProps } from './types.js';

/** Renders a sortable column header with the current direction. */
export function DataTableColumnHeader<TData extends RowData, TValue = unknown>({
  column,
  title,
}: TDataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className="one-data-table__column-title">{title}</span>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      className="one-data-table__sort-button"
      onClick={() => column.toggleSorting(sorted === 'asc')}
      size="small"
      variant="ghost"
    >
      <span>{title}</span>
      <span aria-hidden="true" className="one-data-table__sort-icons">
        {sorted === 'asc' ? <ArrowUp size={12} /> : null}
        {sorted === 'desc' ? <ArrowDown size={12} /> : null}
        {sorted === false ? (
          <>
            <ArrowUp size={9} />
            <ArrowDown size={9} />
          </>
        ) : null}
      </span>
    </Button>
  );
}
