'use client';

import { SegmentedControl } from '@dotm4x/one/components';

const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 'var(--one-spacing-4)' }}>
      <SegmentedControl
        label="Small"
        size="small"
        options={options}
        defaultValue="day"
      />
      <SegmentedControl
        label="Medium"
        size="medium"
        options={options}
        defaultValue="day"
      />
      <SegmentedControl
        label="Large"
        size="large"
        options={options}
        defaultValue="day"
      />
    </div>
  );
}
