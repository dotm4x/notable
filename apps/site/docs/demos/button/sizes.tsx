'use client';

import { Button } from '@one/components';

/** Demonstrates available Button sizes. */
export function ButtonSizesDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  );
}
