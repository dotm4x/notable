'use client';

import { Command, type CommandGroup } from '@dotm4x/one/components';
import { Archive, FilePlus, Settings } from '@dotm4x/one/icons';

const groups: CommandGroup[] = [
  {
    label: 'Notes',
    items: [
      {
        value: 'new-note',
        label: 'New note',
        icon: <FilePlus size={16} />,
        shortcut: ['Mod', 'N'],
      },
      {
        value: 'archive-note',
        label: 'Archive note',
        description: 'Not available in the trash folder',
        icon: <Archive size={16} />,
        disabled: true,
      },
    ],
  },
  {
    label: 'Application',
    items: [
      {
        value: 'open-settings',
        label: 'Open settings',
        icon: <Settings size={16} />,
        shortcut: ['Mod', ','],
      },
    ],
  },
];

export default function Grouped() {
  return (
    <div style={{ width: 'min(100%, 26rem)' }}>
      <Command items={groups}>
        <Command.Input />
        <Command.List />
        <Command.Empty />
      </Command>
    </div>
  );
}
