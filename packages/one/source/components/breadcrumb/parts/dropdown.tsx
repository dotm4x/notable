import type { ReactNode } from 'react';
import { ChevronDown } from '../../../icons';
import { MenuItem } from '../../../internal/primitives/menu/menu.js';
import { DropdownMenu } from '../../dropdown-menu/dropdown-menu.js';
import type { BreadcrumbDropdownProps } from '../types.js';

export function BreadcrumbMenuLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <MenuItem render={<a href={href} />} className="one-breadcrumb__menu-link">
      {children}
    </MenuItem>
  );
}

export function BreadcrumbDropdown({ label, items }: BreadcrumbDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button type="button" className="one-breadcrumb__trigger">
          {label}
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        {items.map((item) => (
          <BreadcrumbMenuLink key={item.href} href={item.href}>
            {item.label}
          </BreadcrumbMenuLink>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
