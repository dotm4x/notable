import { CircleEllipsis, Plus, Search } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button.js';
import { Spinner } from '../spinner/spinner.js';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'icon', 'icon-small', 'icon-large'],
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
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button variant="ghost" size="icon" aria-label="Add item">
        <Plus aria-hidden="true" />
      </Button>

      <Button variant="outline" size="icon-small" aria-label="Search">
        <Search aria-hidden="true" />
      </Button>

      <Button variant="secondary" size="icon-large" aria-label="More options">
        <CircleEllipsis aria-hidden="true" />
      </Button>
    </div>
  ),
};

export const WithSpinner: Story = {
  render: () => (
    <Button disabled aria-busy="true">
      <Spinner size="small" />
      Saving...
    </Button>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const SpinnerVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <Button disabled aria-busy="true">
        <Spinner size="small" />
        Primary
      </Button>
      <Button variant="secondary" disabled aria-busy="true">
        <Spinner size="small" />
        Secondary
      </Button>
      <Button variant="outline" disabled aria-busy="true">
        <Spinner size="small" />
        Loading
      </Button>
      <Button variant="danger" disabled aria-busy="true">
        <Spinner size="small" />
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
