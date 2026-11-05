'use client';

import { DateRangePicker } from '@dotm4x/one/components';

export default function Clearable() {
  return (
    <DateRangePicker
      aria-label="Trip dates"
      locale="en-US"
      clearable
      placeholder="Choose your trip dates"
      defaultValue={{
        start: new Date(2025, 5, 2),
        end: new Date(2025, 5, 9),
      }}
    />
  );
}
