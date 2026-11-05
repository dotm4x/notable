'use client';

import { Button } from '@dotm4x/one/components';

/** Demonstrates disabled Buttons. */
export default function Disabled() {
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
