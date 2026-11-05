'use client';

import type { RowData } from '@tanstack/react-table';
import { Settings } from '../icons/index.js';
import { Button } from '../components/button/button.js';
import { DropdownMenu } from '../components/dropdown-menu/dropdown-menu.js';
import type { TDataTableViewOptionsProps } from './types.js';

/** Menu that toggles the visibility of hideable columns. */
export function DataTableViewOptions<TData extends RowData>({
  table,
  label = 'View',
  className,
}: TDataTableViewOptionsProps<TData>) {
  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  if (columns.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Button
          className={className}
          size="small"
          type="button"
          variant="outline"
        >
          <Settings aria-hidden="true" size={16} />
          {label}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>Toggle columns</DropdownMenu.GroupLabel>
          <DropdownMenu.Separator />
          {columns.map((column) => (
            <DropdownMenu.CheckboxItem
              checked={column.getIsVisible()}
              key={column.id}
              onCheckedChange={(checked) => column.toggleVisibility(checked)}
            >
              {column.id.charAt(0).toUpperCase() + column.id.slice(1)}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
