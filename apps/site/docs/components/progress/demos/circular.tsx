'use client';

import { Progress } from '@dotm4x/one/components';

export default function Circular() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--one-spacing-4)',
      }}
    >
      <Progress aria-label="Upload progress" variant="circular" value={72} />
      <Progress
        aria-label="Report progress"
        variant="circular"
        value={45}
        size={96}
        thickness={6}
      />
    </div>
  );
}
