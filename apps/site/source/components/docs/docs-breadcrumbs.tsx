'use client';

import { Breadcrumb } from '@dotm4x/one/components';
import type { BreadcrumbItem } from '../../docs/types';

export interface DocsBreadcrumbsProps {
  items: BreadcrumbItem[];
}

/** Shows the current page within the documentation hierarchy. */
export function DocsBreadcrumbs({ items }: DocsBreadcrumbsProps) {
  const lastIndex = items.length - 1;

  return (
    <Breadcrumb className="docs-breadcrumbs">
      {items.map((item, index) => (
        <Breadcrumb.Item
          current={index === lastIndex}
          href={index === lastIndex ? undefined : item.href}
          key={item.href}
        >
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
