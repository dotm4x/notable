'use client';

import { Shortcut } from '@dotm4x/one/components';

export default function Default() {
  return (
    <div style={{ display: 'grid', gap: 'var(--one-spacing-2)' }}>
      <span>Press Escape to close the dialog.</span>
      <Shortcut>Escape</Shortcut>
    </div>
  );
}
