'use client';

import { Separator } from '@dotm4x/one/components';

export default function Custom() {
  return (
    <div
      style={{ display: 'grid', gap: 'var(--one-spacing-4)', width: '22rem' }}
    >
      <div>
        <p style={{ margin: 0 }}>Subtle, one pixel</p>
        <Separator color="subtle" />
      </div>
      <div>
        <p style={{ margin: 0 }}>Strong, four pixels</p>
        <Separator color="strong" thickness={4} />
      </div>
      <div>
        <p style={{ margin: 0 }}>Primary color, half a rem</p>
        <Separator color="var(--one-color-primary)" thickness="0.5rem" />
      </div>
    </div>
  );
}
