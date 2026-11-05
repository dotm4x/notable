'use client';

import { Slider } from '@dotm4x/one/components';

export default function Default() {
  return (
    <div style={{ width: '22rem' }}>
      <Slider label="Volume" defaultValue={45} showValue />
    </div>
  );
}
