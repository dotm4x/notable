'use client';

import { ToggleGroup } from '@dotm4x/one/components';
import { Bold, Italic, Underline } from '@dotm4x/one/icons';

export default function Multiple() {
  return (
    <ToggleGroup
      type="multiple"
      aria-label="Text formatting"
      defaultValue={['bold', 'underline']}
    >
      <ToggleGroup.Item value="bold">
        <Bold aria-hidden="true" />
        Bold
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic">
        <Italic aria-hidden="true" />
        Italic
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline">
        <Underline aria-hidden="true" />
        Underline
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}
