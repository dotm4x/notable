'use client';

import { TimePicker } from '@dotm4x/one/components';

export default function TwelveHour() {
  return (
    <TimePicker
      aria-label="Meeting start"
      format="12h"
      defaultValue="09:30"
      locale="en-US"
    />
  );
}
