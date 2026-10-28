import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './radio-group.js';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    label: 'Notification frequency',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="instant" label="Instant" />
      <RadioGroupItem value="daily" label="Daily digest" />
      <RadioGroupItem value="weekly" label="Weekly summary" />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'daily',
  },
};

export const Horizontal: Story = {
  args: {
    label: 'Display density',
    orientation: 'horizontal',
    defaultValue: 'comfortable',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="compact" label="Compact" />
      <RadioGroupItem value="comfortable" label="Comfortable" />
      <RadioGroupItem value="spacious" label="Spacious" />
    </RadioGroup>
  ),
};

export const Vertical: Story = {
  args: {
    label: 'Theme',
    orientation: 'vertical',
    defaultValue: 'system',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="light" label="Light" />
      <RadioGroupItem value="dark" label="Dark" />
      <RadioGroupItem value="system" label="Match system" />
    </RadioGroup>
  ),
};

function ControlledRadioGroup() {
  const [plan, setPlan] = useState('free');

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <RadioGroup label="Plan" value={plan} onValueChange={setPlan}>
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
        <RadioGroupItem value="team" label="Team" />
      </RadioGroup>
      <p style={{ margin: 0 }}>Selected plan: {plan}</p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledRadioGroup />,
};

export const DefaultSelection: Story = {
  args: {
    label: 'Shipping speed',
    defaultValue: 'standard',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="standard" label="Standard" />
      <RadioGroupItem value="express" label="Express" />
    </RadioGroup>
  ),
};

export const DisabledOptions: Story = {
  args: {
    label: 'Export format',
    defaultValue: 'pdf',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="pdf" label="PDF" />
      <RadioGroupItem value="csv" label="CSV" />
      <RadioGroupItem value="xml" label="XML" disabled />
    </RadioGroup>
  ),
};

export const DisabledGroup: Story = {
  args: {
    label: 'Managed by your organization',
    disabled: true,
    defaultValue: 'secure',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="secure" label="Require verification" />
      <RadioGroupItem value="standard" label="Standard access" />
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  args: {
    label: 'Visibility',
    description: 'Choose who can find your profile.',
    defaultValue: 'members',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem
        value="public"
        label="Public"
        description="Anyone on the internet can view your profile."
      />
      <RadioGroupItem
        value="members"
        label="Members only"
        description="Only signed-in members can view your profile."
      />
      <RadioGroupItem
        value="private"
        label="Private"
        description="Only you can view your profile."
      />
    </RadioGroup>
  ),
};

export const Required: Story = {
  args: {
    label: 'Preferred contact method',
    required: true,
  },
  render: (args) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
      style={{ display: 'grid', gap: '16px', justifyItems: 'start' }}
    >
      <RadioGroup {...args} name="contact">
        <RadioGroupItem value="email" label="Email" />
        <RadioGroupItem value="phone" label="Phone" />
      </RadioGroup>
      <button type="submit">Submit</button>
    </form>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <RadioGroup label="Small" size="small" defaultValue="a">
        <RadioGroupItem value="a" label="Option A" />
        <RadioGroupItem value="b" label="Option B" />
      </RadioGroup>
      <RadioGroup label="Medium" size="medium" defaultValue="a">
        <RadioGroupItem value="a" label="Option A" />
        <RadioGroupItem value="b" label="Option B" />
      </RadioGroup>
      <RadioGroup label="Large" size="large" defaultValue="a">
        <RadioGroupItem value="a" label="Option A" />
        <RadioGroupItem value="b" label="Option B" />
      </RadioGroup>
    </div>
  ),
};
