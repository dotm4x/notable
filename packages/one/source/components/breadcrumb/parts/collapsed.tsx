import type { ReactNode } from 'react';
import { Ellipsis } from '../../../icons';
import { DropdownMenu } from '../../dropdown-menu/dropdown-menu.js';
import { renderHiddenEntry } from '../helpers/slots.js';

export function BreadcrumbCollapsed({ entries }: { entries: ReactNode[] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          type="button"
          className="one-breadcrumb__trigger"
          aria-label="Show hidden breadcrumb items"
        >
          <Ellipsis size={16} aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        {entries.map(renderHiddenEntry)}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
