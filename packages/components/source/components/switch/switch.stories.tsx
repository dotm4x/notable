import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './switch.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    label: 'Enable notifications',
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default toggle switch state.',
      },
    },
  },
};

export const Checked: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Switches can be initialized in a checked state.',
      },
    },
  },
  args: {
    defaultChecked: true,
    label: 'Dark mode',
  },
};

export const Description: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Switches can include supplementary description text.',
      },
    },
  },
  args: {
    label: 'Automatic updates',
    description: 'Install updates when they are available.',
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Switches can be disabled to prevent toggling.',
      },
    },
  },
  args: {
    label: 'Unavailable setting',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Disabled switches in a checked state representing locked settings.',
      },
    },
  },
  args: {
    label: 'Managed by your organization',
    disabled: true,
    defaultChecked: true,
  },
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Switches support invalid error states and error messages.',
      },
    },
  },
  args: {
    label: 'Required consent',
    invalid: true,
    error: 'Please enable this setting to continue.',
  },
};

export const Settings: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Switches grouped together in a settings list layout.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'Switches support dragging the thumb horizontally in addition to clicking.',
      },
    },
  },
  render: () => <DraggableSwitches />,
};
