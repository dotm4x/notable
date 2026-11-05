'use client';

import { Button } from '@dotm4x/one/components';
import { Plus } from '@dotm4x/one/icons';

/** Demonstrates a Button with a leading icon. */
export default function WithIcon() {
  return (
    <Button>
      <Plus aria-hidden="true" />
      New item
    </Button>
  );
}
