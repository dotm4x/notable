'use client';

import { CheckboxGroup } from '@dotm4x/one/components';

export default function Default() {
  return (
    <CheckboxGroup
      label="Notifications"
      description="Choose how you want to hear from us."
      defaultValue={['email']}
    >
      <CheckboxGroup.Item value="email" label="Email notifications" />
      <CheckboxGroup.Item value="push" label="Push notifications" />
      <CheckboxGroup.Item value="sms" label="SMS notifications" />
    </CheckboxGroup>
  );
}
