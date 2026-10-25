import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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

function DraggableSwitches() {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <Switch
        label="Wi-Fi"
        description="Drag the thumb or click to toggle."
        checked={wifi}
        onChange={(event) => setWifi(event.target.checked)}
      />
      <Switch
        label="Bluetooth"
        description="Connect to nearby devices."
        checked={bluetooth}
        onChange={(event) => setBluetooth(event.target.checked)}
      />
      <Switch label="Airplane mode" description="Uncontrolled and draggable." />
    </div>
  );
}

export const Draggable: Story = {
  render: () => <DraggableSwitches />,
};
