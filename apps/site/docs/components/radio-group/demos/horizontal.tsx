'use client';

import { RadioGroup, RadioGroupItem } from '@dotm4x/one/components';

export default function Horizontal() {
  return (
    <RadioGroup
      label="Display density"
      orientation="horizontal"
      defaultValue="comfortable"
    >
      <RadioGroupItem value="compact" label="Compact" />
      <RadioGroupItem value="comfortable" label="Comfortable" />
      <RadioGroupItem value="spacious" label="Spacious" />
    </RadioGroup>
  );
}
