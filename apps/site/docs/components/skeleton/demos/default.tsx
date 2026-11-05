'use client';

import { Skeleton } from '@dotm4x/one/components';

export default function Default() {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        gap: 'var(--one-spacing-3)',
        width: '22rem',
      }}
    >
      <Skeleton variant="circular" height={48} />
      <div style={{ display: 'grid', flex: 1, gap: 'var(--one-spacing-2)' }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  );
}
