'use client';

import { ToggleGroup } from '@dotm4x/one/components';
import { LayoutGrid } from '@dotm4x/one/icons';

export default function Vertical() {
  return (
    <ToggleGroup
      type="single"
      orientation="vertical"
      variant="outline"
      aria-label="View density"
      defaultValue="comfortable"
    >
      <ToggleGroup.Item value="compact">Compact</ToggleGroup.Item>
      <ToggleGroup.Item value="comfortable">
        <LayoutGrid aria-hidden="true" />
        Comfortable
      </ToggleGroup.Item>
      <ToggleGroup.Item value="spacious">Spacious</ToggleGroup.Item>
    </ToggleGroup>
  );
}
