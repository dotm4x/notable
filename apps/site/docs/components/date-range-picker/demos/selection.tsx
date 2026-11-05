'use client';

import { DateRangePicker } from '@dotm4x/one/components';

export default function Selection() {
  return (
    <DateRangePicker
      aria-label="Reporting period"
      locale="en-US"
      defaultValue={{
        start: new Date(2025, 2, 10),
        end: new Date(2025, 2, 14),
      }}
    />
  );
}
