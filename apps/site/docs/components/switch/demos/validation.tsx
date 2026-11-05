'use client';

import { Switch } from '@dotm4x/one/components';

export default function Validation() {
  return (
    <Switch
      label="Require two-factor authentication"
      description="Applies to every member of the workspace."
      error="Two-factor authentication must be enabled for admins."
    />
  );
}
