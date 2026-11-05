'use client';

import { Spinner } from '@dotm4x/one/components';

export default function Label() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Spinner size="small" label="Saving changes" />
      <span>Saving changes…</span>
    </div>
  );
}
