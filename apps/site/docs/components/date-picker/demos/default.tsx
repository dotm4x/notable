'use client';

import { useState } from 'react';
import { DatePicker } from '@dotm4x/one/components';

export default function Default() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <DatePicker
        aria-label="Start date"
        locale="en-US"
        value={date}
        onValueChange={setDate}
      />
      <p style={{ margin: 0 }}>
        {date ? date.toLocaleDateString('en-US') : 'No start date selected'}
      </p>
    </div>
  );
}
