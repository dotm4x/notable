'use client';

import { Calendar } from '@dotm4x/one/components';

export default function Range() {
  return (
    <Calendar
      defaultMonth={new Date(2025, 2, 1)}
      locale="en-US"
      rangeStart={new Date(2025, 2, 10)}
      rangeEnd={new Date(2025, 2, 16)}
    />
  );
}
