import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox.js';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Accept the terms and conditions',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default checkbox state.',
      },
    },
  },
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Checkboxes can be checked, indeterminate, or disabled.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

export const Description: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Checkboxes can include a description to provide context.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Checkbox
        label="Email updates"
        description="Receive occasional updates about your account."
      />
      <Checkbox
        label="Product updates"
        description="News about features and improvements."
        defaultChecked
      />
    </div>
  ),
};
