'use client';

import { Command, type CommandItem } from '@dotm4x/one/components';
import { FilePlus, Search, Settings } from '@dotm4x/one/icons';

const commands: CommandItem[] = [
  {
    value: 'new-note',
    label: 'New note',
    description: 'Create a blank note in the current folder',
    keywords: ['create', 'add'],
    icon: <FilePlus size={16} />,
    shortcut: ['Mod', 'N'],
  },
  {
    value: 'search-notes',
    label: 'Search notes',
    keywords: ['find'],
    icon: <Search size={16} />,
    shortcut: ['Mod', 'F'],
  },
  {
    value: 'open-settings',
    label: 'Open settings',
    icon: <Settings size={16} />,
    shortcut: ['Mod', ','],
  },
];

export default function Default() {
  return (
    <div style={{ width: 'min(100%, 26rem)' }}>
      <Command items={commands}>
        <Command.Input />
        <Command.List />
        <Command.Empty />
      </Command>
    </div>
  );
}
