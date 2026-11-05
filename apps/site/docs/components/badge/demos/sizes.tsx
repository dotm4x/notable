'use client';

import { Badge } from '@dotm4x/one/components';

export default function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Badge size="small">Small</Badge>
      <Badge size="medium">Medium</Badge>
    </div>
  );
}
