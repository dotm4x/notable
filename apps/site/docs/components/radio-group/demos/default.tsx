'use client';

import { RadioGroup, RadioGroupItem } from '@dotm4x/one/components';

export default function Default() {
  return (
    <RadioGroup
      label="Notification frequency"
      description="Choose how often we email you."
      defaultValue="daily"
    >
      <RadioGroupItem value="instant" label="Instant" />
      <RadioGroupItem value="daily" label="Daily digest" />
      <RadioGroupItem value="weekly" label="Weekly summary" />
    </RadioGroup>
  );
}
