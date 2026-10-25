import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch.js';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    label: 'Enable notifications',
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    label: 'Dark mode',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Automatic updates',
    description: 'Install updates when they are available.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable setting',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Managed by your organization',
    disabled: true,
    defaultChecked: true,
  },
};

export const Invalid: Story = {
  args: {
    label: 'Required consent',
    invalid: true,
    error: 'Please enable this setting to continue.',
  },
};

export const Settings: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '20px' }}>
      <Switch
        label="Email notifications"
        description="Receive important updates by email."
        defaultChecked
      />
      <Switch
        label="Weekly summary"
        description="Get a weekly overview of your activity."
      />
    </div>
  ),
};
