'use client';

import { Combobox, type ComboboxOption } from '@dotm4x/one/components';

const fruits: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
];

export default function Default() {
  return (
    <div style={{ width: 'min(100%, 20rem)' }}>
      <Combobox items={fruits}>
        <Combobox.Input label="Fruit" placeholder="Search fruit" />
        <Combobox.Content>
          <Combobox.List />
        </Combobox.Content>
      </Combobox>
    </div>
  );
}
