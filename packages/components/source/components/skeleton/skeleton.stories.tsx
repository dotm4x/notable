import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './skeleton.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    variant: 'rectangular',
    animation: 'shimmer',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default skeleton placeholder.',
      },
    },
  },
  args: {
    width: 280,
    height: 48,
  },
};

export const Dimensions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons supporting custom widths, heights, and corner radii.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', width: 360 }}>
      <Skeleton width="100%" height="2rem" />
      <Skeleton width="60%" height="12px" />
      <Skeleton width={120} height={120} radius="lg" />
      <Skeleton width="100%" height={96} radius={4} />
    </div>
  ),
};

export const Text: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons styled for loading text line placeholders.',
      },
    },
  },
  args: {
    variant: 'text',
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.5rem', width: 320 }}>
      <Skeleton {...args} width="100%" />
      <Skeleton {...args} width="92%" />
      <Skeleton {...args} width="78%" />
      <Skeleton {...args} width="40%" />
    </div>
  ),
};

export const Circular: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons styled for circular avatar or icon placeholders.',
      },
    },
  },
  args: {
    variant: 'circular',
    width: 48,
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Skeleton {...args} width={32} />
      <Skeleton {...args} width={48} />
      <Skeleton {...args} width={72} />
      <Skeleton {...args} width={undefined} height={96} />
    </div>
  ),
};

export const Rectangular: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons styled for rectangular image or card placeholders.',
      },
    },
  },
  args: {
    variant: 'rectangular',
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem', width: 320 }}>
      <Skeleton {...args} width="100%" height={160} radius="md" />
      <Skeleton {...args} width="100%" height={40} radius="sm" />
      <Skeleton {...args} width="100%" height={24} radius="full" />
    </div>
  ),
};

export const Pulse: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons supporting pulse animation style.',
      },
    },
  },
  args: {
    animation: 'pulse',
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem', width: 320 }}>
      <Skeleton {...args} variant="text" width="100%" />
      <Skeleton {...args} variant="rectangular" width="100%" height={96} />
      <Skeleton {...args} variant="circular" width={48} />
    </div>
  ),
};

export const Static: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons with animations disabled.',
      },
    },
  },
  args: {
    animation: 'none',
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem', width: 320 }}>
      <Skeleton {...args} variant="text" width="100%" />
      <Skeleton {...args} variant="rectangular" width="100%" height={96} />
      <Skeleton {...args} variant="circular" width={48} />
    </div>
  ),
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeletons combined to represent a loading profile card.',
      },
    },
  },
  render: () => (
    <div
      role="status"
      aria-label="Loading profile"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: 320,
      }}
    >
      <Skeleton variant="circular" width={48} />
      <div style={{ display: 'grid', gap: '0.5rem', flex: 1 }}>
        <Skeleton variant="text" width="60%" height="0.875rem" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  ),
};
