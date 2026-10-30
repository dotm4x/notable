import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './spinner.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    size: 'medium',
    label: 'Loading',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default loading spinner indicator.',
      },
    },
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Spinners support small, medium, and large sizing.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--notable-spacing-6)',
      }}
    >
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
    </div>
  ),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Spinners inherit color from text color or parent styles.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--notable-spacing-6)',
      }}
    >
      <span style={{ color: 'var(--notable-color-info)' }}>
        <Spinner />
      </span>

      <span style={{ color: 'var(--notable-color-danger)' }}>
        <Spinner />
      </span>

      <span style={{ color: 'var(--notable-color-success)' }}>
        <Spinner />
      </span>

      <span style={{ color: 'var(--notable-color-text)' }}>
        <Spinner />
      </span>
    </div>
  ),
};

export const Text: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Spinners paired with loading label text.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--notable-spacing-2)',
        color: 'var(--notable-color-text)',
        fontFamily: 'var(--notable-font-family)',
      }}
    >
      <Spinner size="small" />
      <span>Loading your projects...</span>
    </div>
  ),
};

export const Large: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Large spinner for prominent loading states.',
      },
    },
  },
  args: {
    size: 'large',
    label: 'Loading content',
  },
};
