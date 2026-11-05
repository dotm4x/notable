'use client';

import { useState } from 'react';
import { DateRangePicker, type DateRange } from '@dotm4x/one/components';

export default function Default() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <DateRangePicker
        aria-label="Stay dates"
        locale="en-US"
        value={range}
        onValueChange={setRange}
      />
      <p style={{ margin: 0 }}>
        {range.start
          ? `${range.start.toLocaleDateString('en-US')} to ${
              range.end ? range.end.toLocaleDateString('en-US') : 'an open end'
            }`
          : 'No stay dates selected'}
      </p>
    </div>
  );
}
