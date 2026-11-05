'use client';

import { RadioGroup, RadioGroupItem } from '@dotm4x/one/components';

export default function WithDescriptions() {
  return (
    <RadioGroup
      label="Profile visibility"
      description="Choose who can find your profile."
      defaultValue="members"
    >
      <RadioGroupItem
        value="public"
        label="Public"
        description="Anyone on the internet can view your profile."
      />
      <RadioGroupItem
        value="members"
        label="Members only"
        description="Only signed-in members can view your profile."
      />
      <RadioGroupItem
        value="private"
        label="Private"
        description="Only you can view your profile."
      />
    </RadioGroup>
  );
}
