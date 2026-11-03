'use client';

import { Plus } from '@dotm4x/one/icons';
import { Button } from '@dotm4x/one/components';

/** Demonstrates Button with leading icon. */
export function ButtonWithIconDemo() {
  return (
    <Button>
      <Plus aria-hidden="true" />
      New item
    </Button>
  );
}
