import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox.js';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Accept the terms and conditions',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all items',
    indeterminate: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Email updates',
    description: 'Receive occasional updates about your account.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable option',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Already selected',
    disabled: true,
    defaultChecked: true,
  },
};

export const Preferences: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Checkbox
        label="Product updates"
        description="News about features and improvements."
        defaultChecked
      />
      <Checkbox
        label="Community events"
        description="Invitations to meetups and online events."
      />
      <Checkbox label="Terms and conditions" required />
    </div>
  ),
};
