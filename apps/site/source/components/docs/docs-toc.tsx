'use client';

import { TableOfContents } from '@dotm4x/one/components';
import type { TocItem } from '../../docs/toc';

function TocItems({ items }: { items: TocItem[] }) {
  return (
    <TableOfContents.List>
      {items.map((item) => (
        <TableOfContents.Item
          href={`#${item.id}`}
          key={item.id}
          label={item.label}
        >
          {item.children.length > 0 ? (
            <TocItems items={item.children} />
          ) : undefined}
        </TableOfContents.Item>
      ))}
    </TableOfContents.List>
  );
}

export interface DocsTocProps {
  items: TocItem[];
}

/** Sticky in-page navigation with automatic scroll tracking. */
export function DocsToc({ items }: DocsTocProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <TableOfContents className="docs-toc__nav" side="right">
      <TableOfContents.Header>On this page</TableOfContents.Header>
      <TocItems items={items} />
    </TableOfContents>
  );
}
