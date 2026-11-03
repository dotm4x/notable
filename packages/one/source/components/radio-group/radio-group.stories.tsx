import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './radio-group.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
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
  parameters: {
    docs: {
      description: {
        story: 'The default vertical radio group.',
      },
    },
  },
  args: {
    defaultValue: 'daily',
  },
};

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Radio groups support horizontal orientation.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Radio groups in standard vertical layout.',
      },
    },
  },
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

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Radio groups support controlled value state management.',
      },
    },
  },
  render: () => <ControlledRadioGroup />,
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

export const Selection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Radio groups can be initialized with a preselected default value.',
      },
    },
  },
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

export const DisabledOption: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Individual radio items within a group can be disabled.',
      },
    },
  },
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

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'An entire radio group can be disabled.',
      },
    },
  },
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

export const Descriptions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Individual radio items can include supplementary descriptions.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Radio groups support required validation inside native forms.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Radio groups support small, medium, and large sizing.',
      },
    },
  },
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
