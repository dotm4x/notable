'use client';

import { useState } from 'react';
import { Button, Command, type CommandItem } from '@dotm4x/one/components';
import { FilePlus, Settings, Share } from '@dotm4x/one/icons';

const commands: CommandItem[] = [
  {
    value: 'new-note',
    label: 'New note',
    icon: <FilePlus size={16} />,
    shortcut: ['Mod', 'N'],
  },
  {
    value: 'share-workspace',
    label: 'Share workspace',
    icon: <Share size={16} />,
  },
  {
    value: 'open-settings',
    label: 'Open settings',
    icon: <Settings size={16} />,
    shortcut: ['Mod', ','],
  },
];

export default function Dialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <Command.Dialog
        items={commands}
        open={open}
        onOpenChange={setOpen}
        shortcut={null}
        label="Workspace commands"
      />
    </>
  );
}
