'use client';

import { useState } from 'react';
import { CheckboxGroup } from '@dotm4x/one/components';

const options = [
  { value: 'analytics', label: 'Usage analytics' },
  { value: 'crash', label: 'Crash reports' },
  { value: 'ads', label: 'Personalized ads' },
];

export default function Controlled() {
  const [selected, setSelected] = useState<string[]>(['analytics']);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <CheckboxGroup
        label="Data sharing"
        value={selected}
        onValueChange={setSelected}
      >
        {options.map((option) => (
          <CheckboxGroup.Item key={option.value} {...option} />
        ))}
      </CheckboxGroup>
      <p style={{ margin: 0 }}>
        {selected.length > 0
          ? `Sharing: ${selected.join(', ')}`
          : 'No data shared'}
      </p>
    </div>
  );
}
