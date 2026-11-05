'use client';

import { Select } from '@dotm4x/one/components';
import { useState } from 'react';

const planOptions = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
];

export default function Controlled() {
  const [plan, setPlan] = useState<string | null>('pro');

  return (
    <div
      style={{ display: 'grid', gap: 'var(--one-spacing-3)', width: '18rem' }}
    >
      <Select value={plan} onValueChange={setPlan}>
        <Select.Label>Plan</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="Choose a plan" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            {planOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select>
      <p style={{ margin: 0 }}>Selected plan: {plan ?? 'none'}</p>
    </div>
  );
}
