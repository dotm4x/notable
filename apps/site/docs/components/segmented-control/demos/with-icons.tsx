'use client';

import { SegmentedControl } from '@dotm4x/one/components';
import { Laptop, Moon, Sun } from '@dotm4x/one/icons';

export default function WithIcons() {
  return (
    <SegmentedControl
      label="Appearance"
      defaultValue="system"
      options={[
        { label: 'Light', value: 'light', icon: <Sun aria-hidden="true" /> },
        { label: 'Dark', value: 'dark', icon: <Moon aria-hidden="true" /> },
        {
          label: 'System',
          value: 'system',
          icon: <Laptop aria-hidden="true" />,
        },
      ]}
    />
  );
}
