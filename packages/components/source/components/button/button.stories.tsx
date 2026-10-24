import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button.js';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    loading: false,
    iconOnly: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    children: <span aria-hidden="true">＋</span>,
    'aria-label': 'Add item',
  },
};

export const IconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button variant="ghost" iconOnly aria-label="Add item">
        <span aria-hidden="true">＋</span>
      </Button>

      <Button variant="outline" iconOnly aria-label="Search">
        <span aria-hidden="true">⌕</span>
      </Button>

      <Button variant="secondary" iconOnly aria-label="More options">
        <span aria-hidden="true">···</span>
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Saving...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const LoadingVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <Button loading>Primary</Button>
      <Button variant="secondary" loading>
        Secondary
      </Button>
      <Button variant="outline" loading>
        Loading
      </Button>
      <Button variant="danger" loading>
        Deleting...
      </Button>
    </div>
  ),
};

export const LongLabel: Story = {
  args: {
    children: 'Continue to checkout',
  },
};
