'use client';

import { Button } from '@notable/components';

/** Demonstrates all available Button visual variants. */
export function ButtonVariantsDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
    </div>
  );
}
