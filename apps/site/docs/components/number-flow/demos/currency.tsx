'use client';

import { NumberFlow } from '@dotm4x/one/components';

export default function Currency() {
  return (
    <div style={{ display: 'grid', gap: 'var(--one-spacing-2)' }}>
      <NumberFlow
        value={1299.5}
        format={{ style: 'currency', currency: 'USD' }}
      />
      <NumberFlow
        value={0.248}
        format={{ style: 'percent', maximumFractionDigits: 1 }}
      />
    </div>
  );
}
