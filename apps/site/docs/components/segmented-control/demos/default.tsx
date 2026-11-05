'use client';

import { SegmentedControl } from '@dotm4x/one/components';

export default function Default() {
  return (
    <SegmentedControl
      label="Reporting period"
      defaultValue="week"
      options={[
        { label: 'Day', value: 'day' },
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
      ]}
    />
  );
}
