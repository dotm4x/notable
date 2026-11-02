'use client';

import { Button } from '@notable/components';

/** Demonstrates disabled Buttons. */
export function ButtonDisabledDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <Button disabled>Primary</Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
    </div>
  );
}
