'use client';

import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@dotm4x/one/components';

const editors: ComboboxOption[] = [
  { value: 'vim', label: 'Vim' },
  { value: 'vscode', label: 'Visual Studio Code' },
  { value: 'webstorm', label: 'WebStorm' },
  { value: 'zed', label: 'Zed' },
];

export default function WithClear() {
  const [value, setValue] = useState<string | null>('vscode');

  return (
    <div style={{ display: 'grid', gap: 12, width: 'min(100%, 20rem)' }}>
      <Combobox items={editors} value={value} onValueChange={setValue}>
        <Combobox.Input label="Editor" placeholder="Search editors">
          <Combobox.Clear />
          <Combobox.Trigger />
        </Combobox.Input>
        <Combobox.Content>
          <Combobox.List />
        </Combobox.Content>
      </Combobox>
      <p style={{ margin: 0 }}>Selected: {value ?? 'none'}</p>
    </div>
  );
}
