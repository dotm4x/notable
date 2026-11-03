'use client';

import { Button, Spinner } from '@dotm4x/one/components';

/** Demonstrates loading state Buttons. */
export function ButtonLoadingDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <Button disabled aria-busy="true">
        <Spinner size="small" />
        Saving...
      </Button>
      <Button variant="secondary" disabled aria-busy="true">
        <Spinner size="small" />
        Secondary
      </Button>
      <Button variant="outline" disabled aria-busy="true">
        <Spinner size="small" />
        Loading
      </Button>
      <Button variant="danger" disabled aria-busy="true">
        <Spinner size="small" />
        Deleting...
      </Button>
    </div>
  );
}
