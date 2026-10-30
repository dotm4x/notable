import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CheckboxGroup } from './checkbox-group.js';

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Notifications',
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <CheckboxGroup.Item value="email" label="Email notifications" />
      <CheckboxGroup.Item value="push" label="Push notifications" />
      <CheckboxGroup.Item value="marketing" label="Marketing updates" />
    </CheckboxGroup>
  ),
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default checkbox group with multiple options.',
      },
    },
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Checkbox groups can be controlled via `value` and `onValueChange`.',
      },
    },
  },
  render: () => <ControlledCheckboxGroup />,
};

export const Uncontrolled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Checkbox groups can manage their state uncontrolled using `defaultValue`.',
      },
    },
  },
  args: {
    defaultValue: ['push', 'marketing'],
  },
};

export const Description: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Checkbox groups can include a group-level description.',
      },
    },
  },
  args: {
    label: 'Notifications',
    description: 'Choose which notifications you want to receive.',
    defaultValue: ['email'],
  },
};

export const DisabledItem: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Individual checkbox items within a group can be disabled.',
      },
    },
  },
  args: {
    label: 'Data sharing',
    defaultValue: ['analytics'],
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <CheckboxGroup.Item value="analytics" label="Usage analytics" />
      <CheckboxGroup.Item value="crash" label="Crash reports" />
      <CheckboxGroup.Item value="ads" label="Personalized ads" disabled />
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'An entire checkbox group can be disabled.',
      },
    },
  },
  args: {
    label: 'Managed by your organization',
    disabled: true,
    defaultValue: ['email'],
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <CheckboxGroup.Item value="email" label="Email notifications" />
      <CheckboxGroup.Item value="push" label="Push notifications" />
    </CheckboxGroup>
  ),
};

export const ItemDescription: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Individual options can include supplementary descriptions.',
      },
    },
  },
  args: {
    label: 'Visibility',
    description: 'Choose what other members can see.',
    defaultValue: ['email'],
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <CheckboxGroup.Item
        value="email"
        label="Email address"
        description="Show your email address on your profile."
      />
      <CheckboxGroup.Item
        value="activity"
        label="Activity status"
        description="Let others see when you were last active."
      />
    </CheckboxGroup>
  ),
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A checkbox group with no initial selection.',
      },
    },
  },
  args: {
    label: 'Newsletters',
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <CheckboxGroup.Item value="weekly" label="Weekly digest" />
      <CheckboxGroup.Item value="monthly" label="Monthly roundup" />
    </CheckboxGroup>
  ),
};

function ControlledCheckboxGroup() {
  const [selected, setSelected] = useState<string[]>(['email']);

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <CheckboxGroup
        label="Notifications"
        value={selected}
        onValueChange={setSelected}
      >
        <CheckboxGroup.Item value="email" label="Email notifications" />
        <CheckboxGroup.Item value="push" label="Push notifications" />
        <CheckboxGroup.Item value="marketing" label="Marketing updates" />
      </CheckboxGroup>
      <p style={{ margin: 0 }}>Selected: {selected.join(', ') || 'none'}</p>
    </div>
  );
}
