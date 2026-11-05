'use client';

import { Separator } from '@dotm4x/one/components';

export default function Vertical() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 'var(--one-spacing-4)',
        height: '3rem',
      }}
    >
      <span>Draft</span>
      <Separator orientation="vertical" />
      <span>In review</span>
      <Separator orientation="vertical" />
      <span>Published</span>
    </div>
  );
}
