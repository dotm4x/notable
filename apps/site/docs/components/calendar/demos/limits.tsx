'use client';

import { Calendar } from '@dotm4x/one/components';

export default function Limits() {
  return (
    <Calendar
      defaultMonth={new Date(2025, 2, 1)}
      defaultValue={new Date(2025, 2, 14)}
      locale="en-US"
      minDate={new Date(2025, 2, 10)}
      maxDate={new Date(2025, 4, 20)}
      isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
    />
  );
}
