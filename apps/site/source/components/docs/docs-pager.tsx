'use client';

import { Pager } from '@dotm4x/one/components';
import type { AdjacentDocs } from '../../docs/types';

/** Client adapter that maps adjacent docs to the package Pager. */
export function DocsPager({ previous, next }: AdjacentDocs) {
  return (
    <Pager
      className="docs-pager"
      next={next ? { href: next.url, label: next.title } : undefined}
      previous={
        previous ? { href: previous.url, label: previous.title } : undefined
      }
    />
  );
}
