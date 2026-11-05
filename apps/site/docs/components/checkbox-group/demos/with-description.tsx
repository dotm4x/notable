'use client';

import { CheckboxGroup } from '@dotm4x/one/components';

export default function WithDescription() {
  return (
    <CheckboxGroup
      label="Profile visibility"
      description="Choose what other members can see."
    >
      <CheckboxGroup.Item
        value="email"
        label="Email address"
        description="Show your email address on your profile."
      />
      <CheckboxGroup.Item
        value="activity"
        label="Activity status"
        description="Let others see when you were last active."
      />
      <CheckboxGroup.Item
        value="phone"
        label="Phone number"
        description="Managed by your organization."
        disabled
      />
    </CheckboxGroup>
  );
}
