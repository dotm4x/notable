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
    layout: 'padded',
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
  render: (args) => <PaletteTrigger items={args.items} />,
};

export const Grouped: Story = {
  args: {
    items: groupedItems,
  },
  render: (args) => <PaletteTrigger items={args.items} />,
};

export const DialogWithShortcut: Story = {
  render: (args) => (
    <PaletteTrigger
      items={args.items}
      shortcut="Mod+K"
      label="Command palette"
    />
  ),
};

export const CustomShortcut: Story = {
  render: (args) => (
    <PaletteTrigger items={args.items} shortcut="Alt+P" label="Quick actions" />
  ),
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

export const ControlledDialog: Story = {
  render: () => <ControlledDialogDemo />,
};

export const ResizingResults: Story = {
  render: (args) => <PaletteTrigger items={args.items} />,
};

export const EmptyResults: Story = {
  render: (args) => (
    <PaletteTrigger items={args.items}>
      <Command.Input />
      <Command.List />
      <Command.Empty>Nothing matches. Try a different word.</Command.Empty>
    </PaletteTrigger>
  ),
};

export const Composed: Story = {
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
