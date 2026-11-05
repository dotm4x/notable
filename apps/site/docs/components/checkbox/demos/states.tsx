'use client';

import { Checkbox } from '@dotm4x/one/components';

export default function States() {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled and checked" disabled defaultChecked />
    </div>
  );
}
