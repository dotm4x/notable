import { CircleEllipsis, Plus, Search } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button.js';
import { Spinner } from '../spinner/spinner.js';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
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
      description: 'The visual style of the button.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'icon', 'icon-small', 'icon-large'],
      description: 'The size of the button.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is non-interactive.',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default button style used for primary actions.',
      },
    },
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Buttons are available in several visual variants to communicate importance and intent.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Buttons come in multiple sizes to fit different contexts.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const Icons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Buttons can be rendered as icons for compact actions.',
      },
    },
  },
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

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Buttons can show a loading state while an action is in progress.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <Button disabled aria-busy="true">
        <Spinner size="small" />
        Saving...
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

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled buttons prevent user interaction.',
      },
    },
  },
  args: {
    disabled: true,
  },
};

export const LongText: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Buttons automatically adjust their width to fit longer labels.',
      },
    },
  },
  args: {
    children: 'Continue to checkout',
  },
};
