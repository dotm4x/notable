import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ContextMenu } from './context-menu.js';
import { Shortcut } from '../shortcut/shortcut.js';

const meta = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <p>Right click here</p>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Rename</ContextMenu.Item>
        <ContextMenu.Item>Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Archive</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
};

export const WithGroupsAndShortcuts: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <p>Right click a note</p>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>Note</ContextMenu.GroupLabel>
          <ContextMenu.Item>
            New note
            <Shortcut>Ctrl</Shortcut>
            <Shortcut>N</Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Item>
            Duplicate
            <Shortcut>Ctrl</Shortcut>
            <Shortcut>D</Shortcut>
          </ContextMenu.Item>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>Danger zone</ContextMenu.GroupLabel>
          <ContextMenu.Item disabled>Delete permanently</ContextMenu.Item>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
};

function CheckboxAndRadioExample() {
  const [showHidden, setShowHidden] = useState(false);
  const [sort, setSort] = useState('name');

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <p>Right click the list</p>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>View</ContextMenu.GroupLabel>
          <ContextMenu.CheckboxItem
            checked={showHidden}
            onCheckedChange={setShowHidden}
          >
            Show hidden files
          </ContextMenu.CheckboxItem>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>Sort by</ContextMenu.GroupLabel>
          <ContextMenu.RadioGroup value={sort} onValueChange={setSort}>
            <ContextMenu.RadioItem value="name">Name</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="modified">
              Modified
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="size">Size</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

export const WithCheckboxAndRadioItems: Story = {
  render: () => <CheckboxAndRadioExample />,
};

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <p>Right click to export</p>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Copy link</ContextMenu.Item>
        <ContextMenu.Submenu>
          <ContextMenu.SubmenuTrigger>Export as</ContextMenu.SubmenuTrigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Markdown</ContextMenu.Item>
            <ContextMenu.Item>PDF</ContextMenu.Item>
            <ContextMenu.Item>HTML</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Submenu>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
};
