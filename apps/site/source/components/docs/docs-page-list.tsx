'use client';

import { Card } from '@dotm4x/one/components';
import Link from 'next/link';
import type { NavItem } from '../../docs/types';

export interface DocsPageListProps {
  items: NavItem[];
}

/** Client adapter for the child-page cards used by section indexes. */
export function DocsPageList({ items }: DocsPageListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="docs-page-list">
      {items.map((item) => (
        <li key={item.url} className="docs-page-list__item">
          <Link className="docs-page-list__link" href={item.url}>
            <Card className="docs-page-list__card">
              <Card.Header>
                <Card.Title as="p" className="docs-page-list__title">
                  {item.title}
                </Card.Title>
                {item.description ? (
                  <Card.Description>{item.description}</Card.Description>
                ) : null}
              </Card.Header>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
