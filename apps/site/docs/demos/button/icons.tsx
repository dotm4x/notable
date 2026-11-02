'use client';

import { CircleEllipsis, Plus, Search } from 'lucide-react';
import { Button } from '@notable/components';

/** Demonstrates icon-only Button sizes and variants. */
export function ButtonIconsDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button variant="ghost" size="icon" aria-label="Add item">
        <Plus aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon-small" aria-label="Search">
        <Search aria-hidden="true" size={20} />
      </Button>
      <Button variant="secondary" size="icon-large" aria-label="More options">
        <CircleEllipsis aria-hidden="true" />
      </Button>
    </div>
  );
}
