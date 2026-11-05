'use client';

import { Slider } from '@dotm4x/one/components';

export default function Range() {
  return (
    <div style={{ width: '22rem' }}>
      <Slider
        label="Price range"
        defaultValue={[20, 60]}
        thumbLabels={['Minimum price', 'Maximum price']}
        formatValue={(value) => `$${value}`}
        showValue
      />
    </div>
  );
}
