'use client';

import { Slider } from '@dotm4x/one/components';

export default function Marks() {
  return (
    <div style={{ width: '22rem' }}>
      <Slider
        label="Team size"
        defaultValue={25}
        min={0}
        max={50}
        step={5}
        marks={[
          { value: 0, label: '0' },
          { value: 25, label: '25' },
          { value: 50, label: '50' },
        ]}
        showValue
      />
    </div>
  );
}
