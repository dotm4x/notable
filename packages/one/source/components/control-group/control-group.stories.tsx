import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../button/button.js';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu.js';
import { Input } from '../input/input.js';
import { Popover } from '../popover/popover.js';
import { Select } from '../select/select.js';
import { ControlGroup } from './control-group.js';

const meta = {
  title: 'Components/ControlGroup',
  component: ControlGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof ControlGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ControlGroup aria-label="Text formatting">
      <Button variant="outline">Bold</Button>
      <Button variant="outline">Italic</Button>
      <Button variant="outline">Underline</Button>
    </ControlGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ControlGroup orientation="vertical" aria-label="Document actions">
      <Button variant="outline">Move up</Button>
      <Button variant="outline">Move down</Button>
      <Button variant="outline">Delete</Button>
    </ControlGroup>
  ),
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole('button');
    const [moveUp, moveDown, deleteButton] = buttons;

    if (!moveUp || !moveDown || !deleteButton) {
      throw new Error('Expected three vertically grouped buttons.');
    }

    const previousGap =
      moveDown.getBoundingClientRect().top -
      moveUp.getBoundingClientRect().bottom;
    const finalGap =
      deleteButton.getBoundingClientRect().top -
      moveDown.getBoundingClientRect().bottom;

    expect(finalGap).toBe(previousGap);
  },
};

export const Nested: Story = {
  render: () => (
    <ControlGroup aria-label="Editor controls">
      <Button variant="outline">Undo</Button>
      <Button variant="outline">Redo</Button>
      <ControlGroup aria-label="Text formatting">
        <Button variant="outline">Bold</Button>
        <Button variant="outline">Italic</Button>
      </ControlGroup>
    </ControlGroup>
  ),
};

export const InputComposition: Story = {
  render: () => (
    <ControlGroup aria-label="Search controls">
      <Input aria-label="Search notes" placeholder="Search notes" />
      <Button variant="outline">Search</Button>
    </ControlGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    const inputBox = input.closest<HTMLElement>('.one-field__box');
    const searchButton = canvas.getByRole('button', { name: 'Search' });

    if (!inputBox) {
      throw new Error('Input field box was not rendered.');
    }

    expect(getComputedStyle(inputBox).borderTopLeftRadius).toBe(
      getComputedStyle(searchButton).borderTopRightRadius,
    );
    expect(input).toHaveAccessibleName('Search notes');
  },
};

export const SelectComposition: Story = {
  render: () => (
    <ControlGroup aria-label="Filter controls">
      <Select.Root defaultValue="all">
        <Select.Trigger aria-label="Category">
          <Select.Value placeholder="Category" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            <Select.Item value="all">All notes</Select.Item>
            <Select.Item value="shared">Shared</Select.Item>
            <Select.Item value="private">Private</Select.Item>
          </Select.List>
        </Select.Content>
      </Select.Root>
      <Button variant="outline">Apply</Button>
    </ControlGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectTrigger = canvas.getByRole('combobox', { name: 'Category' });
    const applyButton = canvas.getByRole('button', { name: 'Apply' });

    expect(getComputedStyle(applyButton).backgroundColor).toBe(
      getComputedStyle(selectTrigger).backgroundColor,
    );
  },
};

export const FieldAndSelectComposition: Story = {
  render: () => (
    <ControlGroup aria-label="Search and filter">
      <Input aria-label="Search notes" placeholder="Search notes" />
      <Select.Root defaultValue="all">
        <Select.Trigger aria-label="Category">
          <Select.Value placeholder="Category" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            <Select.Item value="all">All notes</Select.Item>
            <Select.Item value="shared">Shared</Select.Item>
            <Select.Item value="private">Private</Select.Item>
          </Select.List>
        </Select.Content>
      </Select.Root>
    </ControlGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Search notes' });
    const inputBox = input.closest<HTMLElement>('.one-field__box');
    const selectTrigger = canvas.getByRole('combobox', { name: 'Category' });

    if (!inputBox) {
      throw new Error('Input field box was not rendered.');
    }

    // The select renders a hidden input after its trigger, which must not stop
    // the trigger from closing the group on the trailing edge.
    expect(getComputedStyle(selectTrigger).borderTopRightRadius).toBe(
      getComputedStyle(inputBox).borderTopLeftRadius,
    );
  },
};

export const SplitButton: Story = {
  render: () => (
    <ControlGroup aria-label="Save actions">
      <Button>Save</Button>
      <ControlGroup.Separator />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>More save options</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Save as a copy</DropdownMenu.Item>
          <DropdownMenu.Item>Save and close</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </ControlGroup>
  ),
};

export const PopoverComposition: Story = {
  render: () => (
    <ControlGroup aria-label="Display actions">
      <Button variant="outline">Refresh</Button>
      <Popover>
        <Popover.Trigger>
          <Button variant="outline">Display options</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Display options</Popover.Title>
          <Popover.Description>
            Choose how notes appear in this view.
          </Popover.Description>
        </Popover.Content>
      </Popover>
    </ControlGroup>
  ),
};

export const DisabledControls: Story = {
  render: () => (
    <ControlGroup aria-label="Unavailable controls">
      <Button variant="outline" disabled>
        Save
      </Button>
      <Input aria-label="Unavailable name" placeholder="Name" disabled />
      <Button variant="outline">Cancel</Button>
    </ControlGroup>
  ),
};
