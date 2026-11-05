'use client';

import { TimePicker } from '@dotm4x/one/components';

export default function MinuteStep() {
  return (
    <TimePicker
      aria-label="Support call slot"
      defaultValue="10:15"
      minuteStep={15}
      minTime="09:00"
      maxTime="17:00"
      placeholder="Choose a slot"
    />
  );
}
