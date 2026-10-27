import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CheckboxGroup } from './checkbox-group.js';

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
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

export const Default: Story = {};

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

export const Controlled: Story = {
  render: () => <ControlledCheckboxGroup />,
};

export const Uncontrolled: Story = {
  args: {
    defaultValue: ['push', 'marketing'],
  },
};

export const WithLabelAndDescription: Story = {
  args: {
    label: 'Notifications',
    description: 'Choose which notifications you want to receive.',
    defaultValue: ['email'],
  },
};

export const DisabledOptions: Story = {
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

export const DisabledGroup: Story = {
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

export const WithItemDescriptions: Story = {
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

export const EmptySelection: Story = {
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
