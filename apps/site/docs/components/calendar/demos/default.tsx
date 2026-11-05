'use client';

import { Calendar } from '@dotm4x/one/components';

export default function Default() {
  return <Calendar defaultMonth={new Date(2025, 2, 1)} locale="en-US" />;
}
