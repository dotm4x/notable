'use client';

import { Combobox, type ComboboxOptionGroup } from '@dotm4x/one/components';

const languages: ComboboxOptionGroup[] = [
  {
    label: 'Frontend',
    items: [
      { value: 'react', label: 'React' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'vue', label: 'Vue' },
    ],
  },
  {
    label: 'Backend',
    items: [
      { value: 'go', label: 'Go' },
      { value: 'node', label: 'Node.js' },
      { value: 'rust', label: 'Rust', disabled: true },
    ],
  },
];

export default function Grouped() {
  return (
    <div style={{ width: 'min(100%, 20rem)' }}>
      <Combobox items={languages}>
        <Combobox.Input label="Language" placeholder="Search languages" />
        <Combobox.Content>
          <Combobox.List />
          <Combobox.Empty>No languages found</Combobox.Empty>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}
