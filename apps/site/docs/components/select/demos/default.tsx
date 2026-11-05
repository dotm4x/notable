'use client';

import { Select } from '@dotm4x/one/components';

const shippingOptions = [
  { value: 'standard', label: 'Standard (5–7 days)' },
  { value: 'express', label: 'Express (2 days)' },
  { value: 'overnight', label: 'Overnight' },
];

export default function Default() {
  return (
    <div style={{ width: '18rem' }}>
      <Select defaultValue="express">
        <Select.Label>Shipping speed</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="Choose a speed" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            {shippingOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select>
    </div>
  );
}
