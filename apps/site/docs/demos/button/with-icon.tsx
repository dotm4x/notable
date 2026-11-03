'use client';

import { Plus } from '@one/icons';
import { Button } from '@one/components';

/** Demonstrates Button with leading icon. */
export function ButtonWithIconDemo() {
  return (
    <Button>
      <Plus aria-hidden="true" />
      New item
    </Button>
  );
}
