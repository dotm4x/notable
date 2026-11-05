'use client';

import { RadioGroup, RadioGroupItem } from '@dotm4x/one/components';

export default function Disabled() {
  return (
    <RadioGroup
      label="Access level"
      description="Managed by your organization."
      defaultValue="standard"
      disabled
    >
      <RadioGroupItem value="standard" label="Standard access" />
      <RadioGroupItem value="restricted" label="Restricted access" />
    </RadioGroup>
  );
}
