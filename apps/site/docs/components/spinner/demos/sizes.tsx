'use client';

import { Spinner } from '@dotm4x/one/components';

export default function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
    </div>
  );
}
