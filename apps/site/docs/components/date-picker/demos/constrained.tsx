'use client';

import { DatePicker } from '@dotm4x/one/components';

const today = new Date();
const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

export default function Constrained() {
  return (
    <DatePicker
      aria-label="Check-in"
      locale="en-US"
      minDate={minDate}
      maxDate={maxDate}
      isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
    />
  );
}
