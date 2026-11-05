'use client';

import { Checkbox } from '@dotm4x/one/components';

export default function Description() {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Checkbox
        label="Email updates"
        description="Receive occasional updates about your account."
      />
      <Checkbox
        label="Product updates"
        description="News about features and improvements."
        defaultChecked
      />
    </div>
  );
}
