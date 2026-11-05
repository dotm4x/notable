'use client';

import { Skeleton } from '@dotm4x/one/components';

export default function Text() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--one-spacing-2)',
        width: '22rem',
      }}
    >
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="92%" />
      <Skeleton variant="text" width="78%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}
