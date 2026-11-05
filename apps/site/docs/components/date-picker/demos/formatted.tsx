'use client';

import { DatePicker } from '@dotm4x/one/components';

const longDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' });

export default function Formatted() {
  return (
    <DatePicker
      aria-label="Delivery date"
      locale="en-US"
      placeholder="Choose a delivery date"
      defaultValue={new Date(2025, 2, 14)}
      formatDate={(date) => longDate.format(date)}
    />
  );
}
