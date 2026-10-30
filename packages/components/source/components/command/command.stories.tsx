import type { Meta, StoryObj } from '@storybook/react-vite';
import { Archive, FilePlus, Settings } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '../button/button.js';
import { Command, type CommandGroup, type CommandItem } from './command.js';

function createNoteCommands(onSelect?: (value: string) => void) {
  const newNote: CommandItem = {
    value: 'new-note',
    label: 'New note',
    description: 'Create a blank note in the current folder',
    keywords: ['create', 'add'],
    icon: <FilePlus size={16} />,
    shortcut: ['Mod', 'N'],
    onSelect: () => onSelect?.('new-note'),
  };
  const openSettings: CommandItem = {
    value: 'open-settings',
    label: 'Open settings',
    icon: <Settings size={16} />,
    shortcut: ['Mod', ','],
    onSelect: () => onSelect?.('open-settings'),
  };
  const archiveNote: CommandItem = {
    value: 'archive-note',
    label: 'Archive note',
    description: 'Not available in the trash folder',
    icon: <Archive size={16} />,
    disabled: true,
    onSelect: () => onSelect?.('archive-note'),
  };

  return { newNote, openSettings, archiveNote };
}

const flatItems = (() => {
  const { newNote, openSettings, archiveNote } = createNoteCommands();
  return [newNote, openSettings, archiveNote];
})();

const groupedItems: CommandGroup[] = (() => {
  const { newNote, openSettings, archiveNote } = createNoteCommands();
  return [
    { label: 'Notes', items: [newNote, archiveNote] },
    { label: 'Application', items: [openSettings] },
  ];
})();

const meta = {
  title: 'Components/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    items: flatItems,
  },
} satisfies Meta<typeof Command>;

export default meta;

type Story = StoryObj<typeof meta>;

type PaletteTriggerProps = {
  items: readonly CommandItem[] | readonly CommandGroup[];
  shortcut?: string | null;
  label?: string;
  children?: ReactNode;
};

function PaletteTrigger({
  items,
  shortcut = null,
  label,
  children,
}: PaletteTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <Command.Dialog
        items={items}
        open={open}
        onOpenChange={setOpen}
        shortcut={shortcut}
        label={label}
      >
        {children}
      </Command.Dialog>
    </>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default command palette with flat items.',
      },
    },
  },
  render: (args) => <PaletteTrigger items={args.items} />,
};

export const Groups: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Commands can be organized into labeled groups.',
      },
    },
  },
  args: {
    items: groupedItems,
  },
  render: (args) => <PaletteTrigger items={args.items} />,
};

export const Shortcut: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Command dialogs can be opened using keyboard shortcuts such as `Mod+K`.',
      },
    },
  },
  render: (args) => (
    <PaletteTrigger
      items={args.items}
      shortcut="Mod+K"
      label="Command palette"
    />
  ),
};

export const CustomShortcut: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Custom keyboard shortcuts can be bound to open the dialog.',
      },
    },
  },
  render: (args) => (
    <PaletteTrigger items={args.items} shortcut="Alt+P" label="Quick actions" />
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Command dialogs support controlled open state and item selection tracking.',
      },
    },
  },
  render: () => <ControlledDialogDemo />,
};

function ControlledDialogDemo() {
  const [open, setOpen] = useState(false);
  const [lastSelected, setLastSelected] = useState<string | null>(null);
  const { newNote, openSettings, archiveNote } =
    createNoteCommands(setLastSelected);

  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <p>Last selected: {lastSelected ?? 'none'}</p>
      <Command.Dialog
        items={[newNote, openSettings, archiveNote]}
        open={open}
        onOpenChange={setOpen}
        shortcut={null}
      />
    </div>
  );
}

export const Resizing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Command dialogs automatically animate their height as search results change.',
      },
    },
  },
  render: (args) => <PaletteTrigger items={args.items} />,
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Custom empty states are displayed when no commands match the search query.',
      },
    },
  },
  render: (args) => (
    <PaletteTrigger items={args.items}>
      <Command.Input />
      <Command.List />
      <Command.Empty>Nothing matches. Try a different word.</Command.Empty>
    </PaletteTrigger>
  ),
};

export const Composed: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Commands can be composed manually with subcomponents.',
      },
    },
  },
  args: {
    items: groupedItems,
  },
  render: (args) => (
    <PaletteTrigger items={args.items}>
      <Command.Input placeholder="Type a command" />
      <Command.List>
        {(item: CommandItem) => <Command.Item item={item} />}
      </Command.List>
      <Command.Empty />
    </PaletteTrigger>
  ),
};
