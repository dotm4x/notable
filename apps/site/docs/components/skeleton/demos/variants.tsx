'use client';

import { Skeleton } from '@dotm4x/one/components';

export default function Variants() {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        gap: 'var(--one-spacing-4)',
      }}
    >
      <Skeleton variant="circular" height={56} />
      <Skeleton variant="rectangular" width={120} height={56} radius="lg" />
      <div
        style={{
          display: 'grid',
          gap: 'var(--one-spacing-2)',
          width: '10rem',
        }}
      >
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="70%" />
      </div>
    </div>
  );
}
