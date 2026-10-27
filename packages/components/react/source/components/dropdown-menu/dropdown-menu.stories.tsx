import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropdownMenu } from './dropdown-menu.js';
import { Shortcut } from '../shortcut/shortcut.js';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Archive</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};

export const WithGroupsAndShortcuts: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>File</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>Document</DropdownMenu.GroupLabel>
          <DropdownMenu.Item>
            New note
            <Shortcut>Ctrl</Shortcut>
            <Shortcut>N</Shortcut>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            Duplicate
            <Shortcut>Ctrl</Shortcut>
            <Shortcut>D</Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>Danger zone</DropdownMenu.GroupLabel>
          <DropdownMenu.Item disabled>Delete permanently</DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Bottom start</DropdownMenu.Trigger>
        <DropdownMenu.Content side="bottom" align="start">
          <DropdownMenu.Item>Rename</DropdownMenu.Item>
          <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Top end</DropdownMenu.Trigger>
        <DropdownMenu.Content side="top" align="end">
          <DropdownMenu.Item>Rename</DropdownMenu.Item>
          <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  ),
};

export const CustomTrigger: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button type="button">Plain button trigger</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};
