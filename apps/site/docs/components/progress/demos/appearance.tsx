'use client';

import { Progress } from '@dotm4x/one/components';

export default function Appearance() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--one-spacing-4)',
        inlineSize: '100%',
        maxInlineSize: '24rem',
      }}
    >
      <Progress aria-label="Storage used" value={42} size="small" />
      <Progress aria-label="Seats used" value={55} thickness={12} />
      <Progress aria-label="Quota used" color="success" value={75} />
      <Progress aria-label="Budget used" color="danger" value={30} />
      <Progress aria-label="Tasks completed" radius={0} value={45} />
    </div>
  );
}
