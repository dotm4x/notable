'use client';

import { Shortcut } from '@dotm4x/one/components';

export default function Combination() {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        gap: 'var(--one-spacing-1)',
      }}
    >
      <Shortcut>Ctrl</Shortcut>
      <span aria-hidden="true">+</span>
      <Shortcut>Shift</Shortcut>
      <span aria-hidden="true">+</span>
      <Shortcut>P</Shortcut>
    </div>
  );
}
